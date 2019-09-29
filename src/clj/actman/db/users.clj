(ns actman.db.users
  (:require
    [actman.db.core :as db-core :refer [defCollection]]
    [schema.core :as sc]
    [actman.db.utils :as db-utils]))

(defCollection Users [
  [:oid sc/Str "Organisation id in which the user belongs"]
  [:teams db-utils/USER_TEAM_ROLE_SCHEMA
    "team units for each team" :opt]
  [:name sc/Str "Name of User"]
  [:pswd sc/Str "Password of user"]
  ])

(defn create-user
  [{:keys [pswd] :as details}]
  (insert-row (assoc details :pswd (sutils/gen-hash pswd))))
