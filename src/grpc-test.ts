import { BotClient, BotPromiseClient } from "@shubuzuo/ts-promise-node/bot_grpc_pb";
import { convertToPromiseClient } from "@bung87/grpc-promise-ts";
import { ChannelCredentials, credentials as grpcCredentials } from "@grpc/grpc-js"

export { grpcCredentials }

export function createBotPromiseClient(
    port: number,
    credentials: ChannelCredentials = grpcCredentials.createInsecure(),
    host: string = "0.0.0.0"
): Promise<BotPromiseClient> {
    return new Promise((resolve, reject) => {
        const client = new BotClient(
            `${host}:${port}`,
            credentials
        );
        // @ts-ignore
        const jokePromiseClient = convertToPromiseClient(client);
        jokePromiseClient.waitForReady(/* dealine */Date.now() + 10000, (e) => {
            if (e) {
                reject(e);
            } else {
                // @ts-ignore
                resolve(jokePromiseClient);
            }
        });
    });
}