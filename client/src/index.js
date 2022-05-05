import React from "react";

import ReactDOM from "react-dom";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

import App from "./App";
import Login from "./screens/Auth/Login";
import Register from "./screens/Auth/Register";
import Profile from "./screens/Profile";

import SuperAdmin from "./screens/SuperAdmin/SuperAdmin";
import SuperAdminRegister from "./screens/SuperAdmin/SuperAdminRegister";
import EditUser from "./screens/SuperAdmin/EditUser";
import ForgetPassword from "./screens/Auth/ForgetPassword";
import ResetPassword from "./screens/Auth/ResetPassword";

// schedule imports
import NewSchedule from "./screens/Schedule/NewSchedule";
import ViewSchedule from "./screens/Schedule/ViewSchedule";
import EditSchedule from "./screens/Schedule/EditSchedule";
import MySchedule from "./screens/Schedule/MySchedule";

import ProtectedRoute from "./Routes/ProtectedRoute";
import AdminRoute from "./Routes/AdminRoute";
import SuperAdminRoute from "./Routes/SuperAdminRoute";
import sw from "./sw";
import "./styles/index.css";
import "react-toastify/dist/ReactToastify.css";
ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="/" exact render={(props) => <App {...props} />} />
      <Route path="/login" exact render={(props) => <Login {...props} />} />
      <Route
        path="/register"
        exact
        render={(props) => <Register {...props} />}
      />
      <Route
        path="/users/password/forget"
        exact
        render={(props) => <ForgetPassword {...props} />}
      />
      <Route
        path="/users/password/reset/:token"
        exact
        render={(props) => <ResetPassword {...props} />}
      />
      <ProtectedRoute path="/profile" exact component={Profile} />
      <ProtectedRoute path="/schedule/new" exact component={NewSchedule} />
      <ProtectedRoute path="/schedule/id/:id" exact component={ViewSchedule} />
      <ProtectedRoute
        path="/schedule/id/:id/edit"
        exact
        component={EditSchedule}
      />
      <ProtectedRoute path="/schedule/my" exact component={MySchedule} />

      <SuperAdminRoute path="/superadmin" exact component={SuperAdmin} />
      <SuperAdminRoute
        path="/superadmin/editUser/:id"
        exact
        component={EditUser}
      />
      <Route path="/superadmin/register" exact component={SuperAdminRegister} />
      <Redirect to="/" />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);

sw();
