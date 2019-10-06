(ns actman.api
  (:require
    [actman.db.organisations :as orgs]
    [actman.utils.strings :refer [getstr]]
    [actman.db.teams :as teams]))

(defn register-organisation
  [{:keys [name] :as org-info}]
  (if (orgs/get-organisation-for-name name)
    {:error (getstr :ORG_NAME_USED)}
    (let [
        org (orgs/insert-doc org-info)
      ]
      (teams/create-admin-team (:_id org))
      (select-keys org [:_id])
      )))
