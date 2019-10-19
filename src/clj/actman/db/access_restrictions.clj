(ns actman.db.access-restrictions
  (:require
    [actman.db.core :as db-core :refer [defCollection]]
    [schema.core :as sc]
    [actman.db.utils :as db-utils]))

(defCollection AccessRestrictions [
  [:oid sc/Str "Id of Organisation" :req-ro]
  [:ent sc/Str "Entity to enforce restriction on" :req-ro]
  [:opn sc/Str "Operation on the entity" :req-ro]
  [:addon sc/Bool "If operation belongs to addon" :req-ro]
  [:roles db-utils/USER_TEAM_ROLE_SCHEMA "Array of user roles" :req]
  [:users [sc/Str] "Array of user ids" :opt]
  ])
