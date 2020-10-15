import React from "react";

export default function SizeList ({ item, setSize }) {

    return (
        <div className="size-list">
            {item.product_name} ({item.art_no}) {item.color} <span>{item.price}&#8381;</span>
            {
                item.is_available === 'yes' ?
                    <ul>
                        <li>
                            <input onChange={() => setSize({ id: item.product_id, size: "XXS" })} name={item.product_id} type="radio" id={`${item.product_id}_XXS`} required/>
                            <label htmlFor={`${item.product_id}_XXS`} >Размер XXS</label>
                        </li>
                        <li>
                            <input onChange={() => setSize({ id: item.product_id, size: "XS" })} name={item.product_id} type="radio" id={`${item.product_id}_XS`} required/>
                            <label htmlFor={`${item.product_id}_XS`}>Размер XS</label>
                        </li>
                        <li>
                            <input onChange={() => setSize({ id: item.product_id, size: "S" })} name={item.product_id} type="radio" id={`${item.product_id}_S`} required/>
                            <label htmlFor={`${item.product_id}_S`}>Размер S</label>
                        </li>
                        <li>
                            <input onChange={() => setSize({ id: item.product_id, size: "M" })} name={item.product_id} type="radio" id={`${item.product_id}_M`} required/>
                            <label htmlFor={`${item.product_id}_M`}>Размер M</label>
                        </li>
                        <li>
                            <input onChange={() => setSize({ id: item.product_id, size: "L" })} name={item.product_id} type="radio" id={`${item.product_id}_L`} required/>
                            <label htmlFor={`${item.product_id}_L`}>Размер L</label>
                        </li>
                    </ul> :
                    <ul>
                        {
                            item.XXS > 0 &&
                            <li>
                                <input onChange={() => setSize({ id: item.product_id, size: "XXS" })} name={item.product_id} type="radio" id={`${item.product_id}_XXS`} required/>
                                <label htmlFor={`${item.product_id}_XXS`}>Размер XXS</label>
                            </li>
                        }
                        {
                            item.XS > 0 &&
                            <li>
                                <input onChange={() => setSize({ id: item.product_id, size: "XS" })} name={item.product_id} type="radio" id={`${item.product_id}_XS`} required/>
                                <label htmlFor={`${item.product_id}_XS`}>Размер XS</label>
                            </li>
                        }
                        {
                            item.S > 0 &&
                            <li>
                                <input onChange={() => setSize({ id: item.product_id, size: "S" })} name={item.product_id} type="radio" id={`${item.product_id}_S`} required/>
                                <label htmlFor={`${item.product_id}_S`}>Размер S</label>
                            </li>
                        }
                        {
                            item.M > 0 &&
                            <li>
                                <input onChange={() => setSize({ id: item.product_id, size: "M" })} name={item.product_id} type="radio" id={`${item.product_id}_M`} required/>
                                <label htmlFor={`${item.product_id}_M`}>Размер M</label>
                            </li>
                        }
                        {
                            item.L > 0 &&
                            <li>
                                <input onChange={() => setSize({ id: item.product_id, size: "L" })} name={item.product_id} type="radio" id={`${item.product_id}_L`} required/>
                                <label htmlFor={`${item.product_id}_L`}>Размер L</label>
                            </li>
                        }
                    </ul>
            }
        </div>
    )
}
