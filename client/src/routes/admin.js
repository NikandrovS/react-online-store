import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import jwtDecode from 'jwt-decode'
import { AdminProvider } from "../contexts/AdminContext";
import AdminNav from "../pages/admin/modules/AdminNav";
import adminNavLinks from "../services/adminNavLinks";
import AdminPageRenderer from "./admin-page-renderer";

if (localStorage.jwt) {
    const { jwt } = localStorage
    const decoded = jwtDecode(jwt)
    const currentTime = Date.now() / 1000
    if (decoded.exp < currentTime) {
        localStorage.removeItem('jwt')
        window.location.href = '/admin-login'
    }
}

export default function Admin () {
    const jwt = localStorage.getItem('jwt')

    return (
        <AdminProvider>
            {jwt ?
                <div className="adminPage">
                    <AdminNav props={adminNavLinks}/>
                    <Switch>
                        <Route path="/adminpage/:page" component={() => AdminPageRenderer()}/>
                        <Route path="/adminpage/" render={() => <Redirect to="/adminpage/orders"/>}/>
                    </Switch>
                </div>
                :
                <Redirect to="/admin-login"/>}
        </ AdminProvider>
    )
}
