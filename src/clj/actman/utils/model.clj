(ns actman.utils.model
  (:require
    [actman.db.programs :as programs]
    [actman.db.form-schemas :as form-schemas]
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
    form-schema (get-form-schema (:sid pid))
    ]
    (println "get-program-schema" program form-schema)
    (:schema form-schema)))
