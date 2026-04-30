## Plano de  Testes de Software – MEI Easy

Este documento descreve o Plano de Testes de Software do sistema MEI Easy, contemplando os principais requisitos funcionais da aplicação.
Os testes descritos ainda não foram executados, estando no estado planejado
 
 ## Casos de Teste

| ID | Funcionalidade | Requisito | Objetivo do Teste | Pré-condição | Resultado Esperado | Estado |
| ---- | --------------- | ---------- | ------------------ | -------------- | ------------------- | -------- |
| CT-01 | Cadastro de Receita | RF-002 | Permitir que o usuário registre uma receita e visualize seu impacto no controle financeiro | Usuário autenticado | Receita registrada e refletida no dashboard | Planejado |
| CT-02 | Cadastro de Despesa | RF-002 | Permitir que o usuário registre uma despesa e visualize a redução do saldo financeiro | Usuário autenticado | Despesa registrada e valores atualizados | Planejado |
| CT-03 | Edição de Movimento | RF-002 | Permitir ao usuário corrigir informações financeiras já registradas | Movimento existente | Dados atualizados corretamente | Planejado |
| CT-04 | Exclusão de Movimentação | RF-002 | Permitir ao usuário remover registros financeiros indiretos | Movimento existente | Registro removido e todos os recalculados | Planejado |
| CT-05 | Filtro de Movimentos | RF-002 | Permitir a análise financeira por período, tipo e categoria | Movimentos cadastrados | Listagem filtrada corretamente | Planejado |
| CT-06 | Painel Financeiro | RF-008 | Exibir um resumo financeiro claro da situação do negócio | Movimentos cadastrados | Todos os gráficos e gráficos exibidos corretamente | Planejado |
| CT-07 | Relatório Financeiro | RF-009 | Permitir a visualização detalhada das movimentações financeiras | Movimentos cadastrados | Relatório consistente com os dados registrados | Planejado |
| CT-08 | Metas Financeiras | RF-006 | Permitir o acompanhamento do progresso financeiro em relação a uma meta | Usuário autenticado | Progresso da meta correta | Planejado |
| CT-09 | Notificações de Alertas | RF-011 | Alertar o usuário sobre limites e metas financeiras | Meta próxima do limite | Notificação exibida ao usuário | Planejado |
| CT-10 | Controle de Estoque | RF-012 | Permitir o controle da quantidade de produtos do negócio | Usuário autenticado | Estoque atualizado corretamente | Planejado |

 ## Ferramentas de Testes

Para o planejamento, documentação e execução dos testes do sistema MEI Easy, foram utilizadas ferramentas que auxiliaram na organização dos casos de teste, no controle das versões do projeto e na padronização dos artefatos de Engenharia de Software.

As ferramentas obrigatórias no contexto do projeto são descritas a seguir:

-  **GitHub**  
  Utilizado como ferramenta de versionamento e colaboração entre os membros da equipe. O GitHub também é desenvolvedor na documentação do plano de testes, permitindo o registro estruturado dos casos de teste em arquivos Markdown, além de facilitar o acompanhamento de alterações ao longo do desenvolvimento.

-  **Planilhas Eletrônicas (Excel)**  
  Utilizadas para a organização dos casos de teste em formato tabular, contendo informações como identificador do teste, requisito associado, objetivo, pré-condições, passos, resultado esperado e status. Esse formato facilita tanto o planejamento quanto o acompanhamento da execução dos testes.

-  **Referências Técnicas e Materiais de Apoio**  
  Foram utilizadas fontes teóricas sobre testes de software, incluindo conceitos, tipos de testes, boas práticas e modelos de planos de teste. Essas referências serviram de base para a definição dos casos de teste e para a estruturação do plano, garantindo alinhamento com os princípios da Engenharia de Software.

O uso dessas ferramentas contribui para a organização, clareza e qualidade do processo de testes do sistema, garantindo que as funcionalidades sejam validadas de acordo com os requisitos definidos no projeto.