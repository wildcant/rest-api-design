const jwt = require('jsonwebtoken');
const passport = require('passport');
const {
  ACCESS_TOKEN_SECRET,
  JWT_EXPIRATION
} = require('../config/variables');



/** Athenticate customer credentials and generate token
 * @param {email}
 * @param {password}
 * @returns {token}
 */

exports.authenticate_customer = (req, res, next) => {
  passport.authenticate('local', { session: false }, (error, user, message) => {
    if (error || !user) {
      res.status(400).json({ error, message });
    } else {
      const payload = Object.assign({}, user)
      req.login(payload, { session: false }, (err) => {
        if (err) res.status(400).send(err);
        const token = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
          expiresIn: JWT_EXPIRATION
        });
        res.status(200).send({ user, token });
      });
    }
  })(req, res, next);
};

const handleJWT = (req, res, next) => (err, user, info) => {
  if (err){
    res.status(400).send(err);
  } else if (info){
    res.status(401).send(info.message);
  } else if (user){
    next();
  }
}

exports.authorize = (req, res, next) => {
  passport.authenticate(
    'jwt', {
      session: false
    },
    handleJWT(req, res, next),
  )(req, res, next);
}