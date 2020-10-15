require('dotenv').config()
const bcrypt = require('bcryptjs')
const Router = require('koa-router');
const passport = require('koa-passport');
const jwt = require('jsonwebtoken');
const jwtsecret = process.env.JWT_SECRET;

const curTime = require('../extension/getDate');
const database = require('./query');
const mailing = require("./mailing");
const uploader = require("./upload")
require('./auth')

const request = require("request");
const router = new Router();

router
    .post('/new-user', async(ctx) => {
        const { name, email, password } = ctx.request.body
        let hashedPassword = await bcrypt.hash(password, 8)
        try {
            let result = await database.newUser(name, email, hashedPassword);
            if (result.affectedRows) {
                const payload = {
                    id: result.insertId,
                    displayName: name,
                    email: email
                };
                const token = jwt.sign(payload, jwtsecret, { expiresIn: 64800 * 24 });
                ctx.body = {user: name, token: token};
                ctx.status = 201;
            }
        }
        catch (err) {
            ctx.throw(400, 'Email already exists')
        }
    })
    .post('/login', async(ctx) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        await passport.authenticate('local', function (err, user, reason) {
            if (err) {
                ctx.body = err.message;
            } else if (user === false) {
                ctx.body = { message: "Ошибка авторизации. Причина: " + reason.message }
            } else {
                const payload = {
                    id: user.user_id,
                    displayName: user.name,
                    email: user.email
                };
                const token = jwt.sign(payload, jwtsecret, { expiresIn: 3600 * 18});
                ctx.body = {user: user.name, token: token};
            }
        })(ctx);
    })
    .get('/custom', async(ctx, next) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        await passport.authenticate('jwt', function (err, user) {
            if (user) {
                ctx.body = {
                    user: user.name,
                    permission: user.permission
                }
            } else {
                ctx.throw(401, "Необходима авторизация")
            }
        } )(ctx, next)
    })
    .get("/ru-post/:track", async(ctx) => {
        let options = { method: 'POST',
            url: 'https://www.pochta.ru/tracking',
            qs:
                { p_p_id: 'trackingPortlet_WAR_portalportlet',
                    p_p_lifecycle: '2',
                    p_p_state: 'normal',
                    p_p_mode: 'view',
                    p_p_resource_id: 'tracking.get-by-barcodes',
                    p_p_cacheability: 'cacheLevelPage',
                    p_p_col_id: 'column-1',
                    p_p_col_count: '1' },
            headers:
                {   'cache-control': 'no-cache',
                    'content-type': 'application/x-www-form-urlencoded' },
            form: { barcodes: `${ctx.params.track}` } };

        ctx.body = await request(options, function (error, response, body) {
            if (error) throw new Error(error);

            return response
        });
    })
    // upload image
    .post("/productImage/:id", async (ctx) => {
        let result = await database.setDefaultImage(ctx.params.id);
        let imgName = "IMG_" + result.insertId

        const data = await uploader.transfer(ctx,{
            uploadPath: "./public/img",
            allowedExtName: ["jpg", "jpeg", "png"],
            imgId: result.insertId,
            imgName: imgName,
        }).catch((error) => {
            ctx.body = error.state
            return false
        })
        if (data) {
            ctx.body = data.state
        }
    })

    //Home page
    .get("/recommendedItems", async(ctx) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        ctx.body = await database.getRecommendedItems();
    })

    //Catalog page
    .get("/catalog/", async(ctx) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        switch (ctx.query.sort) {
            case "priority":
                ctx.body = await database.getCatalogByPriority(ctx.query.filter);
                break
            case "upPrice":
                ctx.body = await database.getCatalogByPrice(ctx.query.filter);
                break
            case "downPrice":
                ctx.body = await database.getCatalogByPriceDesc(ctx.query.filter);
                break
            case "new":
                ctx.body = await database.getCatalogByNew(ctx.query.filter);
                break
            default:
                ctx.body = await database.getCatalogByPriority(ctx.query.filter);
                break
        }
    })
    .get("/products", async(ctx) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        ctx.body = await database.getAllTable();
    })
    .get("/colors", async(ctx) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        ctx.body = await database.getColors();
    })
    .get("/materials", async(ctx) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        ctx.body = await database.getMaterials();
    })

    //Product page
    .get("/getItemByArt/:art", async(ctx) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        ctx.body = await database.getItemByArt(ctx.params.art);
    })
    .get("/getImagesById/:art", async(ctx) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        ctx.body = await database.getItemImages(ctx.params.art);
    })
    .get("/getItemColors/:art", async(ctx) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        ctx.body = await database.getItemColors(ctx.params.art);
    })
    .get("/getItemSizes/:id", async(ctx) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        ctx.body = await database.getItemSizes(ctx.params.id);
    })

    //New order
    .post("/newOrderCustomer", async(ctx) => {
        try {
            ctx.set('Access-Control-Allow-Origin', '*');
            let orderID = (await database.orderCustomerInfo(ctx.request.body)).insertId
            await database.setOrderStatus(orderID, 'new')
            await database.orderRecord(orderID, 'Заказ оформлен', ctx.request.body.user, 'order-state')
            ctx.body = orderID;
        } catch (e) {
            console.error(curTime, '\n' + e.sqlMessage, '\n', ctx.request.body);
            ctx.body = {error: "Возникла ошибка при оформлении заказа, пожалуйста обновите страницу и попробуйте снова или свяжитесь с нами"}
        }
    })
    .post("/newOrderAdmin", async(ctx) => {
        await passport.authenticate('jwt', async function (err, user) {
            if (user) {
                try {
                    ctx.set('Access-Control-Allow-Origin', '*');
                    let orderID = (await database.orderCustomerInfoAdmin(ctx.request.body)).insertId
                    await database.setOrderStatus(orderID, 'new')
                    await database.orderRecord(orderID, 'Заказ оформлен', user.name, 'order-state')
                    ctx.body = orderID;
                } catch (e) {
                    console.error(curTime, '\n' + e.sqlMessage, '\n', ctx.request.body);
                    ctx.body = {error: "Возникла ошибка при оформлении заказа, пожалуйста обновите страницу и попробуйте снова или свяжитесь с нами"}
                }
            } else {
                ctx.throw(401, "Необходима авторизация")
            }
        } )(ctx)
    })
    .post("/newOrderItem", async(ctx) => {
        try {
            ctx.set('Access-Control-Allow-Origin', '*');
            ctx.body = await database.newOrderItem(ctx.request.body);
        } catch (e) {
            console.error(curTime, '\n' + e.sqlMessage, '\n', ctx.request.body);
            ctx.body = {error: "Возникла ошибка при оформлении заказа, пожалуйста обновите страницу и попробуйте снова или свяжитесь с нами"}
        }
    })

    //AdminPage: orders
    .get("/getOrder/:id", async(ctx) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        ctx.body = await database.getOrder(ctx.params.id);
    })
    .get("/getAllOrders", async(ctx) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        await passport.authenticate('jwt', async function (err, user) {
            if (user) {
                let length = 10
                if (ctx.query.length !== length && ctx.query.length > length) {
                    length = ctx.query.length
                }
                if (ctx.query.filter === 'all') {
                    ctx.body = await database.getAllOrders(length);
                } else {
                    ctx.body = await database.getOrdersByFilter(length, ctx.query.filter);
                }
            } else {
                ctx.throw(401, "Необходима авторизация")
            }
        } )(ctx)
    })
    .get("/getMoreOrders/:id", async(ctx) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        if (ctx.query.filter !== 'all') {
            ctx.body = await database.getMoreOrdersByFilter(ctx.params.id, ctx.query.filter);
        } else {
            ctx.body = await database.getMoreOrders(ctx.params.id);
        }
    })
    .get("/getOrderProducts", async(ctx) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        if (ctx.query.orderId > 0) {
            ctx.body = await database.getOrderProducts(ctx.query.orderId);
        }
    })
    .post("/newInvoice", async(ctx) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        await passport.authenticate('jwt', async function (err, user) {
            if (user) {
                let { id, tracknumber } = ctx.request.body
                await database.orderRecord(id, tracknumber, user.name, "invoice-created")
                ctx.status = 201
            } else {
                ctx.throw(401, "Необходима авторизация")
            }
        } )(ctx)
    })
    .get("/getInvoice/:id", async(ctx) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        await passport.authenticate('jwt', async function (err, user) {
            if (user) {
                ctx.body = await database.getOrderInvoice(ctx.params.id)
            } else {
                ctx.throw(401, "Необходима авторизация")
            }
        } )(ctx)
    })
    .post("/changeOrderStatus/:id", async(ctx) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        await passport.authenticate('jwt', async function (err, user) {
            if (user) {
                let { status } = ctx.request.body
                let { id } = ctx.params
                await database.orderRecord(id, `Статус заказа изменен: ${status}`, user.name, "order-state")
                ctx.body = await database.changeOrderStatus(id, status);
            } else {
                ctx.throw(401, "Необходима авторизация")
            }
        } )(ctx)
    })
    .post("/setOrderTracknumber/:id", async(ctx) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        await passport.authenticate('jwt', async function (err, user) {
            if (user) {
                let { delivery, order, receiverEmail, trackLink, tracknumber } = ctx.request.body
                mailing.sendTrack(receiverEmail, order, delivery, tracknumber, trackLink)
                await database.orderRecord(order, `Заказ отправлен, покупателю выслан трекномер: ${tracknumber}`, user.name, "email-sent")
                ctx.body = await database.setOrderTracknumber(tracknumber, order);
            } else {
                ctx.throw(401, "Необходима авторизация")
            }
        } )(ctx)
    })
    .post("/ordersSearch", async(ctx) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        ctx.body = await database.ordersSearch(ctx.request.body.search);
    })
    .get("/ordersLogs/:id", async(ctx) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        await passport.authenticate('jwt', async function (err, user) {
            if (user) {
                ctx.body = await database.getOrderLogs(ctx.params.id);
            } else {
                ctx.throw(401, "Необходима авторизация")
            }
        } )(ctx)
    })
    .post("/productsSearch", async(ctx) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        await passport.authenticate('jwt', async function (err, user) {
            if (user) {
                ctx.body = await database.productsSearch(ctx.request.body.search);
            } else {
                ctx.throw(401, "Необходима авторизация")
            }
        } )(ctx)
    })

    //Admin: new products
    .post("/newProduct", async(ctx) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        try {
            let newId = (await database.newProduct(ctx.request.body)).insertId
            await database.createAvailableRow(newId)
            await database.createStockRow(newId)
            await database.createStoreRow(newId)
            await database.setDefaultPrice(newId, ctx.request.body.price)
            await database.setDefaultPriority(newId)
            await database.setDefaultDescription(newId)
            ctx.body = {text: "Успешно создано!", created_id: newId}
        } catch (e) {
            console.error(curTime, '\n' + e.sqlMessage, '\n', ctx.request.body);
            ctx.body = {error: "Возникла ошибка!" + e.sqlMessage}
        }
    })

    // Create color and textile
    .post("/newColor", async (ctx) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        try {
            await database.newColor(ctx.request.body)
            ctx.body = {text: "Цвет успешно создан!"}
        } catch (e) {
            console.error(curTime, '\n' + e.sqlMessage, '\n', ctx.request.body);
            ctx.body = {error: "Возникла ошибка!" + e.sqlMessage}
        }
    })
    .post("/newTextile", async (ctx) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        try {
            await database.newTextile(ctx.request.body.textile, ctx.request.body.composition)
            ctx.body = {text: "Успешно создано!"}
        } catch (e) {
            console.error(curTime, '\n' + e.sqlMessage, '\n', ctx.request.body);
            ctx.body = {error: "Возникла ошибка!" + e.sqlMessage}
        }
    })
    // Edit color and textile
    .get("/getEditColor/:id", async (ctx) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        ctx.body = await database.getEditColor(ctx.params.id)
    })
    .post("/editColor", async (ctx) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        try {
            await database.editColor(ctx.request.body.color, ctx.request.body.id)
            await database.editColorHEX(ctx.request.body.hex, ctx.request.body.id)
            ctx.body = {text: "Изменения сохранены!"}
        } catch (e) {
            console.error(curTime, '\n' + e.sqlMessage, '\n', ctx.request.body);
            ctx.body = {error: "Возникла ошибка!" + e.sqlMessage}
        }
    })
    .get("/getEditTextile/:id", async (ctx) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        ctx.body = await database.getEditTextile(ctx.params.id)
    })
    .post("/editTextile", async (ctx) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        try {
            await database.editTextile(ctx.request.body.textile, ctx.request.body.id)
            await database.editComposition(ctx.request.body.composition, ctx.request.body.id)
            ctx.body = {text: "Изменения сохранены!"}
        } catch (e) {
            console.error(curTime, '\n' + e.sqlMessage, '\n', ctx.request.body);
            ctx.body = {error: "Возникла ошибка!" + e.sqlMessage}
        }
    })


    .post("/getEditArt", async (ctx) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        ctx.body = await database.getEditArt(ctx.request.body.art_no)
    })
    .post("/setPrice", async (ctx) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        for (const item of (ctx.request.body.id)) {
            await database.setPrice(ctx.request.body.price, item)
        }
        ctx.body = await database.getEditArt(ctx.request.body.art_no)
    })
    .post("/setPriority", async (ctx) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        for (const item of (ctx.request.body.id)) {
            await database.setPriority(ctx.request.body.priority, item)
        }
        ctx.body = await database.getEditArt(ctx.request.body.art_no)
    })
    .post("/setName", async (ctx) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        for (const item of (ctx.request.body.id)) {
            await database.setName(ctx.request.body.name, item)
        }
        ctx.body = await database.getEditArt(ctx.request.body.art_no)
    })
    .post("/setText", async (ctx) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        for (const item of (ctx.request.body.id)) {
            await database.setText(ctx.request.body.text, item)
        }
        ctx.body = await database.getEditArt(ctx.request.body.art_no)
    })

    .post("/getEditProduct", async (ctx) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        ctx.body = await database.getEditProduct(ctx.request.body.art_no, ctx.request.body.color)
    })
    .post("/setArt", async (ctx) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        await database.setArt(ctx.request.body.art_no, ctx.request.body.id)
        ctx.body = await database.getEditProduct(ctx.request.body.art_no, ctx.request.body.color)
    })
    .post("/setColor", async (ctx) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        await database.setColor(ctx.request.body.color, ctx.request.body.id)
        ctx.body = await database.getEditProduct(ctx.request.body.art_no, ctx.request.body.color)
    })
    .post("/setAvailable", async (ctx) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        await database.changeAvailable(ctx.request.body.status, ctx.request.body.id)
        ctx.body = await database.getEditProduct(ctx.request.body.art_no, ctx.request.body.color)
    })
    .post("/setTextile", async (ctx) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        await database.setTextile(ctx.request.body.textile, ctx.request.body.id)
        ctx.body = await database.getEditProduct(ctx.request.body.art_no, ctx.request.body.color)
    })

    //table page
    .get("/getItemsColors", async(ctx) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        ctx.body = await database.getItemsColors();
    })
    .post("/makeAvailable", async(ctx) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        let result = await database.findItemRow(ctx.request.body)
        if (result.length === 1) {
            await database.changeAvailable('yes', result[0].product_id)
            ctx.body = await database.getAllTable();
        } else if (result.length > 1) {
            ctx.body = {error: "Ошибка базы данных - Повторяющиеся id", errorText: result}
        }

    })
    .post("/makeUnAvailable", async(ctx) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        let result = await database.findItemRow(ctx.request.body)
        if (result.length === 1) {
            await database.changeAvailable('no', result[0].product_id)
            ctx.body = await database.getAllTable();
        } else if (result.length > 1) {
            ctx.body = {error: "Ошибка базы данных - Повторяющиеся id", errorText: result}
        }
    })
    .post("/:updateRow", async (ctx) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        switch (ctx.params.updateRow) {
            case 'updateStockRow':
                await database.updateStockRow(ctx.request.body)
                break;
            case 'updateStoreRow':
                await database.updateStoreRow(ctx.request.body)
                break;
        }
        ctx.body = await database.getAllTable();
    })

module.exports = router;
