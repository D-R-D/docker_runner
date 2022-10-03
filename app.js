const { Client, GatewayIntentBits } = require("discord.js");
const dotenv = require("dotenv");
const childProcess = require('child_process');

dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessages] });

client.once("ready", async () => {
    const container_names = childProcess.execSync('docker ps -a --format "{{.Names}}"');
    const names = container_names.toString().split('\n');

    var data0 =
    {
        name: "docker",
        description: "docker start , stop and status ",
        options: [
            {
                name: "command",
                description: "choice command",
                type: 3,
                required: true,

                choices: [
                    {
                        name: "start",
                        value: "start"
                    },
                    {
                        name: "stop",
                        value: "stop"
                    },
                    {
                        name: "restart",
                        value: "restart"
                    }
                ]
            },
            {
                name: "machine",
                description: "input machine name",
                type: 3,
                required: true,

                choices: [

                ]
            }
        ]
    };

    names.forEach(function (item) {
        if (item != "") {
            var item_obj = { "name": `${item}`, "value": `${item}` };
            data0.options[1].choices.push(item_obj);
        }
    });

    const data1 =
    {
        name: "containers",
        description: "show container status",
    };

    const commands = [data0,data1];
    await client.application.commands.set(commands, process.env.CHANNEL_ID);

    console.log("Ready!");
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) {
        return;
    }

    await interaction.reply("PROCESSING...");

    if (interaction.commandName === "docker") {
        const cmd = 'docker '+interaction.options.getString("command")+" "+interaction.options.getString("machine");
        const stdout = childProcess.execSync(cmd);

        let msg = stdout.toString();

        if (msg === "") {
            msg = "int!!";
        }

        await interaction.editReply(msg);
    }

    if (interaction.commandName === "containers") {
        const stdout = childProcess.execSync('docker ps -a');

        let msg = "```" + stdout.toString() + "```";

        if (msg === "") {
            msg = "int!!";
        }

        await interaction.editReply(msg);
    }
});

client.login(process.env.DISCORD_TOKEN);