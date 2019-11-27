(ns actman.addons.watcher
  "Watcher addon"
  (:require
    [actman.db.activities :as activities]
    [actman.operations-api :as ops :refer [defOperation]]
    [actman.db.teams :as teams]
    [actman.db.activities :as activities]
    [actman.db.media-meta-data :as media]
    [clojure.set :refer [difference]]
    [actman.config :refer [env]]))

(def ID (-> env :addons :watcher keyword))

(defn update-special-action
  "Action function for update-special operation.
  Update special status of an activity"
  [activity activity-id status _]
  (when activity
    (activities/update-addon-data activity-id ID {:is-special status})))

(defn update-verified-by-list
  [activity verified-by-object]
  (let [
    verified-set (->> activity :addonsmetadata ID :verified-by (into #{}))
    ]
    (reduce
      (fn [verified-set key-val-pair]
        (if (second key-val-pair)
          (conj verified-set (-> key-val-pair first name))
          (difference verified-set #{(-> key-val-pair first name)}))
        )
      verified-set
      verified-by-object)))

(defn update-activity-verified-action
  "Action function for update-verified operation.
  Update verified status of an activity.
  update-verification-object is map of team and verification status"
  [activity activity-id status _]
  (when activity
    (activities/update-addon-data activity-id ID
      {:is-verified status})))

(defn update-activity-approved-action
  "Action function for update-activity-approved operation.
  Update verified status of an activity.
  update-verification-object is map of team and verification status"
  [activity activity-id status _]
  (when activity
    (activities/update-addon-data activity-id ID
      {:is-approved status})))

(defn update-activity-project-action
  "Action function for update-activity-project operation.
  Update verified status of an activity.
  update-verification-object is map of team and verification status"
  [activity activity-id project _]
  (when activity
    (activities/update-addon-data activity-id ID
      {:project project})))

(defn update-media-verified-action
  "Action function for update-verified operation.
  Update verified status of an activity.
  update-verification-object is map of team and verification status"
  [media media-id status _]
  (when media
    (media/update-addon-data media-id ID
      {:is-verified status})))

(defn is-special-action
  "Action function for is-special operation.
  Checks for is-special tag"
  [valid-doc id _1 _2]
  (-> valid-doc :addonsmetadata ID :is-special))

(defn is-verified-action
  "Action function for get-verified-by operation.
  Gets verified-by data from doc"
  [valid-doc id _1 _2]
  (-> valid-doc :addonsmetadata ID :is-verified))

(defn is-approved-action
  "Action function for get-verified-by operation.
  Gets verified-by data from doc"
  [valid-doc id _1 _2]
  (-> valid-doc :addonsmetadata ID :is-approved))

(defn get-activity-project-action
  [valid-doc id _1 _2]
  (-> valid-doc :addonsmetadata ID :project))


(defOperation update-special
  "Update special status for an activity"
  'actman.db.activities :update-special update-special-action false ID)

(defOperation update-verified-activity
  "Update verified status for an activity"
  'actman.db.activities :update-verified update-activity-verified-action false ID)

(defOperation update-activity-approved
  "Update special status for an activity"
  'actman.db.activities :update-approved update-special-action false ID)

(defOperation update-activity-project
  ""
  'actman.db.activities :update-project update-activity-project-action false ID)

(defOperation is-activity-special?
  "Get special status for an activity"
  'actman.db.activities :view-special is-special-action false ID)

(defOperation is-activity-verified?
  "Get verified status for activity"
  'actman.db.activities :view-verified is-verified-action false ID)

(defOperation is-activity-approved?
  "Get approved status for activity"
  'actman.db.activities :view-approved is-approved-action false ID)

(defOperation get-activity-project
  ""
  'actman.db.activities :view-project get-activity-project-action false ID)

(defOperation is-media-approved?
  "Get approved status for activity"
  'actman.db.media-meta-data :view-approved is-approved-action false ID)



; (defOperation get-activity-verified-data
;   "Get verified data for an activity"
;   'actman.db.activities :view-verified get-verified-by-action false ID)

(defn get-query-path
  [key]
  (str "addonsmetadata." ID "." key))

(defOperation get-approved-activities
  "Get activity details for watcher addon"
  'actman.db.activities :view-approved-activities ops/get-activities-action true {(get-query-path "is-approved") true} ID)

(defOperation get-special-activities
  "Get activity details for watcher addon"
  'actman.db.activities :view-special-activities ops/get-activities-action true {(get-query-path "is-special") true} ID)

(defOperation update-verified-media
  "Update verified status for an activity"
  'actman.db.media-meta-data :update-verified update-media-verified-action false ID)

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


(def activity-operation-map {
  :is-special update-special
  :is-verified update-verified-activity
  :is-approved update-activity-approved
  :project update-activity-project
  })

(def media-operation-map {
  :is-verified update-verified-media
  })

(defn update-activity-data
  [{:keys [oid username teams] :as current-user} activity-id addons-data]
  (mapv
    #(when-let [opfn (% activity-operation-map)]
      (opfn current-user activity-id (-> addons-data ID %)))
    (keys addons-data)))

(defn update-media-data
  [{:keys [oid username teams] :as current-user} media-id addons-data]
  (mapv
    #(when-let [opfn (% media-operation-map)]
      (opfn current-user media-id (-> addons-data ID %)))
    (keys addons-data)))
