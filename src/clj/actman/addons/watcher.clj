(ns actman.addons.watcher
  "Watcher addon"
  (:require
    [actman.db.activities :as activities]
    [actman.operations-api :as ops :refer [defOperation]]
    [actman.db.teams :as teams]
    [actman.db.activities :as activities]
    [actman.config :refer [env]]))

(def ID (-> env :addons :watcher))

(defn update-special-action
  "Action function for update-special operation.
  Update special status of an activity"
  [activity activity-id status]
  (when activity
    (activities/update-addon-data activity-id ID {:is-special status})))

(defn update-verified-action
  "Action function for update-verified operation.
  Update verified status of an activity.
  update-verification-object is map of team and verification status"
  [activity activity-id update-verification-obj]
  (when activity
    (activities/update-addon-data activity-id ID {:verified-by update-verification-obj})))

(defn is-special-action
  "Action function for is-special operation.
  Checks for is-special tag"
  [valid-doc id _]
  (-> valid-doc :addonsmetadata (keyword ID) :is-special))

(defn get-verified-by-action
  "Action function for get-verified-by operation.
  Gets verified-by data from doc"
  [valid-doc id _]
  (-> valid-doc :addonsmetadata (keyword ID) :verified-by))

(defOperation update-special
  "Update special status for an activity"
  'actman.db.activities :update-special update-special-action false ID)

(defOperation update-verified
  "Update verified status for an activity"
  'actman.db.activities :update-verified update-verified-action false ID)

(defOperation is-activity-special?
  "Get special status for an activity"
  'actman.db.activities :view-special is-special-action false ID)

(defOperation get-activity-verified-data
  "Get verified data for an activity"
  'actman.db.activities :view-verified get-verified-by-action false ID)

(defn get-query-path
  [key]
  (str "addonsmetadata." ID "." key))

(defOperation get-approved-activities
  "Get activity details for watcher addon"
  'actman.db.activities :view-approved-activities ops/get-activities-action true {(get-query-path "is-approved") true} ID)

(defOperation get-special-activities
  "Get activity details for watcher addon"
  'actman.db.activities :view-special-activities ops/get-activities-action true {(get-query-path "is-special") true} ID)

(defn get-allowed-activities
  [{:keys [oid username teams] :as current-user} query args]
  (println "watcher get-allowed-activities" current-user ID)
  (let [
    team (first teams)
    ]
    (if (= (:rl team) "Head")
      (:data (ops/get-activities current-user query args))
      (concat
        (:data (get-approved-activities current-user query args))
        (:data (get-special-activities current-user query args))))
    ))
