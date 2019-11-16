(ns actman.db.media-meta-data
  (:require
    [actman.db.core :as db-core :refer [defCollection db]]
    [actman.db.utils :as db-utils]
    [monger.collection :as mc]
    [schema.core :as sc]))

(defCollection MediaMetaData [
    [:oid sc/Str "Organisation id for the media" :req-ro]
    [:name sc/Str "Name of media"]
    [:turl sc/Str "Thumbnail URL of media"]
    [:tags [sc/Str] "Tags for media" :opt]
  ]
  [:create :view-thumbnail :edit :download])
