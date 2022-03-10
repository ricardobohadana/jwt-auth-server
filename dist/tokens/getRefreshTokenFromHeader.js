"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getRefreshTokenFromHeader(request) {
    var _a;
    const refreshToken = ((_a = request === null || request === void 0 ? void 0 : request.headers) === null || _a === void 0 ? void 0 : _a.authentication)
        ? (() => {
            var _a;
            const authHeader = ((_a = request === null || request === void 0 ? void 0 : request.headers) === null || _a === void 0 ? void 0 : _a.authentication) || ``;
            const [code, token] = authHeader.trim().split(` `);
            if (code !== `Refresh`)
                return void 0;
            else
                return token;
        })()
        : void 0;
    return refreshToken;
}
exports.default = getRefreshTokenFromHeader;
