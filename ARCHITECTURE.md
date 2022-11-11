# Arquitetura do Discord Bot devPT

## Introdução

Este documento descreve a arquitetura do Discord Bot devPT. O objetivo deste documento é fornecer uma visão geral da arquitetura e dos padrões de design do bot.

## Arquitetura

O projeto segue, de forma não purista, algumas das ideias de _Domain-Driven Design_ (DDD), de _Hexagonal Architecture_ (também conhecido como _Ports and Adapters_) e _Feature Driven Development_ (aplicação de UseCases).

![](https://jmgarridopaz.github.io/assets/images/hexagonalarchitecture/figure1.png)

Esta arquitetura facilita a escalabilidade, manutenção e implementação de práticas de testes ao permitir a injeção de diferentes dependências, cada qual responsável única e exclusivamente pela sua responsabilidade, respeitando o _Single-Responsability Principle (SRP)_.

A Arquitetura Hexagonal remete para a ideia de que uma aplicação pode ter diversos condutores (_drivers_), no caso deste bot sendo:

- Mensagens digitados num canal que façam match a determinado padrão (`!ja`, `!oc`)
- Comandos built-in do Discord
- Entrada de um novo utilizador no servidor
- Reação a emojis
- Testes

Utilizando uma abordagem de UseCases, permitimos que:

- Nos seja possível testar as nossas implementações independentemente de repositórios ou serviços (podemos facilmente trocar um MysqlUserRepository para um MemoryUserRepository)
- Construamos soluções em resposta ao domínio e não à implementação (ex.: uma boa implementação poderia permitir-nos utilizar um SlackChatService ao invés de um DiscordChatService, limitando-me a implementar a interface ChatService e trocar a implementação pretendida)

## Camadas

### Domínio

Numa modelagem de domínio, o domínio é o conjunto de conceitos que são relevantes para o negócio.

Para que sejamos sucintos, manteremos ao longo deste capítulo o foco na análise tática do DDD, com isto recomendando uma leitura em detalhe sobre a análise estratégica.

Sucintamente, utilizamos no projeto conceitos de domínio como:

1. Entidades - qualquer entidade que seja passível de ser identificada (por norma através de um ID/UUID). Uma entidade só deve ser construída caso seja considerada válida na sua totalidade (se necessário podem e devem ser feitas validações no seu _constructor_). Ex.: User; Channel

2. Repositórios - contratos (de agora em diante chamadas de interfaces) que acordam com o "mundo exterior" que tipo de operações se podem realizar num banco de persistência com Entidades. Ex.: UserRepository; ChannelRepository

3. Services - interfaces que permitem a abstração de sistemas externos para que sejam orquestradas e efetuadas operações que possam envolver Entidades de domínio e eventualmente Value Objects. Ex.: ChatService; LoggerService

4. Value Objects - qualquer entidade que não seja identificável e que as suas instâncias sejam facilmente substituíveis umas pelas outras. Ex.: `new Cor('rosa')` / `new Cor('azul')`; `new Name('João')` / `new Name('Pedro')`;

- Esta é uma visão **MUITO** dilatada dos conceitos de DDD. Por exemplo, na realidade existem (entre outros tantos conceitos) dois tipos de serviços (Domínio e Aplicação), quando na realidade apenas utilizamos um em prol da simplificação deste projeto de escopo mais reduzido.

### Aplicação

A camada de aplicação é por norma referenciada como a orquestradora. Utilizando _Feature Driven Development_, a nossa implementação baseia-se em UseCases.

Cada UseCase corresponde a uma funcionalidade da aplicação, pelo que deve ser por norma criada uma implementação para cada uma - a não ser que esta seja de tal forma obviamente semelhante que não faça sentido a duplicação da funcionalidade (p.ex.: comando `!ja` e comando `!oc` - na realidade, ambos enviam uma mensagem para um canal, apesar de a mensagem ser ligeiramente diferente, o processamento do UseCase é exatamente o mesmo, e como tal o seu teste será exatamente igual).

É ela que recebe `Request` (também conhecido como `Input`), e exporta `Response` (ou `Output`).

Entre o `Request` e o `Response` ela é responsável por fazer executar os comandos necessários para fazer cumprir o UseCase referido.

Um UseCase deve depender de interfaces (de serviços ou repositórios) - segundo o Depency Inversion Principle (DIP) -, para que consiga realizar a sua ação.

### Infraestrutura

A infraestrutura concentra-se em implementar cada contrato, escondendo os detalhes de cada implementação.

Um ChatService para enviar uma mensagem precisará por exemplo de uma mensagem (string) e de um User (entidade de domínio). Uma implementação DiscordChatService e SlackChatService devem receber exatamente estes mesmos dados, e deverão sempre comunicar com o exterior utilizando entidades de domínio (tipos criados para o efeito na camada de domínio), mesmo que para isso seja necessário executar qualquer tipo de mapeamento.

## Tecnologias

O bot é desenvolvido com recurso a TypeScript, utilizando Discord.js como biblioteca de comunicação com a API do Discord.

Em produção o bot é atualmente executado no Heroku (em vias de ser portado para outro serviço) e pode ser executado localmente com recurso ao Docker. Num futuro ideal, o ambiente de produção será também ele executado através do mesmo Dockerfile que alimenta o ambiente de desenvolvimento, através de multi-stage builds.

Para a execução de testes, o bot utiliza o Vitest.

## Testes

Cada teste deverá dar mock de cada dependência que não seja relevante para o teste em questão.

Num cenário ideal, no desenvolvimento de uma nova funcionalidade, o programador deverá começar pelos testes para que tenha uma visão clara do que pretende atingir com a adição de um novo UseCase, ou com a respetiva alteração de código.
