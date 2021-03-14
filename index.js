const Discord = require('discord.js');
const knightsora = new Discord.Client();
require('dotenv').config();
const prefix = process.env.prefix;
const mysql = require('mysql');

//Include Extensions

//SQL Connection
const mariadb = require('mariadb');
const pool = mariadb.createPool({host: 'mydb.com', user: 'myUser',pwd: 'mypwd', connectionLimit: 5});
pool.getConnection()
    .then(conn => {
      conn.query("SELECT 1 as val")
        .then((rows) => {
          console.log(rows); //[ {val: 1}, meta: ... ]
          return conn.query("INSERT INTO myTable value (?, ?)", [1, "mariadb"]);
        })
        .then((res) => {
          console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }
          conn.end();
        })
        .catch(err => {
          //handle error
          conn.end();
        })
    }).catch(err => {
      //not connected
    });

//EXP Generate

function generateExperiencePoint() {
  const MinEXP = process.env.MinEXP;
  const MaxEXP = process.env.MaxEXP;

  return Math.floor(Math.random() * (MaxEXP - MinEXP + 1)) + MinEXP;
}

//Bot Settings
knightsora.on('ready', () => {
  console.log(`Logged in as ${knightsora.user.tag}!`);
  knightsora.user.setPresence({ activity: { name: 'Powered by 結城あやの | Using /help', type: 'STREAMING' }, status: 'idle' });
});

//Command Entry
knightsora.on('message', (msg) => {
  connection.query(`SELECT * FROM xp WHERE ID = '${msg.author.id}' AND Guild = '${msg.channel.id}'`, (err, rows) => {
    if (err) throw err;

    let sql;

    if (rows.length < 1) {
      sql = `INSERT INTO xp (ID, GuildID, ExperiencePoint) VALUES '${msg.author.id}','${msg.guild.id}',${msg.guild.id},${generateExperiencePoint()}`;
    } else {
      let xp = rows[0].ExperiencePoint;
      sql = `UPDATE xp SET ExperiencePoint = ${xp + generateExperiencePoint()} WHERE ID = '${msg.author.id}' AND GuildID = '${msg.guild.id}'`;
    }
    connection.query(sql);
  });
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

//Bot Login
knightsora.login(process.env.token);
