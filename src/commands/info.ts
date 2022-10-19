import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMember } from 'discord.js';
import storage from '../storage';

export default {
    command: new SlashCommandBuilder()
        .setName('정보')
        .setDescription('정보를 확인합니다.')
        .addUserOption(option => option.setName('유저').setDescription('유저를 선택하세요.')),
    async handler(interaction: CommandInteraction) {
        let user = interaction.options.getUser('유저');
        if (!user) {
            user = interaction.user;
        }

        const member = interaction.guild?.members.cache.get(user?.id as string) as GuildMember;
        let info = storage.stackData[user?.id as string];

        if (info === undefined) {
            info = storage.stackData[user?.id as string] = { value: 0 };
            storage.save();
        }

        const embed = {
            title: "StackManager",
            description: `${interaction.user.username}님의 정보`,
            color: 0x999999,
            fields: [
                {
                    name: "스택",
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
