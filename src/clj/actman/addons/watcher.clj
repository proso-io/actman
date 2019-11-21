(ns actman.addons.watcher
  "Watcher addon"
  (:require
    [actman.db.activities :as activities]
    [actman.operations-api :as ops :refer [defOperation]]
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
