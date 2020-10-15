const Koa = require('koa');
const cors = require('@koa/cors');
const serve = require('koa-static');
const koaBody = require('koa-body');
const passport = require('koa-passport');
const router = require('./models/routes');

const app = new Koa();

app.use(async(ctx, next) => {
    try {
        await next();
        const status = ctx.status || 404;
        if (status === 404) {
            ctx.throw(404)
        }
    } catch (err) {
        ctx.status = err.status || 500;
        console.log(err)
        if (ctx.status === 404) {
            console.log(err)
        }
    }
});


app.use(cors());
app.use(serve('public'))
app.use(koaBody());

app.use(passport.initialize())
app.use(router.routes());
app.use(router.allowedMethods());


app.listen(4000, () => {
    console.log('Server has started -> http://localhost:4000/');
});
