(ns actman.api
  (:require
    [actman.db.organisations :as orgs]
    [actman.db.media-meta-data :as mmd]
    [actman.utils.strings :refer [getstr]]
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
