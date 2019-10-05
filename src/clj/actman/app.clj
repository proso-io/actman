(ns actman.app
  (:require
    [ring.util.http-response :refer [ok]]
    [reitit.swagger :as swagger]
    [reitit.coercion.schema]
    [actman.db.teams :as teams]
    [actman.db.form-schemas :as form-schemas]
    [actman.db.programs :as programs]
    [schema.core :as sc]))

(sc/defschema Team teams/document-schema)
  ;(dissoc teams/document-schema :oid))

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
              :handler (fn [{{{:keys [id]} :path} :parameters}] (ok (teams/get-doc id)))
            }
            }]
      ]
      ["/schemas"
        {:swagger {:tags ["Form Schemas"]}}
        [""
          {
            :get {
              :coercion reitit.coercion.schema/coercion
              :parameters {:query {:oid (:oid form-schemas/document-schema)}}
              :handler (fn [{{{:keys [oid]} :query} :parameters}] (ok (form-schemas/get-docs {:oid oid})))
            }
            :put {
              :coercion reitit.coercion.schema/coercion
              :parameters {:body form-schemas/document-schema}
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
              :parameters {:query {:oid (:oid programs/document-schema)}}
              :handler (fn [{{{:keys [oid]} :query} :parameters}] (ok (programs/get-docs {:oid oid})))
            }
            :post {
              :coercion reitit.coercion.schema/coercion
              :parameters {:body programs/document-schema}
              :handler (fn [{{:keys [body]} :parameters}] (ok (programs/insert-doc body)))
            }
            }]
      ]
    ]])
