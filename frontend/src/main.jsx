import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "./app/App.css";
import RouterSetup from "./app/App.router.jsx";
import store from "./app/App.store";

createRoot(document.getElementById('root')).render(

  <Provider store={store}>
    <RouterSetup />
  </Provider>,

);
