(ns actman.auth
  "Contains various authentication and authorization methods"
  (:require
    [actman.db.teams :as teams]
    [actman.db.organisations :as orgs]
    [actman.utils.general :as gutil]
    [actman.db.utils :as db-utils]
    [cemerick.friend :as friend]
    [actman.db.users :as users]
    [actman.db.access-restrictions :as accres]))

(defn current-user
  [request]
  (let [
    {:keys [username] :as auth-user} (friend/current-authentication request)
    ]
    (println "raw current user" auth-user)
    (when username
      (->
        (users/get-doc username)
        (assoc :username username)
        (dissoc :pswd)))))

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
  (gutil/is-object-equal-for-keys? team1 team2 [:t :rl])); (db-utils/get-team-role-keys)))

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
  "Checks if user can perform an operation on entity."
  [{:keys [oid username teams] :as current-user} entity-type operation entity & [addon-id]]
  (println "authorize-operation for" current-user entity-type operation entity addon-id)
  (let [
    a {:oid oid :opn (name operation) :addon addon-id :ent entity-type}
    docs (accres/get-docs a)
    rolespath (if addon-id [:addonsaccess (keyword addon-id) :accessroles operation] [:accessroles operation])
    userspath (if addon-id [:addonsaccess (keyword addon-id) :accessusers operation] [:accessusers]) ;[:accessusers operation]
    global-access
      (->
        {:oid oid :opn (name operation) :addon addon-id :ent entity-type}
        (accres/get-docs)
        (first))
    a (println "global-access" a global-access)
    entity-roles-access (get-in entity rolespath)
    entity-users-access (get-in entity userspath)
    a (println "\n" entity entity-roles-access entity-users-access "\n")
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

(defn is-valid-user?
  "Checks whether current user has given user id"
  [{:keys [oid username teams] :as current-user} id]
  (= username id))

(defn is-team-member?
  "Checks whether current user belongs to provided team id"
  [{:keys [oid username teams] :as current-user} team-id]
  (some
    #(gutil/is-object-equal-for-keys? {:t team-id} % (db-utils/get-team-role-keys))
    teams))

(defn is-org-member?
  "Checks whether current user belongs to provided organisation id"
  [{:keys [oid username teams] :as current-user} org-id]
  (= oid org-id))

; (defmacro auth-middleware
;   [handler auth-fn check-id?]
;   `(fn [request#]
;     (let [
;       current-user# (current-user request)
;       args#
;         (if ~check-id?
;           [current-user#]
;           [current-user# (-> request# :parameters :path :id)])
;       ]
;       (if (apply ~auth-fn args#)
;         (~handler request#)
;         (unauthorized "")
;       ))
;     ))
;
; (defn superadmin-auth-middleware
; "Authenticate whether requestee is superadmin"
; [handler]
; (auth-middleware handler auth/is-superadmin? false))
;
; (defn valid-user-auth-middleware
;   "Authenticate whether requestee is superadmin"
;   [handler]
;   (auth-middleware handler auth/is-valid-user? true))
;
; (defn valid-team-user-auth-middleware
;   "Authenticate whether requestee is superadmin"
;   [handler]
;   (auth-middleware handler auth/is-team-member? true))
;
; (defn valid-org-user-auth-middleware
;   "Authenticate whether requestee is superadmin"
;   [handler]
;   (auth-middleware handler auth/is-org-member? true))
