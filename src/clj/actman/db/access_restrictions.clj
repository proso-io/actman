(ns actman.db.access-restrictions
  (:require
    [actman.db.core :as db-core :refer [defCollection]]
    [schema.core :as sc]
    [actman.db.utils :as db-utils]))

(defCollection AccessRestrictions [
  [:oid sc/Str "Id of Organisation" :req-ro]
  [:entity sc/Str "Entity to enforce restriction on" :req-ro]
  [:operation sc/Str "Operation on the entity" :req-ro]
  [:addon sc/Str "If operation belongs to addon" :opt]
  [:accessto db-utils/USER_TEAM_ROLE_SCHEMA "Array of access objects" :req]
  ])
