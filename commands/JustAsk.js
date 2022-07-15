module.exports = {
    name: 'JustAsk',
    description: "Este comando é ativado sempre que alguém manda uma mensagem para o servidor",
    execute(message) {
        if (message.author.bot) return

        //Variáveis para ver individualmente todos os elementos, o {i} para o compare[] e o {n} para o mandatory[]. Depois se estes elementos estiverem na frase original (keywords), são adicionadas ao filteredCompare/filteredMandatory
        let i = 0
        let n = 0
    
        const compare = ["alguém", "alguem", "algum", "preciso", "precisava", "ajuda", "ajudar", "problema", "consegue", "malta", "gente", "programa", "algo", "codificação", "codificacão", "codificaçao", "codificacao"]
        const mandatory = ["copilot", "android", "ios", "linux", "ubuntu", "manjaro", "mint", "windows", "java", "javascript", "js", "typescript", "ts", "kotlin", "html", "css", "c", "c#", "c++", "py", "python", "rust", "ruby", "pearl", "assembly", "shell", "bash", "haskell", "swift", "scala", "golang", "clojure", "net", "f#", "php", "game", "gamedev", "dev", "ops", "devops", "seguranca", "security", "backend", "back", "end", "iot", "system", "react", "vue", "angular", "node", "npm", "tkinter", "código", "codigo", "system", "códigos", "puppeteer"]
    
        let filteredCompare = []
        let filteredMandatory = []
    
        let compareState = ""
        let mandatoryState = ""
    
        //Dá o número de pontos finais e vírgulas numa mensagem ---ainda não implementado, a usar mais tarde---
        const totalPonctuation = message.content.split(/[.,(){}]/).length - 1
    
        //Divide a frase para apenas ficarem palavras sem pontuação
        const keywords = message.content.replace(/[.,!_]/, " ").replace(/(\r\n|\n|\r)/g, " ").replace("?", " ?").toLowerCase().split(" ")
    
        console.log(keywords)
    
        //Palvras a comparar, para saber se se trata realmente de uma pergunta
        while (compareState != undefined) {
            let pushCompareWord = keywords.includes(compare[i])
    
            if (pushCompareWord) {
                filteredCompare.push(compare[i])
            }
    
            if (compare[i] == undefined) {
                compareState = undefined
            }
    
            i = i + 1
        }
    
        //Palvras obrigatórias, para diferenciar perguntas de programação de perguntas casuais
        while (mandatoryState != undefined) {
            let pushMandatoryWord = keywords.includes(mandatory[n])
    
            if (pushMandatoryWord) {
                filteredMandatory.push(mandatory[n])
            }
    
            if (mandatory[n] == undefined) {
                mandatoryState = undefined
            }
    
            n = n + 1
        }
    
        //O embed
        const jaEmbed = {
            color: 0x25282b,
            title: 'Não perguntes para perguntar',
            url: 'https://dontasktoask.com/pt-pt/',
            thumbnail: {
                url: 'https://dontasktoask.com/favicon.png'
            }
        }
    
        //Primeiro critério que defini para considerar uma pergunta "mal-feita"
        if (keywords.length < 16 && filteredCompare.length > 0 && filteredMandatory.length > 0) {       
            message.channel.send({ content: '👉 https://dontasktoask.com/pt-pt/', embeds: [jaEmbed] })
        }
    
        else if (keywords.length < 12 && filteredCompare.length > 0 && keywords.includes("?")) {
            message.channel.send({ content: '👉 https://dontasktoask.com/pt-pt/', embeds: [jaEmbed] })
        }
    
        i = 0
        n = 0
    
        filteredCompare = []
        filteredMandatory = []
    
        compareState = ""
        mandatoryState = ""
    }
}
