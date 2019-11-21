import { take, call, put, select, takeLatest } from 'redux-saga/effects';
import { LOGIN_REQUEST_ACTION, LOGIN_ENDPOINT } from './constants';
import { loginResponseAction } from './actions'


export function login(data){
  console.log(data);
  let formData = new FormData();
  formData.append('username', data.username);
  formData.append('password', data.password);
  let loginPromise = fetch(LOGIN_ENDPOINT, {
    method: "POST",
    body: formData
  });
  loginPromise.then(response => {
    //console.log("res", response);//})
    let url = response.url;
    let querystring = url.substring(url.indexOf("?"));
    let urlParams = new URLSearchParams(querystring);
    //console.log("url params", urlParams);
    if(urlParams.get("success") === "true"){
      console.log("Login successful");
      //yield put(loginResponseAction(true));
    } else {
      console.log("Login failed");
      //yield put(loginResponseAction(false));
    }
  })
}

// Individual exports for testing
export default function* loginPageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(LOGIN_REQUEST_ACTION, login);
}
