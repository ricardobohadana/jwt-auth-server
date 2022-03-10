import { Request } from "express";

function getRefreshTokenFromHeader(request: Request) {
    const refreshToken = request?.headers?.authentication
        ? (() => {
              const authHeader = <string>request?.headers?.authentication || ``;
              const [code, token] = authHeader.trim().split(` `);
              if (code !== `Refresh`) return void 0;
              else return token;
          })()
        : void 0;

    return refreshToken;
}

export default getRefreshTokenFromHeader;
