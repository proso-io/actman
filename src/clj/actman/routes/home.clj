(ns actman.routes.home
  (:require
    [actman.layout :as layout]
    [clojure.java.io :as io]
    [ring.util.http-response :refer [content-type ok unauthorized]]
    [actman.middleware :as middleware]
    [ring.util.http-response :as response]))

(defn serve-index [request]
  (content-type (ok (-> "public/build/index.html" io/resource slurp)) "text/html; charset=utf-8"))

(defn home-page [request]
  (layout/render request "home.html" {:docs (-> "docs/docs.md" io/resource slurp)}))

(defn about-page [request]
  (layout/render request "about.html"))

(defn serve-index [request]
  (content-type (ok (-> "public/build/index.html" io/resource slurp)) "text/html; charset=utf-8"))

(defn home-routes []
  [""
    {:no-doc true}
    {:middleware [middleware/wrap-csrf
                 middleware/wrap-formats]}
    ["/" {:get serve-index}]
    ["/:page" {:get serve-index}]])
