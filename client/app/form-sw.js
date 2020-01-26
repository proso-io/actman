import { manageDataSendToServer } from "@proso-io/fobu/dist/uploadUtils";

self.oninstall = function(event) {
  console.log(event);
};

self.onfetch = function(event) {};

self.addEventListener("sync", function(event) {
  if (event.tag === "formDataSync") {
    event.waitUntil(syncIt());
  }
});

// down here are the other functions to go get the indexeddb data and also post to our server

function syncIt() {
  return new Promise((resolve, reject) => {
    getIndexedDB()
      .then(results => {
        console.log(results);
        if (results.length > 0) {
          const result = results[0];
          manageDataSendToServer(
            result.requestParams.submitUrl,
            result.requestParams.submitMethod,
            result.requestParams.mediaUploadUrl,
            result.data,
            result.requestParams.formSchema,
            result.requestParams.mergeObj
          )
            .then(clearData)
            .then(function() {
              resolve();
            })
            .catch(function() {
              reject();
            });
        }
      })
      .catch(function(err) {
        return err;
      });
  });
}

function getIndexedDB() {
  return new Promise(function(resolve, reject) {
    var db = indexedDB.open("formData");
    db.onsuccess = function(event) {
      this.result
        .transaction("formDataObjStore")
        .objectStore("formDataObjStore")
        .getAll().onsuccess = function(event) {
        resolve(event.target.result);
      };
    };
    db.onerror = function(err) {
      reject(err);
    };
  });
}

function clearData() {
  console.log("Data uploaded. Clearing database now.");
  return new Promise(function(resolve, reject) {
    var db = indexedDB.open("formData");
    db.onsuccess = function(event) {
      let db = event.target.result;
      db
        .transaction(["formDataObjStore"], "readwrite")
        .objectStore("formDataObjStore")
        .clear().onsuccess = function(event) {
        console.log("Database cleared.");
      };
    };

    db.onerror = function(err) {
      reject(err);
    };
  });
}
