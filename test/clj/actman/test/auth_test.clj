(ns actman.test.auth-test
  (:require
    [midje.sweet :refer :all]
    [actman.db.teams :as teams]
    [actman.utils.general :as gutil]
    [actman.db.utils :as db-utils]
    [actman.db.access-restrictions :as accres]
    [actman.auth :refer :all]))


; (let [
;   current-user {
;     :_id ..userid..
;     :teams [
;       {
;         :t ..team1..
;         :tu ..unit1..
;         :rl ..role1..
;       }
;     ]
;   }
;   ])

(facts "Testing functions in actman.auth"
  (facts "Testing authorize-team"
    (fact "Testing for team-id not belonging to user's organisation"
      (authorize-team {:oid ..oid.. :teams [{:t ..team-id..}]} ..team-id..) => nil
      (provided
        (teams/get-docs {:oid ..oid..}) => [{:_id ..team1..} {:_id ..team2..}])
    )

    (fact "Testing for user not belonging to team-id"
      (authorize-team {:oid ..oid.. :teams [{:t ..team-id2..}]} ..team-id..) => nil
      (provided
        (teams/get-docs {:oid ..oid..}) => [{:_id ..team-id..} {:_id ..team-id2..}])
    )

    (fact "Testing for valid team"
      (authorize-team {:oid ..oid.. :teams [{:t ..team-id..}]} ..team-id..) => true
      (provided
        (teams/get-docs {:oid ..oid..}) => [{:_id ..team-id..} {:_id ..team-id2..}])
    )

  )

  (facts "Testing is-team-role-equal"
    (fact "Testing for equal teams"
      (is-team-role-equal ..team1.. ..team2..) => true
      (provided
        (db-utils/get-team-role-keys) => ..keys..
        (gutil/is-object-equal-for-keys? ..team1.. ..team2.. ..keys..) => true)
    )

    (fact "Testing for unequal teams"
      (is-team-role-equal ..team1.. ..team2..) => false
      (provided
        (db-utils/get-team-role-keys) => ..keys..
        (gutil/is-object-equal-for-keys? ..team1.. ..team2.. ..keys..) => false)
    )
  )

  (facts "Testing team-role-exists?"
    (fact "Test for exists case"
      (team-role-exists? [..team1.. ..team2..] ..team..) => true
      (provided
        (is-team-role-equal ..team.. ..team1..) => false
        (is-team-role-equal ..team.. ..team2..) => true)
    )

    (fact "Test for non-exists case"
      (team-role-exists? [..team1.. ..team2..] ..team..) => nil
      (provided
        (is-team-role-equal ..team.. ..team1..) => false
        (is-team-role-equal ..team.. ..team2..) => false)
    )
  )

  (facts "Testing contains-valid-team-role?"
    (fact "Test for contains case"
      (contains-valid-team-role? [..team1.. ..team2..] [..team3.. ..team2..]) => true
      (provided
        (team-role-exists? [..team1.. ..team2..] ..team3..) => nil
        (team-role-exists? [..team1.. ..team2..] ..team2..) => true)
    )

    (fact "Test for does not contain case"
      (contains-valid-team-role? [..team1.. ..team2..] [..team3.. ..team4..]) => nil
      (provided
        (team-role-exists? [..team1.. ..team2..] ..team3..) => nil
        (team-role-exists? [..team1.. ..team2..] ..team4..) => nil)
    )
  )

  ; (facts "Testing authorize-operation"
  ;   (fact "Test for username access on entity with single entity"
  ;     (authorize-operation {:username ..user.. :oid ..oid..} ..type..
  ;       ..operation.. ..addon-op..
  ;       {:accessroles {} :accessusers {..operation.. [..user..]}}) => true
  ;     (provided
  ;       (accres/get-docs anything) => [])
  ;   )
  ;
  ;   (fact "Test for user role access on entity with single entity"
  ;     (authorize-operation {:username ..user.. :oid ..oid..} ..type..
  ;       ..operation.. ..addon-op..
  ;       {:accessroles {} :accessusers {..operation.. [..user..]}}) => true
  ;     (provided
  ;       (accres/get-docs anything) => [])
  ;   )
  ; )
)

;{:oid ..oid.. :opn ..operation.. :addon ..addon-op.. :ent ..type..}
