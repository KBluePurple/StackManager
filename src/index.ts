import * as discord from "discord.js";
import { getLogger } from "./util/logger";
import "dotenv/config";
import * as fs from "fs";
import storage from "./storage";
import { CommandInteraction, Interaction } from "discord.js";
import commandSubmit from "./commandSubmit";

const logger = getLogger("Index");

logger.info("Starting bot...");

type Command = {
    command: discord.ApplicationCommandData,
    handler: (interaction: CommandInteraction) => void
}
const commands = new Map<string, Command>();

const commandFiles = fs.readdirSync("./dist/commands");

const func = async () => {
    for (const commandFile of commandFiles) {
        await import(`./commands/${commandFile}`).then(command => {
            commands.set(command.default.command.name, command.default);
        });
    }
    commandSubmit.registerCommands(commands);

    logger.info(`Loaded ${commands.size} commands.`);
};

func();

const intents = [
    discord.Intents.FLAGS.GUILDS,
    discord.Intents.FLAGS.GUILD_MEMBERS,
    discord.Intents.FLAGS.GUILD_INTEGRATIONS,
    discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
    discord.Intents.FLAGS.DIRECT_MESSAGES,
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

client.on("interactionCreate", async (interaction: Interaction) => {
    if (!interaction.isCommand()) return;
    console.log(`Received command ${interaction.commandName}`);
    

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
