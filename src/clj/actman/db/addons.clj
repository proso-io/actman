(ns actman.db.addons
  (:require
    [actman.db.core :as db-core :refer [defCollection]]
    [schema.core :as sc]
    [actman.db.utils :as db-utils]))

(defCollection Addons [
  [:name sc/Str "Name of Addon"]
  [:desc sc/Str "Description" :opt]
  [:opns
    {
      :array {
        :map [
        [:opn sc/Str "Operation key"]
        [:desc sc/Str "Description for operation"]
        ]
      }
    }
    "Operation keys provided by" :opt]
  ]
  )
