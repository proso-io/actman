import { formDataUploader } from "@proso-io/fobu/dist/uploadUtils";

class FormDataService {
  dbObj = null;

  constructor() {
    let db = indexedDB.open("formData");
    db.onsuccess = event => {
      this.dbObj = event.target.result;
    };
    db.onerror = function(err) {
      console.log("Failed to mount IndexedDB. All bets are off.");
    };
  }

  hasPendingUploads() {
    return new Promise((resolve, reject) => {
      if (this.dbObj) {
        this.dbObj
          .transaction("formDataObjStore")
          .objectStore("formDataObjStore")
          .getAll().onsuccess = function(event) {
          try {
            if (event.target.result.length > 0) {
              const result = event.target.result[0];
              formDataUploader(
                result.requestParams.submitUrl,
                result.requestParams.submitMethod,
                result.requestParams.mediaUploadUrl,
                result.data,
                result.requestParams.formSchema,
                result.requestParams.mergeObj
              ); // checks if there is an existing request
            }
          } catch (err) {
            console.log(err);
          }
          resolve(event.target.result);
        };
      } else {
        resolve(null);
      }
    });
  }
}

const formDataService = new FormDataService();

export default formDataService;
