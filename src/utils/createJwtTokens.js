import jwt from "jsonwebtoken";

function createJwtToken(payload, secretKey, expiresIn) {
  return jwt.sign({ payload }, secretKey, {
    expiresIn: expiresIn,
  });
}

function createJwtTokens(payload) {
  return {
    accessToken: createJwtToken(
      payload,
      process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
      process.env.JWT_ACCESS_TOKEN_EXPIRES_IN
    ),
    refreshToken: createJwtToken(
      payload,
      process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
      process.env.JWT_REFRESH_TOKEN_EXPIRES_IN
    ),
  };
}

export default createJwtTokens;