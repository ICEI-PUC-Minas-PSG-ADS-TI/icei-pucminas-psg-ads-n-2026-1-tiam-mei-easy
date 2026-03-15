
# Metodologia

<span style="color:red">Pré-requisitos: <a href="2-Especificação do Projeto.md"> Documentação de Especificação</a></span>

Descreva aqui a metodologia de trabalho do grupo para atacar o problema. Definições sobre os ambiente de trabalho utilizados pela  equipe para desenvolver o projeto. Abrange a relação de ambientes utilizados, a estrutura para gestão do código fonte, além da definição do processo e ferramenta através dos quais a equipe se organiza (Gestão de Times).

## Relação de Ambientes de Trabalho

<!-- Os artefatos do projeto são desenvolvidos a partir de diversas plataformas e a relação dos ambientes com seu respectivo propósito deverá ser apresentada em uma tabela que especifica que detalha Ambiente, Plataforma e Link de Acesso. 
Nota: Vide documento modelo do estudo de caso "Portal de Notícias" e defina também os ambientes e frameworks que serão utilizados no desenvolvimento de aplicações móveis. -->

Os artefatos do projeto são desenvolvidos a partir de diferentes plataformas e ferramentas que auxiliam na organização, desenvolvimento e documentação da aplicação. A tabela a seguir apresenta os principais ambientes utilizados pela equipe.

| Ambiente | Plataforma | Link de Acesso |
|--------|-----------|---------------|
| Repositório de Código | GitHub | https://github.com |
| Controle de Versão | GitHub | https://github.com |
| Gestão de Demandas | Trello | https://trello.com/pt-BR |
| Editor de Código | Visual Studio Code | https://code.visualstudio.com |
| Modelagem de Diagramas | Draw.io (Diagrams.net) | https://app.diagrams.net |
| Modelagem de Banco de Dados | DBDiagram | https://dbdiagram.io |
| Gerenciamento de Projeto | GitHub | https://github.com |
| Comunicação da Equipe | Discord / WhatsApp | https://discord.com |
| Prototipação de Interface | Figma | https://figma.com |

Esses ambientes foram escolhidos por serem ferramentas amplamente utilizadas no desenvolvimento de software, além de oferecerem recursos gratuitos adequados para projetos acadêmicos.


## Controle de Versão

A ferramenta de controle de versão adotada no projeto foi o
[Git](https://git-scm.com/), sendo que o [Github](https://github.com)
foi utilizado para hospedagem do repositório.

O projeto segue a seguinte convenção para o nome de branches:

- `main`: versão estável já testada do software
- `unstable`: versão já testada do software, porém instável
- `testing`: versão em testes do software
- `dev`: versão de desenvolvimento do software

Quanto à gerência de issues, o projeto adota a seguinte convenção para
etiquetas:

- `documentation`: melhorias ou acréscimos à documentação
- `bug`: uma funcionalidade encontra-se com problemas
- `enhancement`: uma funcionalidade precisa ser melhorada
- `feature`: uma nova funcionalidade precisa ser introduzida
<!-- 
Discuta como a configuração do projeto foi feita na ferramenta de versionamento escolhida. Exponha como a gerência de tags, merges, commits e branchs é realizada. Discuta como a gerência de issues foi realizada.

> **Links Úteis**:
> - [Microfundamento: Gerência de Configuração](https://pucminas.instructure.com/courses/87878/)
> - [Tutorial GitHub](https://guides.github.com/activities/hello-world/)
> - [Git e Github](https://www.youtube.com/playlist?list=PLHz_AreHm4dm7ZULPAmadvNhH6vk9oNZA)
>  - [Comparando fluxos de trabalho](https://www.atlassian.com/br/git/tutorials/comparing-workflows)
> - [Understanding the GitHub flow](https://guides.github.com/introduction/flow/)
> - [The gitflow workflow - in less than 5 mins](https://www.youtube.com/watch?v=1SXpE08hvGs)
-->
## Gerenciamento de Projeto

### Divisão de Papéis

Apresente a divisão de papéis entre os membros do grupo.

Exemplificação: A equipe utiliza metodologias ágeis, tendo escolhido o Scrum como base para definição do processo de desenvolvimento. A equipe está organizada da seguinte maneira:
- Scrum Master: Gustavo Mialgres;
- Product Owner: Sara Marçal;
- Equipe de Desenvolvimento: Daniel de Freitas Cunha, Danilo Henrique de Souza Riguette, Gabriel Ribeiro Augusto
- Equipe de Design: Todos

<!-- 
> **Links Úteis**:
> - [11 Passos Essenciais para Implantar Scrum no seu Projeto](https://mindmaster.com.br/scrum-11-passos/)
> - [Scrum em 9 minutos](https://www.youtube.com/watch?v=XfvQWnRgxG0)
> - [Os papéis do Scrum e a verdade sobre cargos nessa técnica](https://www.atlassian.com/br/agile/scrum/roles)
-->
### Processo
<!-- 
Coloque  informações sobre detalhes da implementação do Scrum seguido pelo grupo. O grupo deverá fazer uso do recurso de gerenciamento de projeto oferecido pelo GitHub, que permite acompanhar o andamento do projeto, a execução das tarefas e o status de desenvolvimento da solução.
 
> **Links Úteis**:
> - [Planejamento e Gestáo Ágil de Projetos](https://pucminas.instructure.com/courses/87878/pages/unidade-2-tema-2-utilizacao-de-ferramentas-para-controle-de-versoes-de-software)
> - [Sobre quadros de projeto](https://docs.github.com/pt/issues/organizing-your-work-with-project-boards/managing-project-boards/about-project-boards)
> - [Project management, made simple](https://github.com/features/project-management/)
> - [Sobre quadros de projeto](https://docs.github.com/pt/github/managing-your-work-on-github/about-project-boards)
> - [Como criar Backlogs no Github](https://www.youtube.com/watch?v=RXEy6CFu9Hk)
> - [Tutorial Slack](https://slack.com/intl/en-br/)
-->
O desenvolvimento do projeto segue princípios de metodologias ágeis baseadas no **Scrum**, permitindo uma abordagem iterativa e incremental.

O trabalho da equipe é organizado em pequenas tarefas que são registradas no **Trello**, onde é possível acompanhar o progresso das atividades através de um quadro de tarefas dividido em colunas como:

- **Backlog** – tarefas planejadas para o projeto
- **To Do** – tarefas prontas para serem iniciadas
- **In Progress** – tarefas em desenvolvimento
- **Done** – tarefas concluídas

As funcionalidades do sistema são implementadas gradualmente, permitindo que a equipe acompanhe o progresso do desenvolvimento e realize ajustes sempre que necessário.

### Ferramentas

Diversas ferramentas foram utilizadas para auxiliar no desenvolvimento do projeto e na organização da equipe.

#### Editor de Código

O **Visual Studio Code** foi utilizado como editor de código principal, pois oferece suporte a diversas linguagens de programação, além de integração direta com o Git para controle de versão.

#### Ferramentas de Comunicação

Para comunicação entre os membros da equipe foram utilizadas plataformas digitais como **Discord** e **WhatsApp**, permitindo troca rápida de informações, organização de reuniões e discussão de decisões relacionadas ao projeto.

#### Ferramentas de Modelagem e Design

Para criação de diagramas e modelagem do sistema foi utilizado o **Draw.io (Diagrams.net)**. Já para prototipação das telas da aplicação foi utilizada a ferramenta **Figma**, que permite criar interfaces e visualizar a estrutura da aplicação antes da implementação.

Essas ferramentas foram escolhidas por serem acessíveis, gratuitas e amplamente utilizadas no desenvolvimento de projetos de software.
<!--


Liste quais ferramentas foram empregadas no desenvolvimento do projeto, justificando a escolha delas, sempre que possível.
 
> **Possíveis Ferramentas que auxiliarão no gerenciamento**: 
> - [Slack](https://slack.com/)
> - [Github](https://github.com/) -->
