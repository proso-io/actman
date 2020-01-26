(ns actman.db.organisations
  (:require
    [actman.db.core :as db-core :refer [defCollection]]
    [schema.core :as sc]))

(defCollection Organisations [
  [:name sc/Str "Name of the organisation"]
  [:loc sc/Str "Location of the organisation" :opt]
  [:admintid sc/Str "Id of admin team" :opt]
  [:addons [sc/Str] "Installed addon ids" :opt]
  ])

(defn get-organisation-for-name
  [name]
  (first (get-docs {:name name})))
