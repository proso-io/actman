(ns actman.db.teams
  (:require
    [actman.db.core :as db-core :refer [defCollection db]]
    [monger.collection :as mc]
    [actman.utils.strings :refer [getstr]]
    [schema.core :as sc]))

(def ^:const DEFAULT_ADMIN_TEAM_DETAILS {
  :name (getstr :DEFAULT_ADMIN_TEAM_NAME)
  :desc (getstr :DEFAULT_ADMIN_TEAM_DESCRIPTION)
  })

(defCollection Teams [
  [:oid sc/Str "Organisation id for the team" :req-ro]
  [:name sc/Str "Name of team"]
  [:desc sc/Str "Description of team"]
  ])

(defn create-admin-team
  "Create default admin team for organisation id"
  [oid]
  (->
    DEFAULT_ADMIN_TEAM_DETAILS
    (assoc :oid oid)
    (insert-doc)))
