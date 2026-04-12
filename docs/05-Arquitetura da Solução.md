# Arquitetura da Solução

<img src="https://github.com/ICEI-PUC-Minas-PSG-ADS-TI/icei-pucminas-psg-ads-n-2026-1-tiam-mei-easy/blob/main/docs/modelos/Arq%20Solucao.drawio.png">

## Diagrama de Classes

<img src="https://github.com/ICEI-PUC-Minas-PSG-ADS-TI/icei-pucminas-psg-ads-n-2026-1-tiam-mei-easy/blob/main/docs/modelos/Classes.drawio.png.png">

## Modelo ER

<img src="https://github.com/ICEI-PUC-Minas-PSG-ADS-TI/icei-pucminas-psg-ads-n-2026-1-tiam-mei-easy/blob/main/docs/modelos/ER.drawio.png">

## Esquema Relacional

O banco de dados do projeto será desenvolvido no Firebase.

## Modelo Físico

Coleção: usuarios
| Chave    | Valor                              |
|----------|------------------------------------|
| id       | identificador único do usuário     |
| nome     | nome completo                      |
| email    | e-mail do usuário                  |
| senha    | senha criptografada                |
| telefone | número de contato                  |
| cnpj     | documento do usuário               |

<br>

Coleção: categorias
| Chave     | Valor                                              |
|-----------|----------------------------------------------------|
| id        | identificador da categoria                         |
| descricao | nome da categoria (ex: Alimentação, Transporte)    |
| tipo      | define se é receita ou despesa                     |
| usuarioId | identifica o usuário dono da categoria             |

<br>

Coleção: movimentacoes
| Chave     | Valor                                             |
|-----------|---------------------------------------------------|
| id        | identificador da movimentação                     |
| descricao | descrição da transação                            |
| valor     | valor monetário                                   |
| data      | data da movimentação                              |
| tipo      | receita ou despesa                                |
| usuarioId | referência ao usuário                             |
| categoria | objeto com id e descricao da categoria            |
| cliente   | objeto com cpfCnpj e nome do cliente (opcional)   |

<br>

Coleção: clientes
| Chave     | Valor                              |
|-----------|------------------------------------|
| cpfCnpj   | identificador do cliente           |
| nome      | nome do cliente                    |
| telefone  | contato                            |
| email     | e-mail                             |
| usuarioId | referência ao usuário              |

<br>

Coleção: contas
| Chave      | Valor                                  |
|------------|----------------------------------------|
| id         | identificador da conta                 |
| descricao  | descrição da conta                     |
| valor      | valor monetário                        |
| tipo       | pagar ou receber                       |
| vencimento | data de vencimento                     |
| status     | situação da conta (pendente, pago)     |
| usuarioId  | referência ao usuário                  |

<br>

Coleção: metas
| Chave      | Valor                          |
|------------|--------------------------------|
| id         | identificador da meta          |
| valorMeta  | valor desejado                 |
| valorAtual | valor já alcançado             |
| dataInicio | início da meta                 |
| dataFim    | término da meta                |
| usuarioId  | referência ao usuário          |

<br>

Coleção: produtos
| Chave      | Valor                          |
|------------|--------------------------------|
| id         | identificador do produto       |
| nome       | nome do produto                |
| quantidade | quantidade disponível          |
| usuarioId  | referência ao usuário          |

<br>

Coleção: notificacoes
| Chave     | Valor                                      |
|-----------|--------------------------------------------|
| id        | identificador da notificação               |
| mensagem  | conteúdo da notificação                    |
| data      | data de emissão                            |
| lida      | indica se foi visualizada                  |
| tipo      | tipo da notificação (alerta, aviso, etc.)  |
| usuarioId | referência ao usuário                      |




## Tecnologias Utilizadas

| Finalidade | Tecnologia Utilizada |
|----------|----------|
| Frontend  | React Native (EXPO) | 
| Backend  | Firebase  | 
| Comunicação  | WhatsApp e Discord  | 


## Hospedagem

A previsão de hospedagem será na plataforma Firebase.


## Qualidade de Software

A qualidade de software no sistema MEI Easy será fundamentada na norma ISO/IEC 25010, que define um conjunto de características e subcaracterísticas que orientam a avaliação da qualidade de produtos de software.
Considerando que o MEI Easy é um sistema voltado para o gerenciamento financeiro de microempreendedores individuais, a equipe selecionou subcaracterísticas que priorizam facilidade de uso, confiabilidade dos dados, segurança e desempenho, aspectos essenciais para esse tipo de aplicação.

1. Adequação Funcional (Functional Suitability)

Refere-se à capacidade do sistema de fornecer funcionalidades que atendam às necessidades dos usuários de forma correta e completa.

Justificativa:
O MEI Easy deve permitir que o usuário realize operações essenciais como cadastro de receitas, despesas, clientes, controle de estoque e visualização de relatórios financeiros. A correta implementação dessas funcionalidades é fundamental para o funcionamento do sistema.

Métricas:

Percentual de requisitos funcionais implementados
Número de falhas em funcionalidades durante testes
Taxa de sucesso na execução de operações (cadastro, edição e exclusão)
2. Usabilidade (Usability)

Refere-se à facilidade de uso do sistema, incluindo aprendizado, eficiência e satisfação do usuário.

Justificativa:
O público-alvo do MEI Easy são microempreendedores que, em muitos casos, não possuem conhecimento técnico. Portanto, a interface deve ser simples, intuitiva e de fácil navegação, permitindo que o usuário utilize o sistema sem dificuldades.

Métricas:

Tempo médio para realizar tarefas (ex: cadastrar uma despesa)
Número de erros cometidos pelo usuário durante o uso
Taxa de satisfação do usuário (feedback ou questionário)
Número de cliques necessários para executar ações principais
3. Confiabilidade (Reliability)

Refere-se à capacidade do sistema de operar corretamente e de forma consistente ao longo do tempo.

Justificativa:
O MEI Easy manipula dados financeiros importantes, como receitas e despesas. Dessa forma, é essencial que o sistema seja confiável, evitando falhas, inconsistências ou perda de dados.

Métricas:

Número de falhas registradas por período
Taxa de erros em operações críticas
Tempo médio entre falhas (MTBF)
Percentual de operações concluídas com sucesso
4. Eficiência de Desempenho (Performance Efficiency)

Refere-se ao tempo de resposta do sistema e ao uso adequado de recursos.

Justificativa:
Para garantir uma boa experiência ao usuário, o sistema deve apresentar respostas rápidas, especialmente no carregamento do dashboard e na consulta de dados financeiros.

Métricas:

Tempo médio de resposta das requisições
Tempo de carregamento das telas principais
Tempo de carregamento do dashboard
Quantidade de requisições necessárias por operação

5. Segurança (Security)

Refere-se à proteção das informações e ao controle de acesso ao sistema.

Justificativa:
O MEI Easy armazena dados sensíveis, como informações financeiras e dados pessoais dos usuários. Portanto, é essencial garantir que apenas usuários autorizados tenham acesso aos dados, além de proteger essas informações contra acessos indevidos.

Métricas:

Uso de autenticação segura (ex: autenticação via Firebase)
Número de tentativas de acesso não autorizado bloqueadas
Existência de criptografia de dados sensíveis
Controle de permissões de acesso

6. Manutenibilidade (Maintainability)

Refere-se à facilidade de manutenção, correção e evolução do sistema.

Justificativa:
O MEI Easy poderá evoluir com novas funcionalidades ao longo do tempo. Dessa forma, é importante que o código seja organizado, modular e de fácil entendimento, facilitando futuras manutenções.

Métricas:

Tempo médio para correção de erros
Facilidade de implementação de novas funcionalidades
Organização do código (separação por camadas)
Reutilização de componentes
