import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isLoggedIn } from "../helpers/auth";

const ProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isLoggedIn() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/",
            state: { from: props.location },
          }}
        />
      )
    }
  ></Route>
);

export default ProtectedRoute;
