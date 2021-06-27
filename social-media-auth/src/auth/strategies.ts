import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import {
  Strategy as JWTStrategy,
  StrategyOptions,
  ExtractJwt,
} from 'passport-jwt'

import { sanitizeUser } from '../helpers'
import { userRepository } from '../repositories'
import { TokenConstants } from '../keys'
import { User } from '@prisma/client'

export function localStrategy(): void {
  passport.use(
    new LocalStrategy(async function (username, password, cb) {
      try {
        const user = await userRepository.findUnique({ where: { username } })
        if (!user) return cb(null, false)
        if (user.password !== password) return cb(null, false)
        return cb(null, sanitizeUser(user))
      } catch (err) {
        return cb(err)
      }
    })
  )
}

const opt: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: TokenConstants.ACCESS_TOKEN_SECRET,
}
export function jwtStrategy(): void {
  passport.use(
    new JWTStrategy(opt, async function (payload, done) {
      const userData = payload as User
      try {
        const user = await userRepository.findUnique({
          where: { username: userData.username },
        })
        if (!user) return done(null, false)
        return done(null, user)
      } catch (error) {
        return done(error, false)
      }
    })
  )
}
