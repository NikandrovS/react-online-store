import React from "react";
import {useRouteMatch} from "react-router-dom";

const generatePage = art => {
    const component = () => require(`../pages/product`).default;

    try {
        return React.createElement(component(), {art})
    } catch (err) {
        console.warn(err)
        return React.createElement(() => 404)
    }
}

export default function PageRenderer() {
    const {
        params: {art}
    } = useRouteMatch()
    return generatePage(art)
}
