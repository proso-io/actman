(ns actman.test.api-test
  (:require
    [midje.sweet :refer :all]
    [actman.db.organisations :as orgs]
    [actman.utils.strings :refer [getstr]]
    [actman.db.teams :as teams]
    [actman.api :refer :all]))

(facts "Testing functions in actman.api"
  (facts "Testing register-organisation"
    (fact "Testing for invalid name"
      (register-organisation {:name ..name..}) => {:error ..org-name-used..}
      (provided
        (getstr :ORG_NAME_USED) => ..org-name-used..
        (orgs/get-organisation-for-name ..name..) => {:name ..name..}
        (orgs/insert-doc anything) => anything :times 0)
    )
    (fact "Testing for valid name"
      (register-organisation {:name ..name..}) => {:_id ..oid..}
      (provided
        (orgs/get-organisation-for-name ..name..) => nil
        (orgs/insert-doc {:name ..name..}) => {:name ..name.. :_id ..oid..} :times 1
        (teams/create-admin-team ..oid..) => anything :times 1)
    )
  )
)
