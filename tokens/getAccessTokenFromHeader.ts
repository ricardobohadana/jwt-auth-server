import { Request } from "express";

function getAccessTokenFromHeader(request: Request) {
    // console.log(request.headers);
    const accessToken = request?.headers?.authorization
        ? (() => {
              const authHeader = <string>request?.headers?.authorization || ``;
              const [code, token] = authHeader.trim().split(` `);
              if (code !== `Bearer`) return void 0;
              else return token;
          })()
        : void 0;

    return accessToken;
}

export default getAccessTokenFromHeader;
