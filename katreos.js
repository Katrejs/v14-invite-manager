const { Client, Partials, GatewayIntentBits, ButtonStyle, Collection, Events, ActivityType, EmbedBuilder, ButtonBuilder, ActionRowBuilder, Component } = require("discord.js");
const fs = require('node:fs');
const path = require('node:path');
const { joinVoiceChannel, VoiceConnectionStatus } = require("@discordjs/voice")
const info = require("./info.json")
const moment = require("moment");
moment.locale("tr");
require("moment-duration-format");
require("moment-timezone")
const mongoose = require("mongoose")
const Invitedb = require("./database/Invite.js")
const davetdb = require("./database/davet.js")
const { onayemoji, redemoji } = require("./emoji.json")
mongoose.connect(info.mongourl) 
const client = new Client({ fetchAllMembers : true , 
intents: [GatewayIntentBits.Guilds,
 GatewayIntentBits.GuildMembers,
  GatewayIntentBits.GuildEmojisAndStickers,
   GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildWebhooks,
     GatewayIntentBits.GuildInvites,
      GatewayIntentBits.GuildVoiceStates,
       GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
         GatewayIntentBits.GuildMessageReactions,
          GatewayIntentBits.GuildMessageTyping,
           GatewayIntentBits.DirectMessages,
            GatewayIntentBits.DirectMessageReactions,
             GatewayIntentBits.DirectMessageTyping,
              GatewayIntentBits.MessageContent], shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember, Partials.Reaction, Partials.GuildScheduledEvent, Partials.User, Partials.ThreadMember]});

              client.commands = new Collection();
              client.aliases = new Collection();
              client.events = new Collection();

              const eventsPath = path.join(__dirname, 'events');
              const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
              
              
              
              for (const file of eventFiles) {
                  const filePath = path.join(eventsPath, file);
                  const event = require(filePath);
                  if (event.once) {
                      client.once(event.name, (...args) => event.execute(...args));
                  } else {
                      client.on(event.name, (...args) => event.execute(...args));
                  }
                    console.log(`[EVENT] ${event.name} yüklendi`)
              }
              Array.prototype.clear = function() {
                let newArray = [];
                for (let i of this) {
                 if (!newArray.includes(i) && i !== "" && i !== " ") newArray.push(i);
                };
                return newArray;
              };
              
//              Date.prototype.toTurkishFormat = function() {
                //return moment.tz(this, "Europe/Istanbul").format('LLL');
              //};
              Date.prototype.toTurkishFormat = function() {
                return this.toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" });
              };



const commands = fs.readdirSync("./komut").filter(file => file.endsWith(".js"))
for(file of commands) {
const commandName = file.split(".")[0]
const command = require(`./komut/${commandName}`)
client.commands.set(commandName, command)
console.log(`[KOMUT] ${commandName} yüklendi`)
}
const prefix = `${info.regprefix}`
client.on('messageCreate', async (message) => {
    if(message.content.startsWith(prefix)) {
        const args = message.content.slice(prefix.length).trim().split(/ +/g)
        const commandName = args.shift()
        const command = client.commands.get(commandName) || client.commands.find(u => u.use && u.use.includes(commandName));
        if(!command) return
        command.run(client, message, args)
    }
})
const invites = client.invites = new Collection();
client.on(Events.ClientReady, async() => {
    console.log(`${client.user.tag} Aktif edildi`)
    client.user.setActivity(`${info.regdurum}`, { type: ActivityType.Playing });
    client.user.setStatus(`${info.regstat}`);
    
    let collect = new Collection();
    client.guilds.cache.forEach(async (guild) => {
        guild.invites.fetch().then((data) => {
            data.map((x) => { collect.set(x.code, { uses: x.uses, inviter: x.inviter, code: x.code, guildID: guild.id }) });
            client.invites.set(guild.id, collect);
        });
      });
    const katreses = client.channels.cache.get(info.regses);
    const connection = joinVoiceChannel({
   channelId: katreses.id,
   guildId: katreses.guild.id,
   adapterCreator: katreses.guild.voiceAdapterCreator,
   selfDeaf: true,
   selfMute: true,
});
connection.on(VoiceConnectionStatus.Ready, () => {
console.log('Ses bağlantısı tanımlandı');
});
})

mongoose.connect(`${info.mongourl}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    console.log('MongoDB bağlantısı başarılı');
  }).catch((err) => {
    console.error('MongoDB bağlantı hatası:', err);
  }); 

  client.on(Events.InviteCreate, async (invite) => {
    const invitesData = new Collection();
invite.guild.invites.fetch().then((data) => {
data.map((x) => {invitesData.set(x.code, {uses: x.uses, inviter: x.inviter, code: x.code });
});
client.invites.set(invite.guild.id, invitesData);
});
});

client.on(Events.InviteDelete, async (invite) => {
  const invitesData = new Collection();
  invite.guild.invites.fetch().then((data) => {
  data.map((x) => {invitesData.set(x.code, {uses: x.uses, inviter: x.inviter, code: x.code });
  });
  client.invites.set(invite.guild.id, invitesData);
  });
  })



  
client.on(Events.GuildMemberAdd, async(member) => {


const fetchInvites = client.invites.get(member.guild.id) || new Collection();
const invitesData = await member.guild.invites.fetch();
const invite = invitesData.find((data) => fetchInvites.has(data.code) && fetchInvites.get(data.code).uses < data.uses) || member.guild.vanityURLCode;
var vanityURL = await member.guild.fetchVanityData().catch(err=>{ vanityURL = "Sunucu özel urlsi yok"});
let collect = new Collection();
    client.guilds.cache.forEach(async (guild) => {
    guild.invites.fetch().then((data) => {
    data.map((x) => { collect.set(x.code, { uses: x.uses, inviter: x.inviter, code: x.code, guildID: guild.id }) });
    client.invites.set(guild.id, collect);
    });})
if(member.user.bot) {
  return
} 
    if(invite == member.guild.vanityURLCode) {
      member.guild.channels.cache.get(info.reginvkanal).send({ content: `${onayemoji} ${member} Sunucuya katıldı \`Sunucu Özel Url\` Kulaanmış. (<t:${Math.floor(Date.now() / 1000)}>)` })   
      await Invitedb.findByIdAndUpdate(member.id, { $set: { inviterid: "url", tarih: Date.now() } }, { upsert: true });
    
      return
    } else if(invite.inviterId == member.id) {
      member.guild.channels.cache.get(info.reginvkanal).send({ content: `${onayemoji} ${member} Sunucuya katıldı \`Kendi Davetini\` kullandığı için davet kazanmayacak(<t:${Math.floor(Date.now() / 1000)}>)` })   

      return
    } else {
       let inviter;
       try { inviter = await client.users.fetch(invite.inviter.id) }
        catch (err) { inviter = undefined }
       
        let datamcıks = await davetdb.findById(inviter.id);

     await davetdb.findByIdAndUpdate(inviter.id, { $inc: { size: 1 } }, { upsert: true });
     member.guild.channels.cache.get(info.reginvkanal).send({ content: `${onayemoji} ${member} Sunucuya katıldı ${inviter} üyesi \`${datamcıks?.size+1 || 1} davet\` sayısına ulaştı (<t:${Math.floor(Date.now() / 1000)}>)` })   
     await Invitedb.findByIdAndUpdate(member.id, { $set: { inviterid: inviter.id, tarih: Date.now() } }, { upsert: true });
    
    }



})

client.on(Events.GuildMemberRemove, async(member) => {
let datamcık = await Invitedb.findById(member.id);  
if(!datamcık) {
  member.guild.channels.cache.get(info.reginvkanal).send({ content: `${redemoji} \`${member.user.tag}\` Sunucudan Ayrıldı **Davetçi sistemde kayıtlı değil** (<t:${Math.floor(Date.now() / 1000)}>)` })   
return
} else if(datamcık) {
  let datamcıks = await davetdb.findById(datamcık.inviterid);
  if(datamcık.inviterid == 'url') {
    member.guild.channels.cache.get(info.reginvkanal).send({ content: `${redemoji} \`${member.user.tag}\` Sunucudan Ayrıldı \`Özel Url\` kullanarak katılmış (<t:${Math.floor(Date.now() / 1000)}>)` }) 
  } else {
await Invitedb.deleteMany({ inviterid: `${datamcık.inviterid}` })
await davetdb.findByIdAndUpdate(datamcık.inviterid, { $inc: { size: -1 } }, { upsert: true });
member.guild.channels.cache.get(info.reginvkanal).send({ content: `${redemoji} \`${member.user.tag}\` Sunucudan Ayrıldı <@${datamcık.inviterid}> üyesi \`${datamcıks?.size-1 || 0} davet\` sayısına geriledi (<t:${Math.floor(Date.now() / 1000)}>)` }) 
}}
})
client.login(info.regtoken)
