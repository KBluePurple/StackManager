import * as discord from "discord.js";
import { getLogger } from "./util/logger";
import "dotenv/config";
import * as fs from "fs";
import storage from "./storage";
import { CommandInteraction, Interaction } from "discord.js";
import commandSubmit from "./commandSubmit";

const logger = getLogger("Discord");
const prefix = '!!';

type Command = {
    command: discord.ApplicationCommandData,
    handler: (interaction: CommandInteraction) => void
}

const handlers = new Map<string, (message: discord.Message, args: string[]) => void>();

const handlerFiles = fs.readdirSync("./dist/handlers");

for (const handlerFile of handlerFiles) {
    import(`./handlers/${handlerFile}`).then(handler => {
        handlers.set(handler.default.name, handler.default.handler);
    });
}

const commands = new Map<string, Command>();

const commandFiles = fs.readdirSync("./dist/commands");

const func = async () => {
    for (const commandFile of commandFiles) {
        await import(`./commands/${commandFile}`).then(command => {
            commands.set(command.default.command.name, command.default);
        });

        commandSubmit.registerCommands(commands);
    }
};

func();

const intents = [
    discord.Intents.FLAGS.GUILDS,
    discord.Intents.FLAGS.GUILD_MEMBERS,
    discord.Intents.FLAGS.GUILD_BANS,
    discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    discord.Intents.FLAGS.GUILD_INTEGRATIONS,
    discord.Intents.FLAGS.GUILD_WEBHOOKS,
    discord.Intents.FLAGS.GUILD_INVITES,
    discord.Intents.FLAGS.GUILD_VOICE_STATES,
    discord.Intents.FLAGS.GUILD_PRESENCES,
    discord.Intents.FLAGS.GUILD_MESSAGES,
    discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
    discord.Intents.FLAGS.DIRECT_MESSAGES,
    discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING,
    discord.Intents.FLAGS.GUILD_SCHEDULED_EVENTS
];

const client = new discord.Client({
    intents: intents,
    partials: ["MESSAGE", "CHANNEL", "REACTION"],
    presence: {
        status: "idle",
        activities: [
            {
                name: "스택쌓기",
                type: "PLAYING"
            }
        ]
    }
});

client.on("ready", () => {
    logger.info(`Logged in as ${client.user?.tag}`);
});

client.on("messageCreate", async (message: discord.Message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.split(" ");
    const command = args[0].slice(prefix.length);

    if (handlers.has(command)) {
        handlers.get(command)?.(message, args);
    }
});

client.on("interactionCreate", async (interaction: Interaction) => {
    if (!interaction.isCommand()) return;

    if (commands.has(interaction.commandName)) {
        commands.get(interaction.commandName)?.handler(interaction);
    }
});

client.on("warn", message => {
    logger.warn(message);
});

client.on("error", message => {
    logger.error(message.message);
});

storage.load();
client.login(process.env.DISCORD_TOKEN);
