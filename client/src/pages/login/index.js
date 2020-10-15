import React, { useRef } from "react";
import { useHistory } from 'react-router'
import config from "../../helpers/config/config";

export default function Login () {

    const history = useHistory();

    const emailRef = useRef('');
    const passwordRef = useRef('');

    async function auth(e) {
        e.preventDefault()
        const form_body = {
            email: emailRef.current.value,
            password: passwordRef.current.value,
        }

        const response = await fetch(`${config.BACKEND}/login`, {
            method: 'POST',
            body: JSON.stringify(form_body),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        let json = await response.json();
        if (!json.message) {
            localStorage.setItem('jwt', json.token)
            redirect()
        } else {
            console.log('Ошибка авторизации. Неверный логин или пароль.')
        }
    }
    async function redirect() {
        const response = await fetch(`${config.BACKEND}/custom`, {
            headers: {'jwt': `${localStorage.getItem('jwt')}`}
        })

        let json = await response.json()
        if (json.permission > 0) {
            history.push('/adminpage')
        } else {
            history.push('/home')
        }
    }

    return (
        <form className="login-body" onSubmit={auth}>
            <p className="logo">TOP LINE</p>
            <input ref={emailRef} type="text"/>
            <input ref={passwordRef} type="password"/>
            <div className="buttons">
                <button>Войти</button>
            </div>
        </form>
    )
}
