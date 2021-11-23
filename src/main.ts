import { createBotPromiseClient } from "./grpc-test";
import { BotModel, BotsResponse, GetBotRequest, GetBotsRequest } from "@shubuzuo/ts-promise-node/bot_pb"
import { StringValue } from "google-protobuf/google/protobuf/wrappers_pb";
import { ChannelCredentials, credentials as grpcCredentials } from "@grpc/grpc-js"

createBotPromiseClient(50051, grpcCredentials.createInsecure(), '127.0.0.1')
    .then(async botClient => {
        const req = new GetBotsRequest();
        req.setBotidsList([new StringValue().setValue('5d15e410db251f7049723464')])
        let res
        try {
            res = await botClient.getBots(req) as BotsResponse
            console.log(res)
        } catch (error) {
            console.log(error)
        }
        const botList = res?.getBotsList().map((item: BotModel) => item?.toObject(true));
        console.log(botList)
    })
