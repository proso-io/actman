(ns actman.operations-api
  (:require
    [ring.util.http-response :refer [ok unauthorized not-found created]]
    [actman.auth :as auth]
    [actman.db.teams :as teams]
    [actman.db.team-units :as team-units]
    [actman.db.media-meta-data :as mmd]
    [actman.db.activities :as activities]
    [actman.filestorage.core :as filestorage]
    [actman.utils.model :as mutils]
    [actman.utils.general :as gutils]
    [actman.db.form-schemas :as schemas]))

(defn view-schema-action
  "Action function for get-schema operation.
  Returns received schema wrapped with a response"
  [valid-schema id args _]
  valid-schema)

(defn update-schema-action
  "Action function for edit-schema operation.
  Updates a schema object for given id"
  [valid-schema id update-obj _]
  (when valid-schema
    (schemas/update-doc id update-obj)))

(defn insert-schema-action
  "Action function for add-schema operation.
  Creates a new form schema with given schema object"
  [_1 _2 schema _]
  (schemas/insert-doc schema))

(defn get-schemas-action
  "Action function for get-schemas operation.
  Returns received schemas list wrapped in response"
  [valid-schemas query args _]
  valid-schemas)

(defn upload-media-action
  "Action function for upload-media operation.
  Returns uploaded url"
  [_1 _2 {:keys [file metadata current-user] :as data} _]
  (let [
    {:keys [oid username]} current-user
    filename (str oid "-" username "-" (System/currentTimeMillis))
    {:keys [success message url] :as resp}
      (filestorage/upload-file
        filename
        (:tempfile file))
    mmd
      (when success
        (mmd/insert-doc {
          :oid oid
          :name filename
          :turl (str url)
          }))
    ]
    (assoc resp :url (str "/api/media/" (:_id mmd) "/thumbnail"))))

(defn view-media-action
  "Action function for view-media operation.
  Returns MediaMetaData"
  [mmd id _1 _2]
  mmd)


(defn create-activity-action
  "Action function for create-activity operation"
  [_1 _2 {:keys [pid] :as activity} current-user]
  (println "creating activity" activity (:teams current-user))
  (let [
    team (first (:teams current-user))
    team (assoc team :rl "Head")
    schema (mutils/get-program-schema pid)
    media-tags-map (mutils/get-media-tags-map schema activity)
    ]
    (println "associng team" team media-tags-map)
    (mapv
      #(mmd/update-doc % {:tags (get media-tags-map %)})
      (keys media-tags-map))
    (->
      activity
      (assoc :mstring (gutils/stringify-map-values (:mdata activity)))
      (assoc-in [:accessroles :view] [team])
      (assoc-in [:accessroles :create] [])
      (assoc-in [:accessroles :edit] [])
      (assoc-in [:accessusers] [(:username current-user)])
      (activities/insert-doc))))

(defn add-activity-aux-data
  [{:keys [pid] :as activity}]
  (println "add-activity-aux-data" activity)
  (->
    activity
    (assoc :programName (mutils/get-program-name pid))
    (assoc :schema (mutils/get-program-schema pid))))

(defn edit-activity-action
  "Action function for edit-activity operation"
  [valid-activity id activity _2]
  (when valid-activity 
    (->
      (activities/update-doc id activity)
      (add-activity-aux-data)
  )
  ))

(defn get-activities-action
  "Action function for get-activities operation"
  [activities query _2 _]
  (println "get-activities-action" activities query)
  (if (string? query)
    (add-activity-aux-data activities)
    (mapv add-activity-aux-data activities)))

(defn perform-operation
  "This method is assigned to operations defined by defOperation"
  [entity-db-ns operation-key action-fn find-by-query? operation-query addon-id {:keys [oid username teams] :as current-user} entity-query & [action-args]]
  (let [
    entity-query (if (string? entity-query) entity-query (assoc entity-query :oid oid))
    entity-query (if (string? entity-query) entity-query (merge entity-query operation-query))
    model-key @(ns-resolve entity-db-ns 'COLL)
    model-authorized? (auth/authorize-operation current-user model-key operation-key nil addon-id)
    p (println "\nperform operation authorized check done" addon-id entity-db-ns addon-id entity-query)
    get-all-docs? (and entity-query find-by-query? model-authorized?)
    get-auth-docs? (and entity-query find-by-query? (not model-authorized?))
    get-single-doc? (and entity-query (not find-by-query?))
    p (println "getting auth entities" get-all-docs? addon-id get-auth-docs? get-single-doc?)
    entities
      (cond
        get-all-docs?
          (if addon-id
            (do
              (println "getting addon entity" get-all-docs? addon-id entity-query)
              ((ns-resolve entity-db-ns 'get-docs-for-addon-data) addon-id entity-query))
            ((ns-resolve entity-db-ns 'get-docs) entity-query))
        get-auth-docs? ((ns-resolve entity-db-ns 'get-only-opn-auth-docs) teams username entity-query (name operation-key) addon-id)
        get-single-doc?
          (let [entity ((ns-resolve entity-db-ns 'get-doc) entity-query)]
            (when
              (auth/authorize-operation current-user model-key operation-key entity addon-id)
              entity)))
    p (println "authed entities" entities)
    perform? (boolean (or model-authorized? (not-empty entities)))
    ]
    {
      :performed perform?
      :accessed-existing-entities (mapv :_id (if get-single-doc? [entities] entities))
      :data
        (when perform?
          (action-fn
            entities
            entity-query
            action-args
            current-user))
    }))

(defmacro defOperation
  "Define an operation function in this namespace.
    operation-name: name of operation.
    entity-db-ns: db model namespace of operated entity.
    entity-operation-key: specific operation key defined in db model definitions.
    action-fn: function which accepts 3 arguments - authorized entity object, query,
      and action object.
    Entity object can be single element or array of entities depending on operation;
    action-object will be passed as it is from operation arguments

  The defined operation function takes following arguments
    current-user: user object for authentication returned by
      actman.auth/current-user for an http request
    entity-query: id of resource or a query map for resources on which operation
      is to be performed
    action-args: additional argument to be used by passed action-function."
  [operation-name doc-string entity-db-ns entity-operation-key action-fn & [find-by-query? operation-query addon-id]]
  `(intern *ns* '~operation-name
    (partial perform-operation ~entity-db-ns ~entity-operation-key ~action-fn ~find-by-query? ~operation-query ~addon-id )
      ))

(defOperation get-schema
  "Get schema for a schema id"
  'actman.db.form-schemas :view view-schema-action)

(defOperation edit-schema
  "Edit a schema for a schema id with given updation object"
  'actman.db.form-schemas :edit update-schema-action)

(defOperation add-schema
  "Create a new schema"
  'actman.db.form-schemas :create insert-schema-action)

(defOperation get-schemas
  "Get all schemas for given search query"
  'actman.db.form-schemas :view get-schemas-action true)

(defOperation upload-media
  "Upload new media file"
  'actman.db.media-meta-data :create upload-media-action)

(defOperation view-media
  "Get media metadata"
  'actman.db.media-meta-data :view view-media-action)

(defOperation search-media
  "Get media metadata"
  'actman.db.media-meta-data :view view-media-action true)

(defOperation create-activity
  "Create a new activity"
  'actman.db.activities :create create-activity-action)

(defOperation edit-activity
  "Edit an exisiting activity"
  'actman.db.activities :edit edit-activity-action)

(defOperation get-activity
  "Get activity detalis for an activity id"
  'actman.db.activities :view get-activities-action)

(defOperation get-activities
  "Get activity detalis for given search query"
  'actman.db.activities :view get-activities-action true)
