"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getAccessTokenFromHeader(request) {
    var _a;
    // console.log(request.headers);
    const accessToken = ((_a = request === null || request === void 0 ? void 0 : request.headers) === null || _a === void 0 ? void 0 : _a.authorization)
        ? (() => {
            var _a;
            const authHeader = ((_a = request === null || request === void 0 ? void 0 : request.headers) === null || _a === void 0 ? void 0 : _a.authorization) || ``;
            const [code, token] = authHeader.trim().split(` `);
            if (code !== `Bearer`)
                return void 0;
            else
                return token;
        })()
        : void 0;
    return accessToken;
}
exports.default = getAccessTokenFromHeader;
