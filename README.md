# Projeto em Quasar + Express + MySQL + Firebase auth
ATENÇÃO: PROJETO DE ESTUDO QUE FOI DESENVOLVIDO ESPECIFICAMENTE PARA EMPRESA ONDE TRABALHO.

- Acesso com Firebase Auth - Via conta Google ou criando uma conta no sistema;
- Dashboard para cadastro de acesso dos principais serviços online de clientes com rotina para testar a disponibilizade do serviço de todos os clientes utilizando o Cheerio;
- Controle das atividades realizadas aos clientes, com emissões de relatórios gerais ou indívidual e possibilidade de ordernar os dados com alguns filtros;
- Dashboard para registro de Planejamento de demandas com disparo de e-mail para as equipes quando uma nova demanda é registrada;
- Controle do histórico de visitas efetuadas a clientes pelo coordenador/comercial;
- Cadastro de cards em forma de Post-it, por usuário, com possíbilidae de alterar a cor do card e também de efetuar lembrente para uma data futura onde será disparado um e-mail;
- Repositório para compartilhamento de scripts.

## Clone o projeto e rode o comando:
```bash
npm install
```
## Configure o seu banco de dados:
```bash
Altere os dados de conexão em server/server.js, coloque os dados de acesso ao mysql as variáveis de acesso ao seu banco de dados:
```

## Configure os dados do firebase:
```bash
No arquivo firebaseInit.js configure sua chave de acesso do firebase.
```

## No arquivo Quasar.conf.js 
```bash
Alterar o ENV da sua API, setando o endereço do seu servidor Node. Por padrão está na http://localhost:3000.
```
### Para iniciar o app, rode o comando:
```bash
quasar dev
```
### Mais informações em:
```bash
https://quasar.dev/start
```


