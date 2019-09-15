(ns actman.db.core
    (:require
      [monger.core :as mg]
      [monger.collection :as mc]
      [monger.operators :refer :all]
      [mount.core :refer [defstate]]
      [schema.core :as sc]
      [actman.config :refer [env]]))

(defstate db*
  :start (-> env :database-url mg/connect-via-uri)
  :stop (-> db* :conn mg/disconnect))

(defstate db
  :start (:db db*))

(defn generate-validation-schema
  [schema]
  (reduce
    #(assoc %1
      (if (and (> (count %2) 3) (= (nth %2 3) :opt))
        (sc/optional-key (first %2))
        (first %2))
      (second %2))
    {} schema)
  )

(defmacro defCollection
  "Generate relevant handlers for a collection given the collection name and schema.
  Schema is array of fields where each field is array of key-keyword,
  prismatic/schema compatible schema, description string, :req/:opt"
  [coll-name schema]
  `(do
    (intern *ns* '~'COLL '~coll-name)
    (let [
      validation-schema# (generate-validation-schema ~schema)
      ]
      (intern *ns* '~'validation-schema validation-schema#)
      (intern *ns* '~'validate-document
        (fn [document#] (when (sc/validate validation-schema# document#) document#))))
    )
  )
