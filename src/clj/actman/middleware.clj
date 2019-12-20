(ns actman.middleware
  (:require
    [actman.env :refer [defaults]]
    [cheshire.generate :as cheshire]
    [cognitect.transit :as transit]
    [clojure.tools.logging :as log]
    [actman.layout :refer [error-page]]
    [ring.middleware.anti-forgery :refer [wrap-anti-forgery]]
    [actman.middleware.formats :as formats]
    [muuntaja.middleware :refer [wrap-format wrap-params]]
    [actman.config :refer [env]]
    [ring-ttl-session.core :refer [ttl-memory-store]]
    [cemerick.friend :as friend]
    (cemerick.friend
      [workflows :as workflows]
      [credentials :as creds]
      [util :as util])
    [actman.db.users :as users]
    [ring.middleware.defaults :refer [site-defaults wrap-defaults]])
  (:import
           ))

(defn wrap-internal-error [handler]
  (fn [req]
    (try
      (handler req)
      (catch Throwable t
        (log/error t (.getMessage t))
        (error-page {:status 500
                     :title "Something very bad has happened!"
                     :message "We've dispatched a team of highly trained gnomes to take care of the problem."})))))

(defn wrap-csrf [handler]
  (wrap-anti-forgery
    handler
    {:error-response
     (error-page
       {:status 403
        :title "Invalid anti-forgery token"})}))


(defn wrap-formats [handler]
  (let [wrapped (-> handler wrap-params (wrap-format formats/instance))]
    (fn [request]
      ;; disable wrap-formats for websockets
      ;; since they're not compatible with this middleware
      ((if (:websocket? request) handler wrapped) request))))

(defn get-user-creds;-internal
  "Return user object for friend credential-fn."
  [email]
  (let [
    creds (users/get-user-for-email email)
    ]
    (println "user creds" email creds)
    (when (:pswd creds)
      (clojure.set/rename-keys creds {:_id :username :pswd :password}))))

;(def get-user-creds (memoize get-user-creds-internal))

(defn wrap-base [handler]
  (-> ((:middleware defaults) handler)
    (friend/authenticate
      {:credential-fn (partial creds/bcrypt-credential-fn get-user-creds)
        :ensure-session false
        :redirect-on-auth? false
        :workflows [(workflows/http-basic :realm "/")
                    (workflows/interactive-form)]
        :login-uri "/api/login"
        :default-landing-uri "/login?success=true"})
      (wrap-defaults
        (-> site-defaults
            (assoc-in [:session :cookie-attrs :http-only] false)
            (assoc-in [:security :anti-forgery] false)
            (assoc-in  [:session :store] (ttl-memory-store (* 60 30)))))
      wrap-internal-error))
