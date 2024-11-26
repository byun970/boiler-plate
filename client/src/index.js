import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import "antd/dist/reset.css";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import promiseMiddleware from "redux-promise";
import { thunk } from "redux-thunk"; // Named import로 수정
import Reducer from "./_reducers";

// `createStoreWithMiddleware` 생성 및 redux-thunk와 promiseMiddleware 적용
const createStoreWithMiddleware = applyMiddleware(promiseMiddleware, thunk)(createStore);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider
    store={createStoreWithMiddleware(
      Reducer,
      window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : (f) => f // `window.__REDUX_DEVTOOLS_EXTENSION__`이 없을 때 기본 값 제공
    )}
  >
    <App />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
