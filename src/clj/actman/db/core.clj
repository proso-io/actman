(ns actman.db.core
    (:require
      [monger.core :as mg]
      [monger.collection :as mc]
      [monger.operators :refer :all]
      [mount.core :refer [defstate]]
      [schema.core :as sc]
      [actman.config :refer [env]])
    (:import org.bson.types.ObjectId))

(defstate db*
  :start (-> env :database-url mg/connect-via-uri)
  :stop (-> db* :conn mg/disconnect))

(defstate db
  :start (:db db*))

(declare generate-document-schema)

(defn resolve-nested-schema
  [schema-map]
  (cond
    (:map schema-map) (generate-document-schema (:map schema-map))
    (:array schema-map) [(resolve-nested-schema (:array schema-map))]
    :else schema-map))

(defn generate-document-schema
  [schema]
  (reduce
    #(assoc %1
      (if (and (> (count %2) 3) (= (nth %2 3) :opt))
        (sc/optional-key (first %2))
        (first %2))
      (resolve-nested-schema (second %2)))
    {} schema)
  )

(defn generate-updation-schema
  [schema]
  (reduce
    #(if (and (> (count %2) 3) (= (nth %2 3) :req-ro))
      %1
      (assoc %1
        (sc/optional-key (first %2))
        (resolve-nested-schema (second %2)))
    )
    {} schema)
  )

(defn gen-uid
  []
  (str (ObjectId.)))

(defmacro defCollection
  "Generate following handlers and vars for a collection given the collection name and schema.
    document-schema - schema of the document. Includes all fields of model.
    insertion-schema - schema of document that can be inserted in a collection.
      Excludes :_id field from document-schema.
    updation-schema - schema of object that can be updated in a document.
      Excludes read-only keys from document-schema.
    validate-document, validate-updation-document, validate-insertion-document -
      Methods to validate object with document-schema, insertion-schema and updation-schema respectively.
    insert-doc - method to insert a new document in a collection. Generates a unique id string for a document before inserting.
    update-doc - updates sets-fields in a document with given _id value and returns updated object.
    get-doc - Gets a document with given id.
    get-docs - Gets documents with given query.
  Schema is array of fields where each field is array of key-keyword,
  prismatic/schema compatible schema, description string, :req/:opt/:req-ro (defaults to :req).
  "
  [coll-name schema]
  `(do
    (intern *ns* '~'COLL '~coll-name)
    (let [
      insertion-schema# (generate-document-schema ~schema)
      document-schema# (assoc insertion-schema# :_id sc/Str)
      updation-schema# (generate-updation-schema ~schema)
      ]
      (intern *ns* '~'document-schema document-schema#)
      (intern *ns* '~'insertion-schema insertion-schema#)
      (intern *ns* '~'updation-schema updation-schema#)
      (intern *ns* '~'validate-document
        (fn [document#] (when (sc/validate document-schema# document#) document#)))
      (intern *ns* '~'validate-insertion-document
        (fn [document#] (when (sc/validate insertion-schema# document#) document#)))
      (intern *ns* '~'validate-updation-document
        (fn [document#] (when (sc/validate updation-schema# document#) document#)))
      (intern *ns* '~'insert-doc
        (fn [document#]
          (when (sc/validate insertion-schema# document#)
            (mc/insert-and-return db '~coll-name (merge {:_id (gen-uid)} document#)))))
      (intern *ns* '~'update-doc
        (fn [id# update-obj#]
          (when (sc/validate updation-schema# update-obj#)
            (mc/find-and-modify db '~coll-name {:_id id#} {"$set" update-obj#} {:return-new true}))))
      (intern *ns* '~'get-doc
        (fn [id#]
          (mc/find-map-by-id db '~coll-name id#)))
      (intern *ns* '~'get-docs
        (fn [query-obj#]
          (mc/find-maps db '~coll-name query-obj#))))
    )
  )
