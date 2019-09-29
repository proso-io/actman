(ns actman.db.activities
  (:require
    [actman.db.core :as db-core :refer [defCollection]]
    [schema.core :as sc]
    [actman.db.utils :as db-utils]))

(defCollection Activities [
  [:name sc/Str "Name of Activity"]
  [:mdata sc/Str "Metadata of activity"]
  [:pid sc/Str "Program under which activity is created"]
  [:access (db-utils/get-access-schema [:view :edit])
    "Access rights restricted to" :opt]
  ])
