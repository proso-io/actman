import { take, call, put, select, takeLatest } from "redux-saga/effects";
import { LOGIN_REQUEST_ACTION, LOGIN_ENDPOINT } from "./constants";
import { loginResponseAction } from "./actions";

function loginRequest(data) {
  let formData = new FormData();
  formData.append("username", data.username);
  formData.append("password", data.password);
  let loginPromise = fetch(LOGIN_ENDPOINT, {
    method: "POST",
    body: formData
  });
  return loginPromise;
}

export function* login(data) {
  console.log(data);
  try {
    const response = yield call(loginRequest, data);
    let url = response.url;
    let querystring = url.substring(url.indexOf("?"));
    let urlParams = new URLSearchParams(querystring);

    if (urlParams.get("success") === "true") {
      yield put(loginResponseAction(1));
    } else {
      yield put(loginResponseAction(-1));
    }
  } catch (err) {
    console.log(err);
    yield put(loginResponseAction(-1));
  }
}

// Individual exports for testing
export default function* loginPageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(LOGIN_REQUEST_ACTION, login);
}
