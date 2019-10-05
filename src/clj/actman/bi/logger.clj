(ns actman.bi.logger
  (:require [clojure.tools.logging :as log]))

(defn log [& args]
  (log/info args))

(defn trace [& args]
  (log/trace args))

(defn debug [& args]
  (log/debug args))

(defn info [& args]
  (log/info args))

(defn warn [& args]
  (log/warn args))

(defn error [& args]
  (log/error args))

(defn fatal [& args]
  (log/fatal args))
