require('dotenv').config()
const passport = require('koa-passport');
const database = require('./query');
const bcrypt = require('bcryptjs');

const LocalStrategy = require('passport-local');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

let jwtsecret = process.env.JWT_SECRET;

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('jwt'),
    secretOrKey: jwtsecret
};

// Auth
passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        session: false
    },
    async function (email, password, done) {
        try {
            let user = await database.findUser(email)
            if (user.length > 0) {
                const isMatch = await bcrypt.compare(password, user[0].password)
                if (isMatch) {
                    return done(null, user[0]);
                }
            }
            return done(null, false, {message: 'Неверный логин или пароль'});
        } catch (e) {
            console.error(e)
        }
    }
))
// Getting user info
    .use(new JwtStrategy(jwtOptions, async function (payload, done) {
        try {
            let user = await database.getUser(payload.id)
            if (user[0]) {
                done(null, user[0])
            } else {
                done(null, false)
            }
        } catch (err) {
            console.error(err)
            return done(err)
        }
    })
);

module.export = passport