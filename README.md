# devPT Discord Welcome Bot

Este repositório serve de momento de armazenamento das frases utilizadas para dar as boas-vindas aos mais recentes membros.

A frase de introdução a novos utilizadores é construída com base no output da junção de uma seleção aleatória de uma frase do ficheiro `intro.txt` e de uma outra frase do ficheiro `welcoming.txt`.

A tag `<@${context.params.event.user.id}>` é substituída em runtime pelo nome de utilizador que entrou no servidor, mencionando-o.