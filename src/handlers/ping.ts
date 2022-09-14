import { Message } from "discord.js";

export default {
    name: "ping",
    async handler(message: Message, args: string[]) {
        const ping = await message.channel.send("Pong!");
        ping.edit(`Pong! Latency: ${ping.createdTimestamp - message.createdTimestamp}ms`);
    }
}
