import React, {useContext} from "react";
import jwtDecode from 'jwt-decode'

const AdminContext = React.createContext()

export const useAdmin = () => {
    return useContext(AdminContext)
}

export const AdminProvider = ({ children }) => {

    const jwt = localStorage.getItem('jwt')


    let user
    if (jwt) {
        user = jwtDecode(jwt).displayName
    }

    function logout() {
        localStorage.removeItem('jwt')
        localStorage.removeItem('user')
        window.location.href = '/admin-login'
    }

    const contextValues = {
        jwt,
        user,
        logout
    }

    return (
        <AdminContext.Provider value={contextValues}>
            { children }
        </AdminContext.Provider>
    )
}
