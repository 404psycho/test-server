import jwt, { JwtPayload } from "jsonwebtoken";

/**
 * Function to sign a JSON Web Token (JWT) access token.
 * @param payload Data payload to be encoded into the JWT token.
 * @returns Signed JWT access token string.
 */
export function signJwtAccessToken(payload: JwtPayload): string {
  const secret_key = process.env.JWT_SECRET_KEY;
  const token = jwt.sign(payload, secret_key!);
  return token;
}

/**
 * Function to verify a JSON Web Token (JWT) access token.
 * @param token JWT access token string to be verified.
 * @returns Decoded payload of the JWT if verification is successful, otherwise null.
 */
export function verifyJwt(token: string): JwtPayload | null {
  try {
    const secret_key = process.env.JWT_SECRET_KEY;
    const decoded = jwt.verify(token, secret_key!) as JwtPayload;
    return decoded;
  } catch (error) {
    console.error(error);
    return null;
  }
}
