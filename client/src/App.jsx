import React from "react";
import Home from "./screens/Home";
import { isLoggedIn } from "./helpers/auth";
import { Redirect } from "react-router-dom";
function App({ history }) {
  if (isLoggedIn()) {
    return <Home />;
  } else {
    return <Redirect to="/login" />;
  }
}

export default App;
