(ns actman.utils.model
  (:require
    [actman.db.programs :as programs]
    [actman.db.form-schemas :as form-schemas]
    [clojure.string :as str]
    [clojure.core.memoize :as memo]))

(defn get-program;-internal
  [pid]
  (programs/get-doc pid))

;(def get-program (memo/ttl get-program-internal))

(defn get-form-schema;-internal
  [sid]
  (println "get-form-shemas-internal" sid)
  (form-schemas/get-doc sid))

;(def get-form-schema (memo/ttl get-form-schema-internal))

(defn get-program-name
  [id]
  (let [
    program (get-program id)
    ]
    (:name program)))

(defn get-program-schema
  [pid]
  (let [
    program (get-program pid)
    form-schema (get-form-schema (:sid program))
    ]
    (println "get-program-schema" program form-schema)
    (:schema form-schema)))

(defn get-all-input-elements
  ([schema]
    (get-all-input-elements schema []))
  ([schema eles]
  (if-let [children (:children schema)]
    (reduce
      (fn [elements sch]
        (concat elements (get-all-input-elements sch [])))
      eles
      children)
    (conj eles schema))))

(defn get-media-elements
  [schema]
  (filterv #(= "media" (:type %)) (get-all-input-elements schema)))

(defn get-media-id-from-url
  [url]
  (last (str/split url #"/")))

(defn get-media-tag-map
  [schema]
  (reduce
    (fn [tag-map element]
      (assoc (get-media-id-from-url (:file element)) (:tags element)))
    {}
    (get-media-elements schema)))
