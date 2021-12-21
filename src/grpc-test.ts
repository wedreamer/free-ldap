import { BotClient, BotPromiseClient } from "@shubuzuo/ts-promise-node/bot_grpc_pb";
import { convertToPromiseClient } from "@bung87/grpc-promise-ts";
import { ChannelCredentials, credentials as grpcCredentials } from "@grpc/grpc-js"

export { grpcCredentials }

let jokePromiseClient: any;

export function createBotPromiseClient(
    port: number,
    credentials: ChannelCredentials = grpcCredentials.createInsecure(),
    host: string = "0.0.0.0"
): Promise<BotPromiseClient> {
    // @ts-ignore
    if (jokePromiseClient != undefined) {
        // @ts-ignore
        return jokePromiseClient;
    }
    return new Promise((resolve, reject) => {
        const client = new BotClient(
            `${host}:${port}`,
            credentials
        );
        // @ts-ignore
        jokePromiseClient = convertToPromiseClient(client);
        jokePromiseClient.waitForReady(/* dealine */Date.now() + 1, (e: any) => {
            if (e) {
                reject(e);
            } else {
                // @ts-ignore
                resolve(jokePromiseClient);
            }
        });
    });
}