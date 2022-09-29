import { ApplicationCommandData, CommandInteraction } from 'discord.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { getLogger } from './util/logger';
import "dotenv/config";

const logger = getLogger("CommandSubmit");

type Command = {
    command: ApplicationCommandData,
    handler: (interaction: CommandInteraction) => void
}

export default {
    registerCommands(commands: Map<string, Command>) {
        const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);
        
        (async () => {
            try {
                logger.info('Started refreshing application (/) commands.');

                await rest.put(
                    Routes.applicationCommands(process.env.CLIENT_ID!),
                    { body: Array.from(commands.values()).map(command => command.command) },
                );

                logger.info(`Successfully reloaded ${commands.size} commands.`);
            } catch (error) {
                logger.error(error as string);
            }
        })();
    }
}