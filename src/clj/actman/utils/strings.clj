(ns actman.utils.strings
  "Contains all string constants to be used in the application.
  Multiple languages can be provisioned later")

(def ^:const strings {
  :ORG_NAME_USED "Name used by other organisation"
  :DEFAULT_ADMIN_TEAM_NAME "Admin Team"
  :DEFAULT_ADMIN_TEAM_DESCRIPTION "Admin team to manage admin activities"
  })

(defn getstr
  [key]
  (key strings))
