export namespace TokenConstants {
  export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET ?? '123'
  export const JWT_EXPIRATION = process.env.JWT_EXPIRATION ?? '1h'
}

export namespace FacebookCredentials {
  export const FACEBOOK_CLIENT_ID = process.env.FACEBOOK_CLIENT_ID
  export const FACEBOOK_CLIENT_SECRET = process.env.FACEBOOK_CLIENT_SECRET
}
