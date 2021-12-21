import { createBotPromiseClient } from "./grpc-test";
import { BotModel, BotsResponse, GetBotRequest, GetBotsRequest } from "@shubuzuo/ts-promise-node/bot_pb"
import { StringValue } from "google-protobuf/google/protobuf/wrappers_pb";
import { ChannelCredentials, credentials as grpcCredentials, Metadata } from "@grpc/grpc-js"

// createBotPromiseClient(50051, grpcCredentials.createInsecure(), '127.0.0.1')
//     .then(async botClient => {
//         const req = new GetBotsRequest();
//         req.setBotidsList([new StringValue().setValue('5d1effd694e8086806dd7f3e')])
//         let res
//         try {
//             const metaData = new Metadata()
//             metaData.set('client', 'test')
//             res = await botClient.getBots(req, metaData) as BotsResponse
//             console.log(res)
//         } catch (error) {
//             console.log(error)
//         }
//         const botList = res?.getBotsList().map((item: BotModel) => {
//             const res = item?.toObject(true)
//             console.log(res)
//         });
//         console.log(botList)
//     })

async function test() {
    const client = await createBotPromiseClient(50051, grpcCredentials.createInsecure(), '127.0.0.1');
    const req = new GetBotRequest().setBotid(new StringValue().setValue('5d1effd694e8086806dd7f3e'));
    const res = await client.getBot(req)
    console.log(res.toObject(true))
}

for (let index = 0; index < 100; index++) {
    try {
       test()
    } catch (error) {
        console.log(error)        
    }
}
