(ns actman.operations-api
  (:require
    [ring.util.http-response :refer [ok unauthorized not-found created]]
    [actman.auth :as auth]
    [actman.db.form-schemas :as schemas]))

(defn view-schema-action
  [id schema & args]
  (if schema (ok schema) (not-found))
  )

(defn update-schema-action
  [id schema update-obj]
  (ok (schemas/update-doc (:_id schema) update-obj)))

(defn insert-schema-action
  [_1 _2 schema]
  (created (schemas/insert-doc schema)))

(defn get-schemas-action
  [query schemas args]
  (ok schemas))

(defn perform-operation
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
  "Define an operation.
  operation-name: name of operation.
  entity-db-ns: db model namespace of operated entity.
  entity-operation-key: specific operation key defined in db model definitions.
  action-fn: function which accepts 3 arguments - query, entity object and action object.
  Entity object can be single element or array of entities depending on operation;
  action-object will be passed as it is from operation arguments.
  "
  [operation-name entity-db-ns entity-operation-key action-fn & [find-by-query?]]
  `(intern *ns* '~operation-name
    (partial perform-operation ~entity-db-ns ~entity-operation-key ~action-fn ~find-by-query?)
      ))

(defOperation get-schema 'actman.db.form-schemas :view view-schema-action)

(defOperation edit-schema 'actman.db.form-schemas :edit update-schema-action)

(defOperation add-schema 'actman.db.form-schemas :add insert-schema-action)

(defOperation get-schemas 'actman.db.form-schemas :view get-schemas-action true)
