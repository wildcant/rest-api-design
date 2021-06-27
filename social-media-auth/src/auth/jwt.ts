/* eslint-disable @typescript-eslint/no-explicit-any */
import { PartialUser } from '../helpers'
import jsonwebtoken, {
  JwtPayload,
  Secret,
  SignOptions,
  VerifyOptions,
} from 'jsonwebtoken'
import { promisify } from 'util'
import { TokenConstants } from '../keys'

const singAsync: (
  payload: string | Buffer | Record<string, unknown>,
  secretOrPrivateKey: Secret,
  options?: SignOptions
) => Promise<string> = promisify(jsonwebtoken.sign)

const verifyAsync: (
  token: string,
  secretOrPublicKey: Secret,
  options?: VerifyOptions
) => Promise<JwtPayload> = promisify(jsonwebtoken.verify)

export async function generateToken(user: PartialUser): Promise<string> {
  try {
    console.log(
      'TokenConstants.JWT_EXPIRATION: ',
      TokenConstants.JWT_EXPIRATION
    )
    const token = await singAsync(user, TokenConstants.ACCESS_TOKEN_SECRET, {
      expiresIn: TokenConstants.JWT_EXPIRATION,
    })
    return token
  } catch (error) {
    throw new Error(`Error encoding token`)
  }
}

export async function verifyToken(token: string): Promise<PartialUser> {
  if (!token) {
    throw new Error(`Error verifying token: 'token' is null`)
  }
  try {
    const userData = (await verifyAsync(
      token,
      TokenConstants.ACCESS_TOKEN_SECRET
    )) as PartialUser
    return userData
  } catch (error) {
    throw new Error(`Error decoding token`)
  }
}
