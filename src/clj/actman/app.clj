(ns actman.app
  (:require
    [ring.util.http-response :refer [ok unauthorized]]
    [reitit.swagger :as swagger]
    [reitit.coercion.schema]
    [reitit.ring.middleware.multipart :as multipart]
    [actman.db.teams :as teams]
    [actman.db.team-units :as team-units]
    [actman.db.form-schemas :as form-schemas]
    [actman.db.programs :as programs]
    [actman.db.organisations :as orgs]
    [actman.db.users :as users]
    [actman.db.media-meta-data :as mmd]
    [actman.api :as api]
    [clojure.pprint :refer [pprint]]
    [cemerick.friend :as friend]
    [actman.auth :as auth]
    [actman.operations-api :as opns]
    [actman.filestorage.core :as files]
    [schema.core :as sc]))

(sc/defschema Team teams/insertion-schema)

(defn add-team
  [team]
  (teams/insert-doc team))

(defn perform-operation
  [request operation-fn query & [operation-args]]
  (println query)
  (let [
    user (friend/current-authentication request)
    ]
    (operation-fn user query operation-args))
  )

(def media-insert-schema {
  :oid string?
  :tags [string?]
  })

(defn superadmin-auth-middleware
  "Authenticate whether requestee is superadmin"
  [handler]
  (fn [request]
    (if (auth/is-superadmin? (friend/current-authentication request))
      (handler request)
      (unauthorized "")
    )))

(defn api-routes []
  [
    ["/api"
      {:parameters {:headers {:a sc/Str}}}
      ["/swagger.json"
        {:get {:no-doc true
          :swagger
            {:info
              {:title "ActMan APIs"}}
           :handler (swagger/create-swagger-handler)}}]
      ["/users"
        {:swagger {:tags ["Users"]}}
        [""
          {
            :post {
              :coercion reitit.coercion.schema/coercion
              :parameters {:body users/insertion-schema}
              :handler (fn [{{:keys [body]} :parameters}] (ok (dissoc (users/create-user body) :pswd)))
            }
          }]
        ["/:id"
          {
            :get {
              :coercion reitit.coercion.schema/coercion
              :parameters {:path {:id sc/Str} :header {:authorization sc/Str}}
              :handler (fn [{{{:keys [id]} :path} :parameters}] (ok (users/get-doc id)))
            }
            :put {
              :coercion reitit.coercion.schema/coercion
              :parameters {:body users/updation-schema :path {:id sc/Str} :header {:authorization sc/Str}}
              :handler (fn [{{:keys [path body]} :parameters}] (ok (users/update-doc (:id path) body)))
            }
            }]
      ]
      ["/organisations"
        {:swagger {:tags ["Organisations"]}}
        [""
          {
            :get {
              :coercion reitit.coercion.schema/coercion
              :parameters {:header {:authorization sc/Str}}
              :handler (fn [req] (ok (orgs/get-docs {})))
            }
            :post {
              :coercion reitit.coercion.schema/coercion
              :parameters {:body orgs/insertion-schema :header {:authorization sc/Str}}
              :handler (fn [{{:keys [body]} :parameters}] (ok (api/register-organisation body)))
            }
          }]
        ["/:id"
          {
            :get {
              :coercion reitit.coercion.schema/coercion
              :parameters {:path {:id sc/Str} :header {:authorization sc/Str}}
              :handler (fn [{{{:keys [id]} :path} :parameters}] (ok (orgs/get-doc id)))
            }
            :put {
              :coercion reitit.coercion.schema/coercion
              :parameters {:body orgs/updation-schema :path {:id sc/Str} :header {:authorization sc/Str}}
              :responses {200 {:body orgs/document-schema}}
              :handler (fn [{{:keys [path body]} :parameters}] (ok (orgs/update-doc (:id path) body)))
            }
            }]
      ]
      ["/teams"
        {:swagger {:tags ["Teams"]}}
        [""
          {
            :get {
              :coercion reitit.coercion.schema/coercion
              :parameters {:query {:oid (:oid Team)} :header {:authorization sc/Str}}
              :handler (fn [{{{:keys [oid]} :query} :parameters}] (ok (teams/get-docs {:oid oid})))
            }
            :post {
              :coercion reitit.coercion.schema/coercion
              :parameters {:body Team :header {:authorization sc/Str}}
              :handler (fn [{{:keys [body]} :parameters}] (ok (add-team body)))
            }
          }]
        ["/:id"
          {
            :get {
              :coercion reitit.coercion.schema/coercion
              :parameters {:path {:id sc/Str} :header {:authorization sc/Str}}
              :handler (fn [{{{:keys [id]} :path} :parameters}] (ok (teams/get-doc id)))
            }
            :put {
              :coercion reitit.coercion.schema/coercion
              :parameters {:body teams/updation-schema :path {:id sc/Str} :header {:authorization sc/Str}}
              :responses {200 {:body teams/document-schema}}
              :handler (fn [{{:keys [path body]} :parameters}] (ok (teams/update-doc (:id path) body)))
            }
            }]
      ]
      ["/team-units"
        {:swagger {:tags ["Team Units"]}}
        [""
          {
            :get {
              :coercion reitit.coercion.schema/coercion
              :parameters {:query {:tid (:tid team-units/document-schema)} :header {:authorization sc/Str}}
              :handler (fn [{{{:keys [tid]} :query} :parameters}] (ok (team-units/get-docs {:tid tid})))
            }
            :post {
              :coercion reitit.coercion.schema/coercion
              :parameters {:body team-units/insertion-schema :header {:authorization sc/Str}}
              :handler (fn [{{:keys [body]} :parameters}] (ok (team-units/insert-doc body)))
            }
          }]
        ["/:id"
          {
            :get {
              :coercion reitit.coercion.schema/coercion
              :parameters {:path {:id sc/Str} :header {:authorization sc/Str}}
              :handler (fn [{{{:keys [id]} :path} :parameters}] (ok (team-units/get-doc id)))
            }
            :put {
              :coercion reitit.coercion.schema/coercion
              :parameters {:body team-units/updation-schema :path {:id sc/Str} :header {:authorization sc/Str}}
              :responses {200 {:body team-units/document-schema}}
              :handler (fn [{{:keys [path body]} :parameters}] (ok (team-units/update-doc (:id path) body)))
            }
            }]
      ]
      ["/schemas"
        {:swagger {:tags ["Form Schemas"]}}
        [""
          {
            :get {
              :coercion reitit.coercion.schema/coercion
              :parameters {:query {:oid (:oid form-schemas/insertion-schema)} :header {:authorization sc/Str}}
              :handler (fn [{{{:keys [oid]} :query} :parameters :as request}] (perform-operation request opns/get-schemas {:oid oid}))
            }
            :post {
              :coercion reitit.coercion.schema/coercion
              :parameters {:body form-schemas/insertion-schema :header {:authorization sc/Str}}
              :handler (fn [{{:keys [body]} :parameters :as request}] (perform-operation request opns/add-schema nil body))
            }
            }]
        ["/:id"
          {
            :get {
              :coercion reitit.coercion.schema/coercion
              :parameters {:path {:id sc/Str} :header {:authorization sc/Str}}
              :handler (fn [{{{:keys [id]} :path} :parameters :as request}] (perform-operation request opns/get-schema id))
            }
            :put {
              :coercion reitit.coercion.schema/coercion
              :parameters {:body form-schemas/updation-schema :path {:id sc/Str} :header {:authorization sc/Str}}
              :responses {200 {:body form-schemas/document-schema}}
              :handler (fn [{{:keys [path body]} :parameters :as request}] (perform-operation request opns/edit-schema (:id path) body))
            }
            }]
      ]
      ["/programs"
        {:swagger {:tags ["Programs"]}}
        [""
          {
            :get {
              :coercion reitit.coercion.schema/coercion
              :parameters {:query {:oid (:oid programs/insertion-schema)} :header {:authorization sc/Str}}
              :handler (fn [{{{:keys [oid]} :query} :parameters}] (ok (programs/get-docs {:oid oid})))
            }
            :post {
              :coercion reitit.coercion.schema/coercion
              :parameters {:body programs/insertion-schema :header {:authorization sc/Str}}
              :handler (fn [{{:keys [body]} :parameters}] (ok (programs/insert-doc body)))
            }
            }]
      ]
      ["/media"
        {:swagger {:tags ["Media"]}}
        [""
          {
            :post {
              :parameters {:multipart {:file multipart/temp-file-part :metadata media-insert-schema}  :header {:authorization string?}}
              :handler (fn [[parameters]] (ok "ok"))
            }
            }]
      ]
    ]])
