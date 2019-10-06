(ns actman.test.db-teams-test
  (:require
    [midje.sweet :refer :all]
    [actman.utils.strings :refer [getstr]]
    [actman.db.teams :refer :all]))


(facts "Testing functions in actman.db.teams"
  (fact "Testing create-admin-team"
    (let [
      admin-team {
        :oid ..oid..
        :name (getstr :DEFAULT_ADMIN_TEAM_NAME)
        :desc (getstr :DEFAULT_ADMIN_TEAM_DESCRIPTION)
      }
      ]
      (create-admin-team ..oid..) => admin-team
      (provided
        (insert-doc admin-team) => admin-team))
  )
)
