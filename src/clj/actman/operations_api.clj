(ns actman.operations-api
  (:require
    [ring.util.http-response :refer [ok unauthorized not-found created]]
    [actman.auth :as auth]
    [actman.db.teams :as teams]
    [actman.db.team-units :as team-units]
    [actman.db.media-meta-data :as mmd]
    [actman.filestorage.core :as filestorage]
    [actman.db.form-schemas :as schemas]))

(defn view-schema-action
  "Action function for get-schema operation.
  Returns received schema wrapped with a response"
  [valid-schema id args]
  valid-schema)

(defn update-schema-action
  "Action function for edit-schema operation.
  Updates a schema object for given id"
  [valid-schema id update-obj]
  (when valid-schema
    (schemas/update-doc id update-obj)))

(defn insert-schema-action
  "Action function for add-schema operation.
  Creates a new form schema with given schema object"
  [_1 _2 schema]
  (schemas/insert-doc schema))

(defn get-schemas-action
  "Action function for get-schemas operation.
  Returns received schemas list wrapped in response"
  [valid-schemas query args]
  valid-schemas)

(defn upload-media-action
  "Action function for upload-media operation.
  Returns uploaded url"
  [_1 _2 {:keys [file metadata current-user] :as data}]
  (let [
    {:keys [oid username]} current-user
    filename (str oid "-" username "-" (System/currentTimeMillis))
    {:keys [success message url] :as resp}
      (filestorage/upload-file
        filename
        (:tempfile file))
    ]
    (when success
      (mmd/insert-doc {
        :oid oid
        :name filename
        :turl ""
        }))
    resp))

(defn perform-operation
  "This method is assigned to operations defined by defOperation"
  [entity-db-ns operation-key action-fn find-by-query? {:keys [oid username teams] :as current-user} entity-query & [action-args]]
  (let [
    model-key @(ns-resolve entity-db-ns 'COLL)
    model-authorized? (auth/authorize-operation current-user model-key operation-key false nil)
    get-all-docs? (and entity-query find-by-query? model-authorized?)
    get-auth-docs? (and entity-query find-by-query? (not model-authorized?))
    get-single-doc? (and entity-query (not find-by-query?))
    entities
      (cond
        get-all-docs? ((ns-resolve entity-db-ns 'get-docs) entity-query)
        get-auth-docs? ((ns-resolve entity-db-ns 'get-only-opn-auth-docs) teams username entity-query operation-key)
        get-single-doc?
          (let [entity ((ns-resolve entity-db-ns 'get-doc) entity-query)]
            (when
              (auth/authorize-operation current-user model-key operation-key false entity)
              entity)))
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
            action-args))
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
      friend/current-authentication for an http request
    entity-query: id of resource or a query map for resources on which operation
      is to be performed
    action-args: additional argument to be used by passed action-function."
  [operation-name doc-string entity-db-ns entity-operation-key action-fn & [find-by-query?]]
  `(intern *ns* '~operation-name
    (partial perform-operation ~entity-db-ns ~entity-operation-key ~action-fn ~find-by-query?)
      ))

(defOperation get-schema
  "Get schema for a schema id"
  'actman.db.form-schemas :view view-schema-action)

(defOperation edit-schema
  "Edit a schema for a schema id with given updation object"
  'actman.db.form-schemas :edit update-schema-action)

(defOperation add-schema
  "Create a new schema"
  'actman.db.form-schemas :add insert-schema-action)

(defOperation get-schemas
  "Get all schemas for given search query"
  'actman.db.form-schemas :view get-schemas-action true)

(defOperation upload-media
  "Upload new media file"
  'actman.db.media-meta-data :create upload-media-action)
