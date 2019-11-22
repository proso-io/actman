import { take, call, put, select, takeLatest } from "redux-saga/effects";
import { LOGIN_REQUEST_ACTION, LOGIN_ENDPOINT } from "./constants";

// function login = (username, password) => {
//   let formData = new FormData();
//   formData.append('username', username);
//   formData.append('password', password);
//   let loginPromise = fetch(LOGIN_ENDPOINT, {
//     method: "POST",
//     body: formData
//   })
// }

export function login(data) {
  console.log(data);
  let formData = new FormData();
  formData.append("username", data.username);
  formData.append("password", data.password);
  let loginPromise = fetch(LOGIN_ENDPOINT, {
    method: "POST",
    body: formData
  });
}

// Individual exports for testing
export default function* loginPageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(LOGIN_REQUEST_ACTION, login);
}
