const fs = require('fs');
const path = require('path');


const commandHandler = () => {
	const commandFiles = fs.readdirSync(path.join(__dirname, '../commands'));
	const commands = commandFiles.map(file =>
		require(`../commands/${file}`),
	);
	return (message) => {
		if (message.author.bot) return;
		if (message.content.charAt(0) !== '!') return;
		const commandString = message.content.split(' ')[0].slice(1);
		const command = commands.find(com => com.name === commandString);
		if (!command) return;
		const args = message.content.split(' ').slice(1);
		command.run(message, args);
	};
};
module.exports = commandHandler;
