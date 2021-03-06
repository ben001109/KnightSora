const Discord = require('discord.js');
const knightsora = new Discord.Client();
require('dotenv').config();
const prefix = process.env.prefix;

knightsora.on('ready', () => {
  console.log(`Logged in as ${knightsora.user.tag}!`);
  knightsora.user.setPresence({ activity: { name: 'Powered by 結城あやの | Using /help', type: 'STREAMING' }, status: 'idle' });
});

knightsora.on('message', (msg) => {
  if (!msg.content.startsWith(prefix) || msg.author.bot) return;
  const args = msg.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'ping') {
    msg.channel.send(`Pong!\n延遲${0 - (Date.now() - msg.createdTimestamp)}ms`);
  } else if (command === 'help' || 'h') {
    const help = new Discord.MessageEmbed()
      .setColor('#0F1D57')
      .setTitle('Help')
      .setDescription('Powered By 結城あやの')
      .addFields(
        {
          name: '核心功能',
          value: 'help: 顯示此列表',
        },
        {
          name: '實用功能',
          value: 'ping: 測試延遲',
        },
        {
          name: '管理功能',
          value: '尚未實裝',
          //value: 'warn: 警告使用者\nkick: 踢出使用者\nban: 封禁使用者\nmute: 水桶使用者',
        },
        {
          name: '娛樂功能',
          value: '尚未實裝',
          // inline: true,
        }
      )
      .setFooter('Copyright © 結城あやの From SJ Bots');
    msg.channel.send(help);
  }
});

knightsora.login(process.env.token);
