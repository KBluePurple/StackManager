import { GuildMember, Message } from "discord.js";
import storage from "../storage";

export default {
    name: "랭킹",
    async handler(message: Message, args: string[]) {
        const sorted = Object.entries(storage.stackData).sort((a, b) => b[1] - a[1]);
        let rank = 1;
        const rankList = sorted.map(([key, value]) => {
            const user = message.guild?.members.cache.get(key) as GuildMember;
            return { 
                name: `${rank == 1 ? "🥇" : rank == 2 ? "🥈" : rank == 3 ? "🥉" : ""}${rank++}위`,
                value: `${user.nickname} - \`${value}\` 스택`,
                inline: (rank - 1) % 3 === 0
            };
        });

        const embed = {
            title: "StackManager",
            description: "2학년 1반의 스택 랭킹",
            color: 0x999999,
            fields: rankList,
            timestamp: new Date(),
            footer: {
                text: "기타 문의는 유원석에게 부탁드립니다.",
            }
        }

        message.channel.send({ embeds: [embed] });
    }
}
