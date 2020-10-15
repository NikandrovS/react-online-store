import React, {useContext, useState, useReducer} from "react";

const MenuContext = React.createContext()

export const useMenu = () => {
    return useContext(MenuContext)
}

const reducer = (state, action) => {
    switch (action.type) {
        case "PAGE": return {...state, activePage: action.page}
        default: return state
    }
}

export const MenuProvider = ({ children }) => {

    const [state, dispatch] = useReducer(reducer, {
        activePage: false
    })

    const windowWidth = window.innerWidth;
    const [menuState, setMenuState] = useState(windowWidth > 480)
    const [activePage, setActivePage] = useState(false);

    const toggle = () => {
        setMenuState(prev => !prev)
    }

    const setPage = page => {
        dispatch({type: 'PAGE', page})
    }

    const contextValues = {
        menuState,
        toggle,
        windowWidth,
        activePage: state.activePage,
        setPage
    }

    return (
        <MenuContext.Provider value={contextValues}>
            { children }
        </MenuContext.Provider>
    )
}