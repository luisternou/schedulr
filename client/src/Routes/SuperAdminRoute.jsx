import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isLoggedIn } from "../helpers/auth";

const AdminRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isLoggedIn() && isLoggedIn().role === "superadmin" ? (
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

export default AdminRoute;
