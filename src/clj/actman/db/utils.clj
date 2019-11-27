(ns actman.db.utils
  (:require
    [schema.core :as sc]))

(def ^:const USER_TEAM_ROLE_SCHEMA {
  :array {
    :map [
      [:t sc/Str "Team Id"]
      [:rl sc/Str "Role in the team"]
      [:tu sc/Str "Team unit id" :opt]]
    }
  })

(defn get-access-schema-vector
  "Gets a schema vector of the form [:schema-keyword :schema-map]"
  [operation]
  [operation USER_TEAM_ROLE_SCHEMA])

(defn get-access-roles-schema
  "Get access schema which can be passed to defCollection for given array of operations"
  [ops]
  {
    :map (mapv get-access-schema-vector ops)
  })

(defn get-team-role-keys []
  (mapv first (-> USER_TEAM_ROLE_SCHEMA :array :map)))
