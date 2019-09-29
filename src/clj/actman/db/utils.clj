(ns actman.db.utils
  (:require
    [schema.core :as sc]))

(def ^:const USER_TEAM_ROLE_SCHEMA {
  :array {
    :map [
      [:t sc/Str "Team Id"]
      [:tu sc/Str "Team unit id"]
      [:rl sc/Str "Role in the team"]]
    }
  })

(defn get-access-schema-vector
  "Gets a schema vector of the form [:schema-keyword :schema-map]"
  [operation]
  [operation USER_TEAM_ROLE_SCHEMA])

(defn get-access-schema
  "Get access schema which can be passed to defCollection for given array of operations"
  [ops]
  {
    :map (mapv get-access-schema-vector ops)
  })
