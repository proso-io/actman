(ns actman.filestorage.core
  (:require
    [actman.bi.logger :as log]
    [clojure.java.io :as io]
    [actman.config :refer [env]])
  (:import
    [com.microsoft.azure.storage CloudStorageAccount OperationContext]
    [com.microsoft.azure.storage.blob BlobContainerPublicAccessType BlobRequestOptions]))

(def ^:const MEDIA_CONTAINER "mediafiles")

(def ^:const TEMP_MEDIA_FOLDER "/opt")


(def media-container (atom nil))

(defn init-container
  []
  (let [
    storage-account (CloudStorageAccount/parse (:azure-blob-connection-string env))
    blob-client (.createCloudBlobClient storage-account)
    ]
    (reset! media-container (.getContainerReference blob-client MEDIA_CONTAINER))
    (.createIfNotExists @media-container BlobContainerPublicAccessType/CONTAINER (new BlobRequestOptions) (new OperationContext))
    )
  )

(defn upload-file
  "uploads a file in azure blob storage"
  [filename file]
  (try
    (.uploadFromFile (.getBlockBlobReference @media-container filename) (.getAbsolutePath file))
    (log/info "File uploaded " filename)
    (catch Exception e
      (log/error "File uploading failed" e)
      (str "File uploading failed\n" e)
    ))
    )

(defn get-media-uri
  "Downloads a media file form azure blob storage"
  [filename]
  (let [
    sourceFile (io/file filename)
    blob (.getBlockBlobReference @media-container filename)
    ]
    (println blob )
    (.getUri blob)
    ))
