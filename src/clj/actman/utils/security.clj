(ns actman.utils.security
  (:require
    [cemerick.friend :as friend]
    [digest :as digest]
    [buddy.core.nonce :as nonce]
    [buddy.core.codecs :as codecs]
    (cemerick.friend [credentials :as creds])))

(defn gen-hash
  "Returns hash of given string. Uses friend.credentials hash-bcrypt method."
  [str]
  (creds/hash-bcrypt str))
