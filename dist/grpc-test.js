"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBotPromiseClient = exports.grpcCredentials = void 0;
const bot_grpc_pb_1 = require("@shubuzuo/ts-promise-node/bot_grpc_pb");
const grpc_promise_ts_1 = require("grpc-promise-ts");
const grpc_1 = require("grpc");
Object.defineProperty(exports, "grpcCredentials", { enumerable: true, get: function () { return grpc_1.credentials; } });
function createBotPromiseClient(port, credentials = grpc_1.credentials.createInsecure(), host = "0.0.0.0") {
    return new Promise((resolve, reject) => {
        const client = new bot_grpc_pb_1.BotClient(`${host}:${port}`, credentials);
        const jokePromiseClient = (0, grpc_promise_ts_1.convertToPromiseClient)(client);
        jokePromiseClient.waitForReady(/* dealine */ Date.now() + 10000, (e) => {
            if (e) {
                reject(e);
            }
            else {
                resolve(jokePromiseClient);
            }
        });
    });
}
exports.createBotPromiseClient = createBotPromiseClient;
//# sourceMappingURL=grpc-test.js.map