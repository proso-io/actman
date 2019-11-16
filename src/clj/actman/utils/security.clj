(ns actman.utils.security
  (:require
    [cemerick.friend :as friend]
    (cemerick.friend [credentials :as creds])))

(defn gen-hash
  "Returns hash of given string. Uses friend.credentials hash-bcrypt method."
  [str]
  (creds/hash-bcrypt str))
