import React from "react";

import ReactDOM from "react-dom";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

import App from "./App";
import Login from "./screens/Auth/Login";
import Register from "./screens/Auth/Register";
import Profile from "./screens/Profile";
import ListFMEA from "./screens/Admin/ListFMEA";
import SuperAdmin from "./screens/SuperAdmin/SuperAdmin";
import SuperAdminRegister from "./screens/SuperAdmin/SuperAdminRegister";
import EditUser from "./screens/SuperAdmin/EditUser";
import ForgetPassword from "./screens/Auth/ForgetPassword";
import ResetPassword from "./screens/Auth/ResetPassword";
import NewFMEA from "./screens/FMEA/NewFMEA";
import MyFMEA from "./screens/FMEA/MyFMEA";
import ViewFMEA from "./screens/FMEA/ViewFMEA";
import EditFMEA from "./screens/FMEA/EditFMEA";
import ImproveFMEA from "./screens/FMEA/ImproveFMEA";
import ResultFMEA from "./screens/FMEA/ResultFMEA";
import Search from "./screens/Search";
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
      <ProtectedRoute path="/fmea/new" exact component={NewFMEA} />
      <ProtectedRoute path="/fmea/my" exact component={MyFMEA} />
      <ProtectedRoute path="/fmea/view/:id" exact component={ViewFMEA} />
      <ProtectedRoute path="/fmea/edit/:id" exact component={EditFMEA} />
      <ProtectedRoute path="/fmea/improve/:id" exact component={ImproveFMEA} />
      <ProtectedRoute path="/result/:search" exact component={ResultFMEA} />
      <ProtectedRoute path="/search" exact component={Search} />
      <AdminRoute path="/admin" exact component={ListFMEA} />
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
