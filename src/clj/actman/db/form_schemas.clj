(ns actman.db.form-schemas
  (:require
    [actman.db.core :as db-core :refer [defCollection db]]
    [actman.db.utils :as db-utils]
    [monger.collection :as mc]
    [schema.core :as sc]))

(defCollection FormSchemas [
  [:oid sc/Str "Organisation id for the schema" :req-ro]
  [:title sc/Str "Title of form"]
  [:desc sc/Str "Description of form"]
  [:schema sc/Any "Schema of the form"]
  [:pid sc/Str "Program id to which this schema belongs" :opt]
  ; [:access (db-utils/get-access-schema [:edit])
  ;   "Access rights restricted to" :opt]
  ]
  [:create :view :edit])
