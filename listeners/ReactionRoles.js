module.exports = {
    name: 'roles', 
    description: "Este comando recebe as interações do reaction role!",
    async execute(interaction) {
                
        const { values, member } = interaction

        const component = interaction.component
        const removed = component.options.filter((option) => {
            return !values.includes(option.value)
        })

        for (const id of removed) {
            member.roles.remove(id.value)
        }

        for (const id of values) {
            member.roles.add(id)
        }

        interaction.reply({content: 'Roles Updated!', ephemeral: true})
    }
}
