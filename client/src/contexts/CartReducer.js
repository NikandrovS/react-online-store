const Storage = (cartItems) => {
    localStorage.setItem('cart', JSON.stringify(cartItems.length > 0 ? cartItems: []));
}

export const sumItems = cartItems => {
    Storage(cartItems);
    let itemCount = cartItems.reduce((total, product) => total + product.quantity, 0);
    let total = cartItems.reduce((total, product) => total + product.price * product.quantity, 0).toFixed(2);
    return { itemCount, total }
}

export const CartReducer = (state, action) => {
    switch (action.type) {
        case "ADD_ITEM":
            let revise = state.cartItems.filter(item => item.id === action.payload.id && item.size === action.payload.size)
            if (revise.length === 0) {
                state.cartItems.push({
                    ...action.payload,
                    quantity: 1
                })
            }

            return {
                ...state,
                ...sumItems(state.cartItems),
                cartItems: [...state.cartItems]
            }
        case "REMOVE_ITEM":
            return {
                ...state,
                ...sumItems(state.cartItems.filter(item => item.id !== action.payload.id || item.size !== action.payload.size)),
                cartItems: [...state.cartItems.filter(item => item.id !== action.payload.id || item.size !== action.payload.size)]
            }
        case "TOGGLE":
            return {
                ...state,
                active: action.payload || !state.active,
                ...sumItems(state.cartItems),
                cartItems: [...state.cartItems]
            }
        case "INCREASE":
            state.cartItems[state.cartItems.findIndex(item => item.id === action.payload.id && item.size === action.payload.size)].quantity++
            return {
                ...state,
                ...sumItems(state.cartItems),
                cartItems: [...state.cartItems]
            }
        case "DECREASE":
            if (action.payload.quantity > 1) {
                state.cartItems[state.cartItems.findIndex(item => item.id === action.payload.id && item.size === action.payload.size)].quantity--
                return {
                    ...state,
                    ...sumItems(state.cartItems),
                    cartItems: [...state.cartItems]
                }
            }
            return {
                ...state,
                ...sumItems(state.cartItems),
                cartItems: [...state.cartItems]
            }
        case "CHECKOUT":
            return {
                cartItems: [],
                checkout: action.payload,
                ...sumItems([]),
            }
        case "CLEAR":
            return {
                cartItems: [],
                checkout: false,
                ...sumItems([]),
            }

        default:
            return state

    }
}