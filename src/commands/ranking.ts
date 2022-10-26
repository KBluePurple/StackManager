import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMember } from 'discord.js';
import storage from '../storage';

export default {
    command: new SlashCommandBuilder()
        .setName('랭킹')
        .setDescription('랭킹을 확인합니다.'),
    async handler(interaction: CommandInteraction) {
        await interaction.guild?.members.fetch();

        const sorted = Object.entries(storage.stackData).sort((a, b) => b[1].value - a[1].value);

        // @ts-ignore
        let rankList: [{ name: string, value: string, inline: boolean }] = [];

        let rank = 1;
        let lastValue = 129387462134;
        let str = "";
        for (let i = 0; i < sorted.length; i++) {
            const member = interaction.guild?.members.cache.get(sorted[i][0]) as GuildMember;
            if (member.nickname != null) { // 학생임
                const value = sorted[i][1].value; // 값
                console.log(value, i);

                if (value != lastValue) { // 이전 값이랑 다르면
                    if (value != 0) {
                        rankList.push({ // 값 추가
                            name: `${rank == 1 ? "🥇" : rank == 2 ? "🥈" : rank == 3 ? "🥉" : ""}${rank++}위`,
                            value: str,
                            inline: (rank - 1) % 3 === 0
                        });

                        str = ""; // 초기화
                    }
                    lastValue = value; // 이전 값 변경
                }

                str += `${member.nickname}: \`${value}\` 스택\n`;

                if (i == sorted.length - 1) { // 마지막이면
                    rankList.push({ // 값 추가
                        name: `${rank == 1 ? "🥇" : rank == 2 ? "🥈" : rank == 3 ? "🥉" : ""}${rank++}위`,
                        value: str,
                        inline: (rank - 1) % 3 === 0
                    });
                }
            }
        }

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
