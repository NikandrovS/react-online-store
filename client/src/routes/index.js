import React from "react";
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom'
import Navigation from "../components/shared/navigation";
import navLinks from "../services/storeNavLinks";
import Login from "../pages/login/";
import Admin from "./admin";
import Cart from "../contexts/MiniCart";

import ItemRenderer from "./item-renderer";
import PageRenderer from "./page-renderer";

import {CartProvider} from "../contexts/CartContext";
import {MenuProvider} from "../contexts/MenuContext";

export default function Routes() {
    return (
        <Router>
            <Switch>
                <Route path="/admin-login"><Login /></Route>
                <Route path="/adminpage"><Admin /></Route>
                <Route path="/">
                    <CartProvider>
                        <div className="page">
                            <MenuProvider>
                                <Navigation props={navLinks}/>
                                <Switch>
                                    <Route path="/product/:art" component={() => ItemRenderer()} />
                                    <Route path="/:page" component={() => PageRenderer()}/>
                                    <Route path="/" render={() => <Redirect to="/home" />} />
                                </Switch>
                                <Cart />
                            </MenuProvider>
                        </div>
                    </CartProvider>
                </Route>
            </Switch>
        </Router>
    );
}
