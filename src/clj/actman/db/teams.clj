(ns actman.db.teams
  (:require
    [actman.db.core :as db-core :refer [defCollection db]]
    [monger.collection :as mc]
    [schema.core :as sc]))

(defCollection Teams [
  [:oid sc/Str "Organisation id for the team"]
  [:name sc/Str "Name of team"]
  [:desc sc/Str "Description of team"]
  ])
