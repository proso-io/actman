(ns actman.db.team-units
  (:require
    [actman.db.core :as db-core :refer [defCollection]]
    [schema.core :as sc]))

(defCollection TeamUnits [
  [:oid sc/Str "Organisation Id"]
  [:tid sc/Str "Team id for the team unit"]
  [:name sc/Str "Name of team unit"]
  [:desc sc/Str "Description of team unit"]
  ])
