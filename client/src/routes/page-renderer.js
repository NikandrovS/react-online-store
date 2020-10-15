import React from "react";
import {useRouteMatch} from "react-router-dom";

const generatePage = page => {
    const component = () => require(`../pages/${page}/index.js`).default;

    try {
        return React.createElement(component())
    } catch (err) {
        console.warn(err)
        return React.createElement(() => <div className="notFound">Некорректная ссылка, вернитесь на главную страницу</div>)
    }
}

export default function PageRenderer() {
    const {
        params: {page}
    } = useRouteMatch()
    return generatePage(page)
}
