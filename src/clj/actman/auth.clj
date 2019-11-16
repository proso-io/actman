(ns actman.auth
  "Contains various authentication and authorization methods"
  (:require
    [actman.db.teams :as teams]
    [actman.db.organisations :as orgs]
    [actman.utils.general :as gutil]
    [actman.db.utils :as db-utils]
    [actman.db.access-restrictions :as accres]))

(defn authorize-team
  "checks if user belongs to a team"
  [{:keys [username oid] :as current-user} team-id]
  (let [
    teams (teams/get-docs {:oid oid})
    ]
    (and
      (some #(= team-id (:_id %)) teams)
      (some #(= team-id (:t %)) (:teams current-user))
      ))
  )

(defn is-team-role-equal
  "Checks if value of :t, :tu and :rl keys of team1 and team2 are equal"
  [team1 team2]
  (gutil/is-object-equal-for-keys? team1 team2 (db-utils/get-team-role-keys)))

(defn team-role-exists?
  "Checks if `teams` contains `team`"
  [teams team]
  (some #(is-team-role-equal team %) teams))

(defn contains-valid-team-role?
  "Checks if any of roles from `member-teams` exists in `allowed-teams`"
  [allowed-teams member-teams]
  (reduce
    #(or %1 (team-role-exists? allowed-teams %2))
    false
    member-teams
    ))

(defn authorize-operation
  "Checks if user can perform an operation on entity.
  `entity` is assumed as a vector if `multi` is true else it is assumed to be a single entity element"
  [{:keys [oid username teams] :as current-user} entity-type operation is-addon-operation? entity]
  (let [
    global-access
      (->
        {:oid oid :opn operation :addon is-addon-operation? :ent entity-type}
        (accres/get-docs)
        (first))
    entity-roles-access  (-> entity :accessroles operation)
    entity-users-access  (-> entity :accessusers operation)
    ]
    (or
      (some #(= username %) entity-users-access)
      (some #(= username %) (:users global-access))
      (contains-valid-team-role? entity-roles-access teams)
      (contains-valid-team-role? (:roles global-access) teams)
      )
    ))

(defn is-superadmin?
  "Check whether requestee is a superadmin for organisation"
  [{:keys [oid username teams] :as current-user}]
  (let [
    {:keys [admintid] :as org} (orgs/get-doc oid)
    ]
    (some
      #(gutil/is-object-equal-for-keys? {:t admintid} % (db-utils/get-team-role-keys))
      teams
      )
    ))
