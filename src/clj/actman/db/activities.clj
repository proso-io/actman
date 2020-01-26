(ns actman.db.activities
  (:require
    [actman.db.core :as db-core :refer [defCollection]]
    [schema.core :as sc]
    [actman.db.utils :as db-utils]))

(defCollection Activities [
  [:name sc/Str "Name of Activity"]
  [:mdata sc/Any "Metadata of activity"]
  [:mstring sc/Any "Stringified metadata of activity" :opt]
  [:pid sc/Str "Program under which activity is created"]
  [:oid sc/Str "Organisation id"]
  ]
  [:create :view :edit])
