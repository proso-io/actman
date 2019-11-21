(ns actman.db.users
  (:require
    [actman.db.core :as db-core :refer [defCollection]]
    [schema.core :as sc]
    [actman.utils.security :as sutils]
    [actman.db.utils :as db-utils]))

(defCollection Users [
  [:oid sc/Str "Organisation id in which the user belongs"]
  [:teams db-utils/USER_TEAM_ROLE_SCHEMA
    "team units for each team" :opt]
  [:name sc/Str "Name of User"]
  [:email sc/Str "Email id of user" :req]
  [:pswd sc/Str "Password of user"]
  ])

(defn get-user-for-email
  [email]
  (first (get-docs {:email email})))

(defn create-user
  [{:keys [pswd] :as details}]
  (insert-doc (assoc details :pswd (sutils/gen-hash pswd))))

(ns-unmap *ns* 'insert-doc)
