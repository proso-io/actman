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
  (let [
    all-eles (get-all-input-elements schema)
    ]
    (filterv #(= "imagesWithTags" (:type %)) all-eles)))

(defn get-media-id-from-url
  [url]
  (let [
    parts (str/split url #"/")
    ]
    (nth parts (- (count parts) 2))))

(defn get-media-tags-map
  [schema activity]
  (let [
    all-eles (get-media-elements schema)
    ]
    (reduce
      (fn [tag-map {:keys [id] :as element}]
        (reduce
          #(assoc %1 (get-media-id-from-url (:fileUrl %2)) (:tags %2))
          tag-map
          ((keyword id) (:mdata activity))))
      {}
      all-eles)))
