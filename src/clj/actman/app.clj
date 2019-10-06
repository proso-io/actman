(ns actman.app
  (:require
    [ring.util.http-response :refer [ok]]
    [reitit.swagger :as swagger]
    [reitit.coercion.schema]
    [actman.db.teams :as teams]
    [actman.db.team-units :as team-units]
    [actman.db.form-schemas :as form-schemas]
    [actman.db.programs :as programs]
    [schema.core :as sc]))

(sc/defschema Team teams/insertion-schema)

(defn add-team
  [team]
  (teams/insert-doc team))

(defn crash [] (+ 2 ""))

(defn api-routes []
  [
    ["/api"
      ["/swagger.json"
        {:get {:no-doc true
          :swagger
            {:info
              {:title "ActMan APIs"}}
           :handler (swagger/create-swagger-handler)}}]
      ["/teams"
        {:swagger {:tags ["Teams"]}}
        [""
          {
            :get {
              :coercion reitit.coercion.schema/coercion
              :parameters {:query {:oid (:oid Team)}}
              :handler (fn [{{{:keys [oid]} :query} :parameters}] (ok (teams/get-docs {:oid oid})))
            }
            :post {
              :coercion reitit.coercion.schema/coercion
              :parameters {:body Team}
              :handler (fn [{{:keys [body]} :parameters}] (ok (add-team body)))
            }
          }]
        ["/:id"
          {
            :get {
              :coercion reitit.coercion.schema/coercion
              :parameters {:path {:id sc/Str}}
              :handler (fn [{{{:keys [id]} :path} :parameters}] (ok (teams/get-doc id)))
            }
            :put {
              :coercion reitit.coercion.schema/coercion
              :parameters {:body teams/updation-schema :path {:id sc/Str}}
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
              :parameters {:query {:tid (:tid team-units/document-schema)}}
              :handler (fn [{{{:keys [tid]} :query} :parameters}] (ok (team-units/get-docs {:tid tid})))
            }
            :post {
              :coercion reitit.coercion.schema/coercion
              :parameters {:body team-units/insertion-schema}
              :handler (fn [{{:keys [body]} :parameters}] (ok (team-units/insert-doc body)))
            }
          }]
        ["/:id"
          {
            :get {
              :coercion reitit.coercion.schema/coercion
              :parameters {:path {:id sc/Str}}
              :handler (fn [{{{:keys [id]} :path} :parameters}] (ok (team-units/get-doc id)))
            }
            :put {
              :coercion reitit.coercion.schema/coercion
              :parameters {:body team-units/updation-schema :path {:id sc/Str}}
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
              :parameters {:query {:oid (:oid form-schemas/insertion-schema)}}
              :handler (fn [{{{:keys [oid]} :query} :parameters}] (ok (form-schemas/get-docs {:oid oid})))
            }
            :post {
              :coercion reitit.coercion.schema/coercion
              :parameters {:body form-schemas/insertion-schema}
              :handler (fn [{{:keys [body]} :parameters}] (ok (form-schemas/insert-doc body)))
            }
            }]
      ]
      ["/programs"
        {:swagger {:tags ["Programs"]}}
        [""
          {
            :get {
              :coercion reitit.coercion.schema/coercion
              :parameters {:query {:oid (:oid programs/insertion-schema)}}
              :handler (fn [{{{:keys [oid]} :query} :parameters}] (ok (programs/get-docs {:oid oid})))
            }
            :post {
              :coercion reitit.coercion.schema/coercion
              :parameters {:body programs/insertion-schema}
              :handler (fn [{{:keys [body]} :parameters}] (ok (programs/insert-doc body)))
            }
            }]
      ]
    ]])
