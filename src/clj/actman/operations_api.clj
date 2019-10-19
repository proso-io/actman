(ns actman.operations-api
  (:require
    [ring.util.http-response :refer [ok unauthorized not-found created]]
    [actman.auth :as auth]
    [actman.db.form-schemas :as schemas]))

(defn view-schema-action
  "Action function for get-schema operation.
  Returns received schema wrapped with a response"
  [id schema & args]
  (if schema (ok schema) (not-found))
  )

(defn update-schema-action
  "Action function for edit-schema operation.
  Updates a schema object for given id"
  [id schema update-obj]
  (ok (schemas/update-doc id update-obj)))

(defn insert-schema-action
  "Action function for add-schema operation.
  Creates a new form schema with given schema object"
  [_1 _2 schema]
  (created (schemas/insert-doc schema)))

(defn get-schemas-action
  "Action function for get-schemas operation.
  Returns received schemas list wrapped in response"
  [query schemas args]
  (ok schemas))

(defn perform-operation
  "This method is assigned to operations defined by defOperation"
  [entity-db-ns operation-key action-fn find-by-query? current-user entity-query & [action-args]]
  (let [
    entity
      (when entity-query
        (if find-by-query?
          ((ns-resolve entity-db-ns 'get-docs) entity-query)
          ((ns-resolve entity-db-ns 'get-doc) entity-query)
          ))
    model-key @(ns-resolve entity-db-ns 'COLL)
    authorized?
      (auth/authorize-operation current-user model-key operation-key false entity find-by-query?)
    ]
    (println authorized?)
    (if authorized?
      (action-fn entity action-args)
      (unauthorized))
  ))

(defmacro defOperation
  "Define an operation function in this namespace.
    operation-name: name of operation.
    entity-db-ns: db model namespace of operated entity.
    entity-operation-key: specific operation key defined in db model definitions.
    action-fn: function which accepts 3 arguments - query, entity object
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
