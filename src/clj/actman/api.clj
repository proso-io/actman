(ns actman.api
  (:require
    [actman.db.organisations :as orgs]
    [actman.db.media-meta-data :as mmd]
    [actman.db.access-restrictions :as accres]
    [actman.utils.strings :refer [getstr]]
    [actman.db.form-schemas :as schemas]
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
