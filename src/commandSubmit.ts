import { ApplicationCommandData, CommandInteraction } from 'discord.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import * as fs from 'fs';
import "dotenv/config";

type Command = {
    command: ApplicationCommandData,
    handler: (interaction: CommandInteraction) => void
}

export default {
    registerCommands(commands: Map<string, Command>) {
        const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);
        
        (async () => {
            try {
                console.log('Started refreshing application (/) commands.');

                await rest.put(
                    Routes.applicationGuildCommands(process.env.CLIENT_ID!, "561538306999844885"),
                    { body: Array.from(commands.values()).map(command => command.command) },
                );

                console.log(`Successfully reloaded ${commands.size} commands.`);
            } catch (error) {
                console.error(error);
            }
        })();
    }
}