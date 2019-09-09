(ns actman.env
  (:require
    [selmer.parser :as parser]
    [clojure.tools.logging :as log]
    [actman.dev-middleware :refer [wrap-dev]]))

(def defaults
  {:init
   (fn []
     (parser/cache-off!)
     (log/info "\n-=[actman started successfully using the development profile]=-"))
   :stop
   (fn []
     (log/info "\n-=[actman has shut down successfully]=-"))
   :middleware wrap-dev})
