export const sumItems = cartItems => {
    const reducer = (total, product) =>
        product.discountPrice >= 0 ?
            total + product.discountPrice * product.quantity :
            total + product.price * product.quantity;
    let total = cartItems.reduce(reducer, 0).toFixed(2)
    return { total }
}

export const OrderItemReducer = (state, action) => {
    switch (action.type) {
        case 'add':
            action.payload.quantity = 1
            state.cart.push({
                ...action.payload
            })
            return {
                ...state,
                ...sumItems(state.cart)
            }
        case 'remove':
            return {
                ...state,
                ...sumItems(state.cart.filter(item => item.product_id !== action.payload)),
                cart: [...state.cart.filter(item => item.product_id !== action.payload)]
            }
        case 'setSize':
            let item = state.cart.find(item => item.product_id === action.payload.id)
            item.size = action.payload.size
            return {...state}
        case 'setQuantity':
            state.cart[action.payload.id].quantity = parseInt(action.payload.quantity)
            return {
                ...state,
                ...sumItems(state.cart)
            }
        case 'setPrice':
            state.cart[action.payload.id].discountPrice = parseInt(action.payload.price)
            return {
                ...state,
                ...sumItems(state.cart)
            }
        case 'clear':
            return {
                cart: [],
                ...sumItems([]),
            }
        default: return state
    }
}
