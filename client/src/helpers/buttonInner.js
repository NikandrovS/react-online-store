import React from "react";

export default function buttonInner(state) {
    if (state) {
        return <span>&#10003;</span>
    } else {
        return <span>&#8943;</span>
    }
}
