import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMember } from 'discord.js';
import storage from '../storage';

export default {
    command: new SlashCommandBuilder()
        .setName('추가')
        .setDescription('정보를 확인합니다.')
        .addUserOption(option => option
            .setName('유저')
            .setDescription('유저를 선택하세요.')
            .setRequired(true))
        .addIntegerOption(option => option
            .setName('값')
            .setDescription('추가할 값을 입력하세요.')),
    async handler(interaction: CommandInteraction) {
        let user = interaction.options.getUser('유저')!;
        let value = interaction.options.getInteger('값');
        if (!value) {
            value = 1;
        }

        const member = interaction.guild?.members.cache.get(user?.id as string) as GuildMember;
        let info = storage.stackData[user?.id as string];

        if (info === undefined) {
            info = storage.stackData[user?.id as string] = { value };
            storage.save();
        }
        else {
            info.value += value;
            storage.stackData[user?.id as string] = info;
            storage.save();
        }

        const embed = {
            title: "StackManager",
            description: `${member.nickname ?? user.username}님의 스택을 추가합니다.`,
            color: 0x999999,
            fields: [
                {
                    name: "추가 스택",
                    value: `${value} 스택`,
                },
                {
                    name: "현재 스택",
                    value: `${info.value} 스택`,
                }
            ],
            timestamp: new Date(),
            footer: {
                text: "기타 문의는 유원석에게 부탁드립니다.",
            }
        }

        interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
