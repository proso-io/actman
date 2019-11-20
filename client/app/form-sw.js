import { manageDataSendToServer } from "@proso-io/fobu";

self.oninstall = function(event) {
  console.log(event);
};

self.onfetch = function(event) {};

self.onsync = function(event) {
  if (event.tag == "sync") {
    event.waitUntil(syncIt());
  }
};

// down here are the other functions to go get the indexeddb data and also post to our server

function syncIt() {
  return getIndexedDB()
    .then(manageDataSendToServer)
    .catch(function(err) {
      return err;
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
