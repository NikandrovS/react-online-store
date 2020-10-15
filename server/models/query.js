const mysql = require('mysql2/promise');
require('dotenv').config()

async function query(request, options) {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_ACTIVE_BASE
    });
    const [rows, fields] = await connection.execute(request, options);
    await connection.close()
    return  rows
}

const crud = {
    // Login and Creating user
    findUser: async (email) => {
        return query('SELECT * FROM availability_table.users where email = ?', [email])
    },
    getUser: async (id) => {
        return query('SELECT * FROM availability_table.users where user_id = ?', [id])
    },
    newUser: async (name, mail, pass) => {
        return query('INSERT INTO `availability_table`.`users` (`name`, `email`, `password`) VALUES (?, ?, ?)', [name, mail, pass])
    },

    //Home page
    getRecommendedItems: async () => {
        return query('select product_id, art_no, product_name, ' +
            'price, image_name from products ' +
            'left join prices ' +
            'on product_id = price_id ' +
            'left join images ' +
            'on product_id = item_id ' +
            'left join priority_table ' +
            'on product_id = priority_id ' +
            'where priority > 0 ' +
            'group by art_no ' +
            'order by priority ' +
            'limit 6;')
    },
    //Catalog page sort & filter
    getCatalogByPriority: async (filter) => {
        return query('select product_id, art_no, product_name, ' +
            'price, image_name from products ' +
            'left join prices ' +
            'on product_id = price_id ' +
            'left join images ' +
            'on product_id = item_id ' +
            'left join priority_table ' +
            'on product_id = priority_id ' +
            'where art_no like ? and priority > 0 ' +
            'group by art_no ' +
            'order by priority ', [filter])
    },
    getCatalogByPrice: async (filter) => {
        return query('select product_id, art_no, product_name, ' +
            'price, image_name from products ' +
            'left join prices ' +
            'on product_id = price_id ' +
            'left join images ' +
            'on product_id = item_id ' +
            'left join priority_table ' +
            'on product_id = priority_id ' +
            'where art_no like ? ' +
            'group by art_no ' +
            'order by price ', [filter])
    },
    getCatalogByPriceDesc: async (filter) => {
        return query('select product_id, art_no, product_name, ' +
            'price, image_name from products ' +
            'left join prices ' +
            'on product_id = price_id ' +
            'left join images ' +
            'on product_id = item_id ' +
            'left join priority_table ' +
            'on product_id = priority_id ' +
            'where art_no like ? ' +
            'group by art_no ' +
            'order by price DESC ', [filter])
    },
    getCatalogByNew: async (filter) => {
        return query('select product_id, art_no, product_name, ' +
            'price, image_name from products ' +
            'left join prices ' +
            'on product_id = price_id ' +
            'left join images ' +
            'on product_id = item_id ' +
            'left join priority_table ' +
            'on product_id = priority_id ' +
            'where art_no like ? ' +
            'group by art_no ' +
            'order by product_id DESC ', [filter])
    },

    //Catalog page get Colors
    getItemsColors: async () => {
        return query('SELECT product_id, art_no, hex, color FROM availability_table.products ' +
            'left join colors on products.color_id = colors.color_id;')
    },

    //Product page
    getItemByArt: async (art) => {
        return query(`SELECT product_id, art_no, color_id, product_name, price, image_name, text, textile, composition  
                    FROM availability_table.products
                    left join prices
                        on product_id = price_id
                    left join images
                        on product_id = item_id
                    left join description
                        on product_id = description_id
                    left join materials
                        on material = textile_id
                    where art_no = ?
                    group by art_no`, [art])
    },
    getItemImages: async (art) => {
        return query('SELECT * FROM availability_table.images ' +
                                'inner join products on item_id = product_id ' +
                                'where art_no = ?', [art])
    },
    getItemColors: async (art) => {
        return query('SELECT product_id, color FROM availability_table.products ' +
            'left join colors on products.color_id = colors.color_id ' +
            '    where art_no = ?;', [art])
    },
    getItemSizes: async (id) => {
        return query('SELECT product_id, is_available, color, stock.xxs_size as stock_xxs, stock.xs_size as stock_xs, stock.s_size as stock_s, stock.m_size as stock_m, stock.l_size as stock_l, ' +
            'store.xxs_size as store_xxs, store.xs_size as store_xs, store.s_size as store_s, store.m_size as store_m, store.l_size as store_l, ' +
            'textile, composition FROM availability_table.products ' +
            'left join colors on products.color_id = colors.color_id ' +
            'left join stock on product_id = stock_id ' +
            'left join store on product_id = store_id ' +
            'left join available on product_id = available_id ' +
            'left join materials on material = textile_id ' +
            'where product_id = ?', [id])
    },
    getMaterials: async () => {
        return query('SELECT * FROM availability_table.materials')
    },

    //Order logging
    orderRecord: async (id, action, actor, type) => {
        return query(`INSERT INTO availability_table.order_log (order_id, action, actor, type)
                      VALUES (?, ?, ?, ?)`, [id, action, actor, type])
    },
    getOrderLogs: async (id) => {
        return query(`SELECT * FROM availability_table.order_log where order_id = ? order by date desc`, [id])
    },

    //New order
    orderCustomerInfo: async (body) => {
        return query(`INSERT INTO availability_table.order_customer
        (delivery_type, name, phone, email, address, city, region, postcode, meet, user_note)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [body.delivery_type, body.name, body.phone,
            body.email, body.address, body.city, body.region, body.postcode, body.meet, body.user_note])
    },
    orderCustomerInfoAdmin: async (body) => {
        return query(`INSERT INTO availability_table.order_customer
        (delivery_type, name, phone, email, address, city, region, postcode, admin_note)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [body.delivery_type, body.name, body.phone,
            body.email, body.address, body.city, body.region, body.postcode, body.admin_note])
    },
    newOrderItem: async (body) => {
        return query(`INSERT INTO availability_table.order_items (order_id, product_id, price, quantity, size)
            VALUES (?, ?, ?, ?, ?);`,[body.order_id, body.product_id, body.price, body.quantity, body.size])
    },

    //Orders API
    setOrderStatus: async (orderId, status) => {
        return query(`INSERT INTO availability_table.order_status (id, status) VALUES (?, ?)`, [orderId, status])
    },
    setOrderTracknumber: async (tracknumber, id) => {
        return query(`UPDATE availability_table.order_status SET tracknumber = ? WHERE (id = ?)`, [tracknumber, id])
    },
    changeOrderStatus: async (orderId, status) => {
        return query(`UPDATE availability_table.order_status SET status = ? WHERE (id = ?)`, [status, orderId])
    },
    getOrder: async (id) => {
        return query(`SELECT * FROM availability_table.order_customer
                                left join order_status on order_id = id
                                where order_id = ?`, [id])
    },
    getAllOrders: async (length) => {
        return query(`SELECT * FROM availability_table.order_customer
                                left join order_status
                                on order_id = id
                                order by order_ID DESC limit ?`, [length])
    },
    getOrdersByFilter: async (length, filter) => {
        return query(`SELECT * FROM availability_table.order_customer
                                left join order_status
                                on order_id = id
                                where status = ?
                                order by order_ID DESC limit ?`, [filter, length])
    },
    getMoreOrders: async (lastId) => {
        return query(`SELECT * FROM availability_table.order_customer
                                left join order_status
                                on order_id = id
                                where order_id < ?
                                order by order_ID DESC limit 10`, [lastId])
    },
    getMoreOrdersByFilter: async (lastId, filter) => {
        return query(`SELECT * FROM availability_table.order_customer
                                left join order_status
                                on order_id = id
                                where order_id < ?
                                  and status = ?
                                order by order_ID DESC limit 10`, [lastId, filter])
    },
    getOrderProducts: async (orderId) => {
        return query(`SELECT product_name, art_no, color, size, quantity, price,
                                (SELECT image_name FROM availability_table.images images 
                                    where order_items.product_id = images.item_id limit 1) AS image_name
                                        FROM availability_table.order_items
                                        LEFT JOIN products ON order_items.product_id = products.product_id
                                        LEFT JOIN colors ON products.color_id = colors.color_id
                                        WHERE order_id = ?`, [orderId])
    },
    getOrderInvoice: async (id) => {
        return query(`SELECT * FROM availability_table.order_log
                                where (type = 'changes' or type = 'invoice-created')
                                and order_id = ? order by date desc;`, [id])
    },
    ordersSearch: async (search) => {
        return query(`SELECT order_id, name, phone, status FROM order_customer
                                INNER JOIN order_status on order_id = id
                                where order_id Like CONCAT('%', ?, '%') OR name Like CONCAT('%', ?, '%') OR phone Like CONCAT('%', ?, '%')
                                ORDER BY CASE
                                    WHEN order_id LIKE ? THEN 1
                                    WHEN order_id LIKE CONCAT(?, '%') THEN 2
                                    WHEN order_id LIKE CONCAT('%', ?) THEN 4
                                    ELSE 3
                                END limit 5`, [search, search, search, search, search, search])
    },
    productsSearch: async (search) => {
        return query(`Select product_id, art_no, product_name, color, price, is_available,
                                stock.xxs_size + store.xxs_size as XXS, stock.xs_size + store.xs_size as XS, stock.s_size + store.s_size as S,
                                stock.m_size + store.m_size as M, stock.l_size + store.l_size as L from products
                                LEFT JOIN colors on products.color_id = colors.color_id
                                LEFT JOIN prices on product_id = price_id
                                LEFT JOIN available on product_id = available_id
                                left join stock on product_id = stock_id
                                left join store on product_id = store_id
                                where product_name Like CONCAT('%', ?, '%') OR art_no Like CONCAT('%', ?, '%') 
                                limit 8`, [search, search])
    },

    //Creating product
    newProduct: async (body) => {
        return query(`INSERT INTO availability_table.products (art_no, color_id, product_name) VALUES (?, ?, ?)`, [body.art_no, body.color_id, body.product_name])
    },
    createStockRow: async (id) => {
        return query(`INSERT INTO availability_table.stock (stock_id) VALUES (?)`, [id])
    },
    createStoreRow: async (id) => {
        return query(`INSERT INTO availability_table.store (store_id) VALUES (?)`, [id])
    },
    createAvailableRow: async (id) => {
        return query(`INSERT INTO availability_table.available (available_id) VALUES (?)`, [id])
    },
    setDefaultImage: async (id) => {
        return query(`INSERT INTO availability_table.images (item_id) VALUES (?)`, [id])
    },
    setDefaultPrice: async (id, price) => {
        return query(`INSERT INTO availability_table.prices (price_id, price) VALUES (?, ?)`, [id, price])
    },
    setDefaultPriority: async (id) => {
        return query(`INSERT INTO availability_table.priority_table (priority_id) VALUES (?)`, [id])
    },
    setDefaultDescription: async (id) => {
        return query(`INSERT INTO availability_table.description (description_id) VALUES (?)`, [id])
    },
    getEditArt: async (art_no) => {
        return query(`SELECT product_id, art_no, product_name, price, text, priority FROM availability_table.products
                                left join prices
                                          on products.product_id = price_id
                                left join priority_table
                                          on products.product_id = priority_id
                                left join description
                                          on product_id = description_id
                                where art_no = ?`, [art_no])
    },
    getEditProduct: async (art_no, color) => {
        return query(`SELECT product_id, art_no, product_name, colors.color_id, color, 
                                is_available, textile, composition FROM availability_table.products
                                left join colors
                                          on products.color_id = colors.color_id
                                left join available
                                          on products.product_id = available_id
                                left join materials
                                          on products.material = textile_id
                                where art_no = ? and colors.color_id = ?`, [art_no, color])
    },

    //Edit product API
    setPrice: async (price, id) => {
        return query(`UPDATE availability_table.prices 
                                SET price = ?
                                WHERE (price_id = ?)`, [price, id])
    },
    setName: async (name, id) => {
        return query(`UPDATE availability_table.products
                                SET product_name = ?
                                WHERE (product_id = ?)`, [name, id])
    },
    setText: async (text, id) => {
        return query(`UPDATE availability_table.description
                                SET text = ?
                                WHERE (description_id = ?)`, [text, id])
    },
    setArt: async (art_no, id) => {
        return query(`UPDATE availability_table.products
                                SET art_no = ?
                                WHERE (product_id = ?)`, [art_no, id])
    },
    setColor: async (color, id) => {
        return query(`UPDATE availability_table.products
                                SET color_id = ?
                                WHERE (product_id = ?)`, [color, id])
    },
    changeAvailable: async (set, id) => {
        return query(`UPDATE availability_table.available 
                                SET is_available = ? 
                                WHERE available_id = ?`, [set, id])
    },
    setPriority: async (priority, id) => {
        return query(`UPDATE availability_table.priority_table
                                SET priority = ?
                                WHERE (priority_id = ?)`, [priority, id])
    },
    setTextile: async (textile, id) => {
        return query(`UPDATE availability_table.products
                                SET material = ?
                                WHERE (product_id = ?)`, [textile, id])
    },

    // Create color and textile
    newColor: async (body) => {
        return query(`INSERT INTO availability_table.colors (color, hex) VALUES (?, ?)`, [body.color, body.hex])
    },
    newTextile: async (textile, composition) => {
        return query(`INSERT INTO availability_table.materials (textile, composition) 
                                VALUES (?, ?)`, [textile, composition])
    },
    // Edit color
    getEditColor: async (id) => {
        return query(`SELECT * FROM availability_table.colors where color_id = ?;`, [id])
    },
    editColor: async (color, id) => {
        return query(`UPDATE availability_table.colors SET color = ? 
                                WHERE (color_id = ?)`, [color, id])
    },
    editColorHEX: async (hex, id) => {
        return query(`UPDATE availability_table.colors SET hex = ? 
                                WHERE (color_id = ?)`, [hex, id])
    },
    // Edit textile
    getEditTextile: async (id) => {
        return query(`SELECT * FROM availability_table.materials where textile_id = ?;`, [id])
    },
    editTextile: async (textile, id) => {
        return query(`UPDATE availability_table.materials SET textile = ? 
                                WHERE (textile_id = ?)`, [textile, id])
    },
    editComposition: async (composition, id) => {
        return query(`UPDATE availability_table.materials SET composition = ? 
                                WHERE (textile_id = ?)`, [composition, id])
    },

    // Image uploading to server
    uploadNewImage: async (name, id) => {
        return query(`UPDATE availability_table.images SET image_name = ? WHERE (image_id = ?)`, [name, id])
    },

    //Availability table
    getAllTable: async () => {
        return query('select product_id, art_no, color, product_name, ' +
            'stock.xxs_size as stock_xxs, stock.xs_size as stock_xs, stock.s_size as stock_s, stock.m_size as stock_m, stock.l_size as stock_l,' +
            'store.xxs_size as store_xxs, store.xs_size as store_xs, store.s_size as store_s, store.m_size as store_m, store.l_size as store_l,' +
            'is_available from products ' +
            'left join colors ' +
            'on products.color_id = colors.color_id ' +
            'left join stock ' +
            'on product_id=stock_id ' +
            'left join store ' +
            'on product_id=store_id ' +
            'left join available ' +
            'on product_id = available_id ' +
            'order by art_no;')
    },
    findItemRow: async (body) => {
        return query(`SELECT * FROM availability_table.products where art_no = ? and color_id = ?`, [body.art_no, body.color_id])
    },
    getColors: async () => {
        return query('SELECT * FROM availability_table.colors order by color_id')
    },
    updateStockRow: async (body) => {
        return query(`UPDATE availability_table.stock SET 
                xxs_size = xxs_size + ?, 
                xs_size = xs_size + ?, 
                s_size = s_size + ?, 
                m_size = m_size + ?, 
                l_size = l_size + ? 
            WHERE stock_id = ?`, [body.xxs, body.xs, body.s, body.m, body.l, body.id])
    },
    updateStoreRow: async (body) => {
        return query(`UPDATE availability_table.store SET 
                xxs_size = xxs_size + ?, 
                xs_size = xs_size + ?, 
                s_size = s_size + ?, 
                m_size = m_size + ?, 
                l_size = l_size + ? 
            WHERE store_id = ?`, [body.xxs, body.xs, body.s, body.m, body.l, body.id])
    },
};
module.exports = crud;
