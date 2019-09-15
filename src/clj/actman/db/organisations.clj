(ns actman.db.organisations
  (:require
    [actman.db.core :as db-core :refer [defCollection]]
    [schema.core :as sc]))

(defCollection Organisations [
  [:oid sc/Str "Unique id"]
  [:name sc/Str "Name of the organisation"]
  [:location sc/Str "Location of the organisation" :opt]
  ])
