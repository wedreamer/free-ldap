"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grpc_test_1 = require("./grpc-test");
const bot_pb_1 = require("@shubuzuo/ts-promise-node/bot_pb");
const wrappers_pb_1 = require("google-protobuf/google/protobuf/wrappers_pb");
const grpc_1 = require("grpc");
(0, grpc_test_1.createBotPromiseClient)(50051, grpc_1.credentials.createInsecure(), '127.0.0.1')
    .then(async (botClient) => {
    const req = new bot_pb_1.GetBotsRequest();
    req.setBotidsList([new wrappers_pb_1.StringValue().setValue('5d15e410db251f7049723464')]);
    let res;
    try {
        res = await botClient.getBots(req);
        console.log(res);
    }
    catch (error) {
        console.log(error);
    }
    const botList = res;
    console.log(botList);
});
//# sourceMappingURL=main.js.map