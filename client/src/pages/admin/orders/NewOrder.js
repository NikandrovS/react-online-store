import React, {useReducer, useState} from "react";
import { OrderItemReducer, sumItems } from "./OrderItemReducer";
import NewOrderProducts from "./NewOrderProducts";
import CustomerInfo from "./CustomerInfo";
import StatusDiv from "../../../components/shared/StatusDiv";

export default function NewOrder () {
    const [status, setStatus] = useState({state: 'disable'});

    const [state, dispatch] = useReducer(OrderItemReducer, {
        cart: [],
        sumItems
    })

    const add = payload => dispatch({ type: 'add', payload })
    const remove = payload => dispatch({ type: 'remove', payload })
    const setSize = payload => dispatch({ type: 'setSize', payload })
    const setPrice = payload => dispatch({ type: 'setPrice', payload })
    const setQuantity = payload => dispatch({ type: 'setQuantity', payload })
    const clear = () => dispatch({ type: 'clear' })

    const cartActions = {
        add,
        remove,
        setSize,
        setPrice,
        setQuantity,
        clear,
        setStatus,
        ...state
    }


    return (
        <div className="new-order">
            <StatusDiv status={status}/>
            <NewOrderProducts value={cartActions} />
            <CustomerInfo value={cartActions} />
        </div>
    )
}
