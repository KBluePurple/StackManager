import { GuildMember, Message } from "discord.js";
import storage from "../storage";

export default {
    name: "조회",
    async handler(message: Message, args: string[]) {
        let user = message.member as GuildMember;
        if (args.length > 1) {
            user = message.mentions.members?.first() as GuildMember;
        }

        if (storage.stackData[user.id] === undefined) {
            storage.stackData[user.id] = { value: 0 };
        }

        message.reply(`현재 **${user.nickname}**님의 스택은 ${storage.stackData[user.id]}개 입니다.`);
        storage.save();

    }
}
