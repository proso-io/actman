(ns actman.api
  (:require
    [actman.db.organisations :as orgs]
    [actman.db.users :as users]
    [actman.db.media-meta-data :as mmd]
    [actman.db.access-restrictions :as accres]
    [actman.utils.strings :refer [getstr]]
    [actman.db.form-schemas :as schemas]
    [actman.db.team-units :as team-units]
    [actman.db.teams :as teams]))

(defn register-organisation
  [{:keys [name] :as org-info}]
  (if (orgs/get-organisation-for-name name)
    {:error (getstr :ORG_NAME_USED)}
    (let [
        org (orgs/insert-doc org-info)
        admin-team (teams/create-admin-team (:_id org))
        org (orgs/update-doc (:_id org) {:admintid (:_id admin-team)})
      ]
      (select-keys org [:_id])
      )))

(defn register-user
  [{:keys [email] :as user-info} req]
  (if (users/get-user-for-email email)
    {:error (getstr :USER_EMAIL_USED)}
    (->
      (users/create-user user-info)
      (dissoc :pswd))))

(defn get-schema-keys-list
  "Get recursively list of key value for all elements in the schema"
  [schema key keys-list]
  (let [
    exclude-types ["group" "section"]
    exclude-current? (some #(= % (:type schema)) exclude-types)
    child-keys (mapv #(get-schema-keys-list %  key []))
    ]
    (cond-> (into keys-list child-keys)
      (not exclude-current?) (merge (key schema)))))

(defn get-activity-search-keys
  "Get list of all keys used for all activity schema for an oid"
  [oid]
  (get-schema-keys-list
    (schemas/get-docs {:oid oid})
    :name
    []))

(defn get-access-operations
  "Get list of all operations for which user has access rights"
  [{:keys [oid username teams] :as current-user}]
  (accres/get-user-access-operations username teams))

(defn get-team-obj
  [teamrole]
  (let [
    team (teams/get-doc (:t teamrole))
    unit (team-units/get-doc (:tu teamrole))
    ]
    (->
      teamrole
      (assoc :team (:name team))
      (assoc :teamunit (:name unit)))))

(defn get-all-teams-obj
  [teamroles]
  (mapv #(get-team-obj %) teamroles))

(defn get-current-user
  [{:keys [oid username teams] :as current-user}]
  (if username
    (let [
      org (orgs/get-doc oid)
      teamroles  (get-all-teams-obj teams)
      ]
      (->
        current-user
        (assoc :orgName (:name org))
        (assoc :teams teamroles)
        (assoc :perms (get-access-operations current-user))
        ))
    {}))
