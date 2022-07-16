const { MessageActionRow, MessageSelectMenu } = require('discord.js');

module.exports = {
    name: 'roles', 
    description: "Este comando cria um reaction role!",
    async execute(message, client) {
        const guild = client.guilds.cache.get("730385704592343083")
        const staffrole = guild.roles.cache.find(role => role.name === "Moderador") //O role do staff, para só ele poder mandar o comando !dropdown
        const staffid = staffrole.id
        const membro = guild.members.cache.get(message.author.id)

        if (!membro.roles.cache.has(staffid)) {
            return
        } else {

            const one = message.guild.roles.cache.find(role => role.name === "C")
            const two = message.guild.roles.cache.find(role => role.name === "C++")
            const three = message.guild.roles.cache.find(role => role.name === "C#")
            const four = message.guild.roles.cache.find(role => role.name === "Clojure")
            const five = message.guild.roles.cache.find(role => role.name === "Golang")
            const six = message.guild.roles.cache.find(role => role.name === "F#")
            const seven = message.guild.roles.cache.find(role => role.name === "Java")
            const eight = message.guild.roles.cache.find(role => role.name === "Javascript")
            const nine = message.guild.roles.cache.find(role => role.name === "Haskel")
            const ten = message.guild.roles.cache.find(role => role.name === "Kotlin")
            const eleven = message.guild.roles.cache.find(role => role.name === "PHP")
            const twelve = message.guild.roles.cache.find(role => role.name === "Python")
            const thirteen = message.guild.roles.cache.find(role => role.name === "Ruby")
            const fourteen = message.guild.roles.cache.find(role => role.name === "Rust")
            const fiftenn = message.guild.roles.cache.find(role => role.name === "Swift")
            const sixteen = message.guild.roles.cache.find(role => role.name === "Scala")
            const seventeen = message.guild.roles.cache.find(role => role.name === ".NET")


            const rowch = new MessageActionRow().addComponents(
                new MessageSelectMenu()
                .setMinValues(0)
                .setMaxValues(17)
                .setCustomId('select')
                .setPlaceholder('Nada Selecionado...')
                .addOptions([
                    { label: 'C', value: one.id, emoji: '<:C_:811738530886713407>' },
                    { label: 'C++', value: two.id, emoji: '<:Cpp:811738530752757762>' },
                    { label: 'C#', value: three.id, emoji: '<:CSharp:811738531361063013>' },
                    { label: 'Clojure', value: four.id, emoji: '<:Clojure:888592260655095808>' },
                    { label: 'Golang', value: five.id, emoji: '<:Golang:811738531335503912>' },
                    { label: 'F#', value: six.id, emoji: '<:Fsharp:888592732392669254>' },
                    { label: 'Java', value: seven.id, emoji: '<:Java:811738531566321724>' },
                    { label: 'Javascript', value: eight.id, emoji: '<:JavaScript:888594444708892723>' },
                    { label: 'Haskel', value: nine.id, emoji: '<:Haskell:811738531369844765>' },
                    { label: 'Kotlin', value: ten.id, emoji: '<:Kotlin:811738531726753812>' },
                    { label: 'PHP', value: eleven.id, emoji: '<:PHP:811738531239559189>' },
                    { label: 'Python', value: twelve.id, emoji: '<:Python:811738531609182219>' },
                    { label: 'Ruby', value: thirteen.id, emoji: '<:Ruby:811738531415457843>' },
                    { label: 'Rust', value: fourteen.id, emoji: '<:Rust:888593838833283093>' },
                    { label: 'Swift', value: fiftenn.id, emoji: '<:Swift:811738531738812436>' },
                    { label: 'Scala', value: sixteen.id, emoji: '<:Scala:888593867547480064>' },
                    { label: '.NET', value: seventeen.id, emoji: '<:DotNet:811738531047276565>' },
                ]),               
            )

            message.channel.send({ content: 'Escolha as suas linguagens de programação', components: [rowch] })
        }
    }
}
