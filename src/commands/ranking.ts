import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMember } from 'discord.js';
import storage from '../storage';

export default {
    command: new SlashCommandBuilder()
        .setName('rank')
        .setDescription('랭킹을 확인합니다.'),
    async handler(interaction: CommandInteraction) {
        const sorted = Object.entries(storage.stackData).sort((a, b) => b[1].plus - a[1].plus);

        let rank = 1;
        const rankList = sorted.map(([key, value]) => {
            const user = interaction.guild?.members.cache.get(key) as GuildMember;
            return {
                name: `${rank == 1 ? "🥇" : rank == 2 ? "🥈" : rank == 3 ? "🥉" : ""}${rank++}위`,
                value: `${user.nickname} - \`${value.plus}\` 스택`,
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

        interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
