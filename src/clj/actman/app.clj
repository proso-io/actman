(ns actman.app
  (:require
    [ring.util.http-response :refer [ok unauthorized found]]
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
    [actman.db.activities :as activities]
    [actman.api :as api]
    [clojure.pprint :refer [pprint]]
    [cemerick.friend :as friend]
    [actman.auth :as auth :refer [current-user]]
    [actman.operations-api :as opns]
    [actman.filestorage.core :as files]
    [cheshire.core :as json]
    [actman.addons.watcher :as watcher]
    [schema.core :as sc]))

(sc/defschema Team teams/insertion-schema)

(defn add-team
  [team]
  (teams/insert-doc team))

(defn perform-operation-internal
  [request operation-fn query & [operation-args]]
  (println "perform=operation-interna-" query)
  (let [
    user (current-user request)
    operation-fn (if (= operation-fn opns/get-activities) watcher/get-allowed-activities operation-fn)
    operation-fn (if (= operation-fn opns/get-activity) watcher/get-allowed-activity operation-fn)
    ]
    (operation-fn user query operation-args))
  )

(defn perform-operation
  [request operation-fn query & [operation-args]]
  (ok (perform-operation-internal request operation-fn query operation-args)))

(defn create-activity
  [request activity]
  (let [
    addonsdata (:addonsmetadata activity)
    activity-resp (perform-operation-internal request opns/create-activity nil (dissoc activity :addonsmetadata))
    id (-> activity-resp :data :_id)
    ]
    (ok
      (perform-operation-internal request watcher/update-activity-data id addonsdata)))
  )

(defn get-media
  [request tags]
  (println "get-media" tags (if tags true false))
  (ok
    (perform-operation-internal
      request
      opns/search-media
      (if tags {:tags {"$in" tags}} {}))))

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
      ["/current-user"
        {
          :get {
            :coercion reitit.coercion.schema/coercion
            :parameters {:header {(sc/optional-key :authorization) sc/Str}}
            :handler (fn [req] (ok  (api/get-current-user (current-user req))))
            }
        }
      ]
      ["/users"
        {:swagger {:tags ["Users"]}}
        [""
          {
            :post {
              :coercion reitit.coercion.schema/coercion
              :parameters {:body users/insertion-schema}
              :handler (fn [{{:keys [body]} :parameters :as request}] (ok (api/register-user body request)))
            }
          }]
        ["/:id"
          {
            :get {
              :coercion reitit.coercion.schema/coercion
              :parameters {:path {:id sc/Str}}
              :handler (fn [{{{:keys [id]} :path} :parameters}] (ok (users/get-doc id)))
            }
            :put {
              :coercion reitit.coercion.schema/coercion
              :parameters {:body users/updation-schema :path {:id sc/Str} }
              :handler (fn [{{:keys [path body]} :parameters}] (ok (users/update-doc (:id path) body)))
            }
          }
        ]
        ["/:id/operations"
          {
            :get {
              :coercion reitit.coercion.schema/coercion
              :parameters {:path {:id sc/Str}  }
              :handler (fn [{{{:keys [id]} :path} :parameters :as request}] (ok (api/get-access-operations (current-user request))))
            }
          }
        ]
      ]
      ["/organisations"
        {:swagger {:tags ["Organisations"]}}
        [""
          {
            :get {
              :coercion reitit.coercion.schema/coercion
              :parameters { }
              :handler (fn [req] (ok (orgs/get-docs {})))
            }
            :post {
              :coercion reitit.coercion.schema/coercion
              :parameters {:body orgs/insertion-schema  }
              :handler (fn [{{:keys [body]} :parameters}] (ok (api/register-organisation body)))
            }
          }]
        ["/:id"
          {
            :get {
              :coercion reitit.coercion.schema/coercion
              :parameters {:path {:id sc/Str}  }
              :handler (fn [{{{:keys [id]} :path} :parameters}] (ok (orgs/get-doc id)))
            }
            :put {
              :coercion reitit.coercion.schema/coercion
              :parameters {:body orgs/updation-schema :path {:id sc/Str}  }
              :responses {200 {:body orgs/document-schema}}
              :handler (fn [{{:keys [path body]} :parameters}] (ok (orgs/update-doc (:id path) body)))
            }
          }
        ]

        ["/:id/activities-search-keys"
          {
            :get {
              :coercion reitit.coercion.schema/coercion
              :parameters {:path {:id sc/Str}  }
              :handler (fn [{{{:keys [id]} :path} :parameters}] (ok (api/get-activity-search-keys id)))
            }
          }
        ]
      ]
      ["/teams"
        {:swagger {:tags ["Teams"]}}
        [""
          {
            :get {
              :coercion reitit.coercion.schema/coercion
              :parameters {:query {:oid (:oid Team)}  }
              :handler (fn [{{{:keys [oid]} :query} :parameters}] (ok (teams/get-docs {:oid oid})))
            }
            :post {
              :coercion reitit.coercion.schema/coercion
              :parameters {:body Team  }
              :handler (fn [{{:keys [body]} :parameters}] (ok (add-team body)))
            }
          }]
        ["/:id"
          {
            :get {
              :coercion reitit.coercion.schema/coercion
              :parameters {:path {:id sc/Str}  }
              :handler (fn [{{{:keys [id]} :path} :parameters}] (ok (teams/get-doc id)))
            }
            :put {
              :coercion reitit.coercion.schema/coercion
              :parameters {:body teams/updation-schema :path {:id sc/Str}  }
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
              :parameters {:query {:tid (:tid team-units/document-schema)}  }
              :handler (fn [{{{:keys [tid]} :query} :parameters}] (ok (team-units/get-docs {:tid tid})))
            }
            :post {
              :coercion reitit.coercion.schema/coercion
              :parameters {:body team-units/insertion-schema  }
              :handler (fn [{{:keys [body]} :parameters}] (ok (team-units/insert-doc body)))
            }
          }]
        ["/:id"
          {
            :get {
              :coercion reitit.coercion.schema/coercion
              :parameters {:path {:id sc/Str}  }
              :handler (fn [{{{:keys [id]} :path} :parameters}] (ok (team-units/get-doc id)))
            }
            :put {
              :coercion reitit.coercion.schema/coercion
              :parameters {:body team-units/updation-schema :path {:id sc/Str}  }
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
              :parameters {:query {:oid (:oid form-schemas/insertion-schema)} :header {(sc/optional-key :authorization) sc/Str}}
              :handler (fn [{{{:keys [oid]} :query} :parameters :as request}] (perform-operation request opns/get-schemas {:oid oid}))
            }
            :post {
              :coercion reitit.coercion.schema/coercion
              :parameters {:body form-schemas/insertion-schema :header {(sc/optional-key :authorization) sc/Str}}
              :handler (fn [{{:keys [body]} :parameters :as request}] (perform-operation request opns/add-schema nil body))
            }
            }]
        ["/:id"
          {
            :get {
              :coercion reitit.coercion.schema/coercion
              :parameters {:path {:id sc/Str} :header {(sc/optional-key :authorization) sc/Str}}
              :handler (fn [{{{:keys [id]} :path} :parameters :as request}] (perform-operation request opns/get-schema id))
            }
            :put {
              :coercion reitit.coercion.schema/coercion
              :parameters {:body form-schemas/updation-schema :path {:id sc/Str} :header {(sc/optional-key :authorization) sc/Str}}
              :handler (fn [{{:keys [path body]} :parameters :as request}] (perform-operation request opns/edit-schema (:id path) body))
            }
            }]
      ]
      ["/activities"
        {:swagger {:tags ["Activities"]}}
        [""
          {
            :get {
              :coercion reitit.coercion.schema/coercion
              :parameters {:query {(sc/optional-key :query) sc/Any} :header {(sc/optional-key :authorization) sc/Str}}
              :handler (fn [{{{:keys [query]} :query} :parameters :as request}] (perform-operation request opns/get-activities
                (json/decode query)))
            }
            :post {
              :coercion reitit.coercion.schema/coercion
              :parameters {:body activities/insertion-schema :header {(sc/optional-key :authorization) sc/Str}}
              :handler (fn [{{:keys [body]} :parameters :as request}] (create-activity request body))
            }
            }]
        ["/:id"
          {
            :get {
              :coercion reitit.coercion.schema/coercion
              :parameters {:path {:id sc/Str} :header {(sc/optional-key :authorization) sc/Str}}
              :handler (fn [{{{:keys [id]} :path} :parameters :as request}] (perform-operation request opns/get-activity id))
            }
            :put {
              :coercion reitit.coercion.schema/coercion
              :parameters {:body activities/updation-schema :path {:id sc/Str} :header {(sc/optional-key :authorization) sc/Str} }
              :handler (fn [{{:keys [path body]} :parameters :as request}] (perform-operation request opns/edit-activity (:id path) body))
            }
            }]
      ]
      ["/programs"
        {:swagger {:tags ["Programs"]}}
        [""
          {
            :get {
              :coercion reitit.coercion.schema/coercion
              :parameters {:query {:oid (:oid programs/insertion-schema)} :header {(sc/optional-key :authorization) sc/Str}}
              :handler (fn [{{{:keys [oid]} :query} :parameters}] (ok (programs/get-docs {:oid oid})))
            }
            :post {
              :coercion reitit.coercion.schema/coercion
              :parameters {:body programs/insertion-schema :header {(sc/optional-key :authorization) sc/Str}}
              :handler (fn [{{:keys [body]} :parameters}] (ok (programs/insert-doc body)))
            }
            }]
      ]
      ["/media"
        {:swagger {:tags ["Media"]}}
        [""
          {
            :get {
              :coercion reitit.coercion.schema/coercion
              :parameters {:query {:tags sc/Str} :header {(sc/optional-key :authorization) sc/Str}}
              :handler (fn [{{{:keys [tags]} :query} :parameters :as request}]
                (println "media" tags)
                (get-media request (when tags (clojure.string/split tags #","))))
            }
            :post {
              :handler (fn [{{:keys [multipart]} :parameters :as request}]
                  (perform-operation request opns/upload-media nil
                    (assoc
                      {:file (get-in request [:multipart-params "file"])}
                      :current-user (current-user request))))
            }
            }]
        ["/:id"
          {
            :get {
              :coercion reitit.coercion.schema/coercion
              :parameters {:path {:id sc/Str} :header {(sc/optional-key :authorization) sc/Str} }
              :handler (fn [{{:keys [multipart]} :parameters :as request}]
                  (perform-operation request opns/upload-media nil
                    (assoc multipart :current-user (current-user request))))
            }
            }]
        ["/:id/thumbnail"
          {
            :get {
              :coercion reitit.coercion.schema/coercion
              :parameters {:path {:id sc/Str}  :header {(sc/optional-key :authorization) sc/Str}}
              :handler
                (fn [{{{:keys [id]} :path} :parameters :as request}]
                    (let [d (perform-operation request opns/view-media id)]
                      (found
                        (-> d :body :data :turl))))
            }
            }]
      ]
      ["/watcher"
        ["/is-activity-special/:id"
          {
            :get {
              :coercion reitit.coercion.schema/coercion
              :parameters {:path {:id sc/Str} :header {(sc/optional-key :authorization) sc/Str} }
              :handler (fn [{{{:keys [id]} :path} :parameters :as request}] (perform-operation request watcher/is-activity-special? id))
            }
            :post {
              :coercion reitit.coercion.schema/coercion
              :parameters {:path {:id sc/Str} :body {:status sc/Bool} :header {(sc/optional-key :authorization) sc/Str}}
              :handler (fn [{{{:keys [id]} :path {:keys [status]} :body} :parameters :as request}]
                  (perform-operation request watcher/update-special id status))
            }
          }
        ]
        ["/is-activity-verified/:id"
          {
            :get {
              :coercion reitit.coercion.schema/coercion
              :parameters {:path {:id sc/Str} :header {(sc/optional-key :authorization) sc/Str} }
              :handler (fn [{{{:keys [id]} :path} :parameters :as request}] (perform-operation request watcher/is-activity-verified? id))
            }
            :post {
              :coercion reitit.coercion.schema/coercion
              :parameters {:path {:id sc/Str} :body {:status sc/Bool} :header {(sc/optional-key :authorization) sc/Str} }
              :handler (fn [{{{:keys [id]} :path {:keys [status]} :body} :parameters :as request}]
                  (perform-operation request watcher/update-verified-activity id status))
            }
          }
        ]
        ["/is-activity-approved/:id"
          {
            :get {
              :coercion reitit.coercion.schema/coercion
              :parameters {:path {:id sc/Str} :header {(sc/optional-key :authorization) sc/Str} }
              :handler (fn [{{{:keys [id]} :path} :parameters :as request}] (perform-operation request watcher/is-activity-approved? id))
            }
            :post {
              :coercion reitit.coercion.schema/coercion
              :parameters {:path {:id sc/Str} :body {:status sc/Bool} :header {(sc/optional-key :authorization) sc/Str} }
              :handler (fn [{{{:keys [id]} :path {:keys [status]} :body} :parameters :as request}]
                  (perform-operation request watcher/update-activity-approved id status))
            }
          }
        ]
        ["/project/:id"
          {
            :get {
              :coercion reitit.coercion.schema/coercion
              :parameters {:path {:id sc/Str} :header {(sc/optional-key :authorization) sc/Str} }
              :handler (fn [{{{:keys [id]} :path} :parameters :as request}] (perform-operation request watcher/get-activity-project id))
            }
            :post {
              :coercion reitit.coercion.schema/coercion
              :parameters {:path {:id sc/Str} :body {:project sc/Str} :header {(sc/optional-key :authorization) sc/Str}}
              :handler (fn [{{{:keys [id]} :path {:keys [project]} :body} :parameters :as request}]
                  (perform-operation request watcher/update-activity-project id project))
            }
          }
        ]
        ["/is-media-verified/:id"
          {
            :get {
              :coercion reitit.coercion.schema/coercion
              :parameters {:path {:id sc/Str} :header {(sc/optional-key :authorization) sc/Str} }
              :handler (fn [{{{:keys [id]} :path} :parameters :as request}] (perform-operation request watcher/is-media-approved? id))
            }
            :post {
              :coercion reitit.coercion.schema/coercion
              :parameters {:path {:id sc/Str} :body {:status sc/Bool} :header {(sc/optional-key :authorization) sc/Str} }
              :handler (fn [{{{:keys [id]} :path {:keys [status]} :body} :parameters :as request}]
                  (perform-operation request watcher/update-verified-media id status))
            }
          }
        ]
      ]
    ]])
