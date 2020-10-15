import React, {useContext, useState, useReducer} from "react";
import { CartReducer, sumItems } from './CartReducer';

const CartContext = React.createContext()

export const useCart = () => {
    return useContext(CartContext)
}

const storage = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
const initialState = { cartItems: storage, ...sumItems(storage), checkout: false, active: false };

export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(CartReducer, initialState)

    const toggleState = payload => {
        dispatch({type: 'TOGGLE', payload})
    }

    const increase = payload => {
        dispatch({type: 'INCREASE', payload})
    }

    const decrease = payload => {
        dispatch({type: 'DECREASE', payload})
    }

    const addProduct = payload => {
        dispatch({type: 'ADD_ITEM', payload})
    }

    const removeProduct = payload => {
        dispatch({type: 'REMOVE_ITEM', payload})
    }

    const clearCart = () => {
        dispatch({type: 'CLEAR'})
    }

    const handleCheckout = payload => {
        console.log('CHECKOUT');
        dispatch({type: 'CHECKOUT', payload})
    }
    const contextValues = {
        toggleState,
        removeProduct,
        addProduct,
        increase,
        decrease,
        clearCart,
        handleCheckout,
        ...state
    }

    return (
        <CartContext.Provider value={contextValues}>
            { children }
        </CartContext.Provider>
    )
}