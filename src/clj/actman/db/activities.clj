(ns actman.db.activities
  (:require
    [actman.db.core :as db-core :refer [defCollection]]
    [schema.core :as sc]
    [actman.db.utils :as db-utils]))

(defCollection Activities [
  [:name sc/Str "Name of Activity"]
  [:mdata sc/Any "Metadata of activity"]
  [:pid sc/Str "Program under which activity is created"]
  ]
  [:create :view :edit])
