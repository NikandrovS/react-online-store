import React from "react";
import {useRouteMatch} from "react-router-dom";

const generatePage = page => {
    const component = () => require(`../pages/admin/${page}/index.js`).default;

    try {
        return React.createElement(component())
    } catch (err) {
        console.warn(err)
        return React.createElement(() => <div>Скоро здесь будет страница</div>)
    }
}

export default function PageRenderer() {
    const {
        params: {page}
    } = useRouteMatch()
    return generatePage(page)
}
