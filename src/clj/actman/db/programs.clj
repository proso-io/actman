(ns actman.db.programs
  (:require
    [actman.db.core :as db-core :refer [defCollection]]
    [schema.core :as sc]))

(defCollection Programs [
  [:oid sc/Str "Organisation id for the program"]
  [:name sc/Str "Name of Program"]
  [:desc sc/Str "Description of Program"]
  [:sid sc/Str "Schema of form for activities under the program" :opt]
  ])
