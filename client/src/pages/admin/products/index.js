import React, {useState} from "react";
import AddProduct from "./AddProduct";
import SearchArt from "./SearchArt";
import SearchProduct from "./SearchProduct";

export default function Products () {

    const [activeAction, setActiveAction] = useState('addProduct')

    return (
        <main className="products-wrapper">
            <ul className="action-menu">
                <li onClick={() => setActiveAction('addProduct')}>Добавить артикул</li>
                <li onClick={() => setActiveAction('editArt')}>Редактировать артикул</li>
                <li onClick={() => setActiveAction('addImage')}>Загрузить картинки</li>
                <li onClick={() => setActiveAction('setPriority')}>Изменить параметры</li>
            </ul>
            <div className="active-action">
                {
                    activeAction === 'addProduct' && <AddProduct />
                }
                {
                    activeAction === 'editArt' && <SearchArt />
                }
                {
                    activeAction === 'editArt' && <SearchProduct/>
                }
            </div>
        </main>
    )
}
