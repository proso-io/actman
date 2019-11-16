(ns actman.routes.home
  (:require
    [actman.layout :as layout]
    [clojure.java.io :as io]
    [actman.middleware :as middleware]
    [ring.util.http-response :as response]))

(defn home-page [request]
  (layout/render request "home.html" {:docs (-> "docs/docs.md" io/resource slurp)}))

(defn about-page [request]
  (layout/render request "about.html"))

(defn home-routes []
  [""
    {:no-doc true}
    {:middleware [middleware/wrap-csrf
                 middleware/wrap-formats]}
    ["/" {:get home-page}]
    ["/about" {:get about-page}]])
