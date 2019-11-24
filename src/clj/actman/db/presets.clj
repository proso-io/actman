(ns actman.db.presets
  (:require
    [actman.db.core :as db-core :refer [defCollection]]
    [schema.core :as sc]
    [actman.db.utils :as db-utils]))

(defCollection Presets [
  [:oid sc/Str "Organisation Id"]
  [:type sc/Str "Preset Type"]
  [:data sc/Any "Preset data"]
  ]
  [:create :edit])
