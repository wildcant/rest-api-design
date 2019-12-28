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
    console.log(error);
    if (error) {
      res.status(404).json({ error });
    } else if (!user) {
      res.status(200).json({ message });
    } else {
      const payload = {user: user.name};
      req.login(payload, { session: false }, (err) => {
        if (err) res.status(400).send(err);
        const token = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
          expiresIn: JWT_EXPIRATION
        });
        res
          .status(201)
          .cookie('jwtToken', token)
          .json(payload);
      });
    }
  })(req, res, next);
};

const handleJWT = (req, res, next) => (err, user, info) => {
  console.log(req);
  console.log("req.cookies");
  console.log(req.cookies)
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