const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const { get_customer_by_email } = require('../models/customers.model');
const { ACCESS_TOKEN_SECRET } = require('../config/variables');

const authenticateCustomer = async ( email, password, done) => {
  try {
    const user = await get_customer_by_email(email);
    if (Object.entries(user).length === 0){
      return done(null, false, 'No user with that email');
    }
    const match = await bcrypt.compare(password, user.password);
    if (match) return done(null, user, 'Correct password');
    return done(null, false, 'Password incorrect');
  } catch (error) {
    return done(error);
  }
}

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, authenticateCustomer
  ));

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
    secretOrKey: ACCESS_TOKEN_SECRET
  },
  (jwtPayload, done) => {
    if (Date.now() < jwtPayload.expires){
      return done('jwt expires');
    }
    return done(null, jwtPayload);
  }));