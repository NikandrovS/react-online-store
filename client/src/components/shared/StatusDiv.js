import React from "react";

export default function StatusDiv ({status}) {

    const defaultStyle = {
        transform: 'scale(0)'
    };
    const successStyle = {
        transform: 'scale(1)',
        background: '#8cff80'
    };
    const errorStyle = {
        transform: 'scale(1)',
        background: '#ff808c'
    };

    return (
        <div className="status-message" style={status.state === "success" ? successStyle : status.state === "error" ? errorStyle : defaultStyle}>{status.text}</div>
    )
}
