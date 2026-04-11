# Programação de Funcionalidades

Este documento relaciona os **requisitos funcionais e não funcionais** da solução MEI Easy à **implementação prevista** em **React Native** (aplicação móvel), com **backend e persistência em Firebase** (Authentication + Cloud Firestore). Para cada requisito, indicam-se os **módulos de interface**, as **operações e estruturas de dados** no Firestore e os **passos de verificação** para comprovar o funcionamento.

> **Observação:** Os caminhos de arquivos de código (`src/...`) são **convencionais**; a equipe deve atualizá-los para refletir a estrutura real do repositório após o bootstrap do projeto.

> **Links úteis**
>
> - [Documentação Firebase](https://firebase.google.com/docs)
> - [Cloud Firestore](https://firebase.google.com/docs/firestore)
> - [Security Rules – Firestore](https://firebase.google.com/docs/firestore/security/get-started)
> - [Firebase Authentication](https://firebase.google.com/docs/auth)
> - [React Native](https://reactnative.dev/docs/getting-started)
> - [Expo](https://docs.expo.dev/) (opcional, se adotado para desenvolvimento e build)

---

## 1. Visão geral da implementação

O usuário (MEI) interage com o aplicativo React Native. O app utiliza o SDK do Firebase para **autenticar** o usuário e **ler/gravar** movimentações financeiras no **Cloud Firestore**. Regras de segurança garantem que cada usuário acesse apenas os seus próprios dados.

![fluxo-usuario](img/07-fluxo-usuario.png)

---

## 2. Modelo de dados (Cloud Firestore)

Persistência em **coleções de documentos**. Proposta alinhada aos RFs; nomes de campos podem ser ajustados no código mantendo o mesmo significado.

### 2.1 Coleção `movimentacoes`

Documento por lançamento (receita ou despesa).

| Campo | Tipo (lógico) | Obrigatório | Descrição |
|-------|---------------|-------------|-----------|
| `userId` | string | sim | Igual a `request.auth.uid` (vínculo ao dono do dado) |
| `tipo` | string | sim | `receita` ou `despesa` |
| `valor` | number | sim | Valor positivo (ex.: 100.5) |
| `data` | timestamp ou string ISO | sim | Data da movimentação (para filtros e resumo) |
| `descricao` | string | não | Detalhe do lançamento |
| `categoria` | string | não | Nome ou id lógico da categoria (**RF-005**) |
| `criadoEm` | timestamp | sim | Auditoria simples |
| `atualizadoEm` | timestamp | sim | Atualizado em toda edição (**RF-003**) |

**Identificador do documento:** ID auto gerado pelo Firestore (`addDoc`) ou UUID escolhido pela equipe.

**Consultas típicas:** filtrar por `userId` e intervalo de `data` (**RF-008**, **RF-009**); agregar receitas/despesas em memória ou por query composta para **resumo** (**RF-006**, **RF-007**).

### 2.2 Coleção `categorias` (opcional, recomendada para RF-005)

Documentos por categoria do usuário: `userId`, `nome`, `tipoAplicavel` (`receita` | `despesa` | `ambos`), `ordem`.

Alternativa mais simples: campo `categoria` como **texto livre** ou lista fixa no app, sem coleção separada.

### 2.3 Índices

Criar índice composto no Firestore quando necessário, por exemplo: `userId` **asc** + `data` **desc**, para listagem do histórico ordenada.

### 2.4 Segurança (regras – conceito)

Regras devem exigir `request.auth != null` e que `resource.data.userId == request.auth.uid` (leitura/atualização/exclusão) e que novos documentos gravem `userId` igual ao `uid` autenticado. Isso atende **RNF-004** (isolamento básico por usuário).

---

## 3. Tabela de rastreabilidade (RF / UC → app → Firebase → verificação)

| RF | Caso de uso (referência) | Módulo / tela (React Native) | Persistência / serviço Firebase | Verificação resumida |
|----|---------------------------|------------------------------|----------------------------------|----------------------|
| RF-001 | UC-01 Cadastrar receita | Tela **Nova receita**; fluxo a partir do menu principal | `addDoc` em `movimentacoes` com `tipo: receita` | Após salvar, documento aparece no Firestore (console) e na lista/resumo |
| RF-002 | UC-02 Cadastrar despesa | Tela **Nova despesa** | `addDoc` com `tipo: despesa` | Idem, total de despesas aumenta |
| RF-003 | UC-03 Editar registro | Tela **Editar movimentação** (mesmo formulário em modo edição) | `updateDoc` + `atualizadoEm` | Alterar valor/descrição e conferir persistência |
| RF-004 | UC-04 Excluir registro | Ação na lista ou detalhe (**Excluir** com confirmação) | `deleteDoc` | Registro some da lista e do banco |
| RF-005 | (Categorização nas HUs) | Seletor de **categoria** nos formulários; tela opcional **Categorias** | Leitura/escrita em `categorias` ou apenas campo `categoria` | Lançamentos exibem categoria; filtros opcionais |
| RF-006 | UC-05 Resumo (parte) | Tela **Resumo / Dashboard** | Queries por `userId` + período; somatório no app | Totais de receitas e despesas coerentes com lançamentos |
| RF-007 | UC-05 Resumo (parte) | Mesma tela **Resumo** | Cálculo: receitas − despesas no período | Lucro/prejuízo correto para dados de teste |
| RF-008 | HU período | Filtro de **período** (mês/semana/datas) no resumo e/ou histórico | `where` + `orderBy` em `data` (com índice) | Alterar período altera os totais exibidos |
| RF-009 | UC-06 Histórico | Tela **Histórico** (lista cronológica) | Query `movimentacoes` por usuário e período | Lista bate com os lançamentos cadastrados |
| RF-010 | UC-07 Relatórios | Tela **Relatórios** (gráfico simples ou tabela agregada por categoria/mês) | Reutiliza dados já carregados ou mesma query agregada no cliente | Visualização coerente com os dados de teste |

**Artefatos de código (convencionais – atualizar quando o repositório existir):**

| Área | Caminhos sugeridos |
|------|---------------------|
| Configuração Firebase | `src/services/firebase.ts` (ou raiz com `app.config` / arquivos nativos conforme template) |
| Auth | `src/contexts/AuthContext.tsx`, `src/screens/LoginScreen.tsx` |
| Movimentações | `src/screens/NovaReceitaScreen.tsx`, `NovaDespesaScreen.tsx`, `EditarMovimentacaoScreen.tsx`, `HistoricoScreen.tsx` |
| Resumo / relatórios | `src/screens/ResumoScreen.tsx`, `RelatoriosScreen.tsx` |
| Modelos / tipos | `src/types/movimentacao.ts` |

---

## 4. Detalhamento por requisito funcional

### RF-001 – Cadastrar receitas

- **UC:** UC-01. **Prioridade:** ALTA.
- **UI:** formulário com valor, data, descrição opcional, categoria opcional; validação: valor numérico > 0, data obrigatória.
- **Firebase:** `addDoc(collection(db, 'movimentacoes'), { userId, tipo: 'receita', ... })`.
- **Verificação:** cadastrar uma receita; conferir no **Firebase Console** > Firestore e na tela de histórico/resumo.

### RF-002 – Cadastrar despesas

- **UC:** UC-02. **Prioridade:** ALTA.
- **UI:** análogo à receita, com rótulos adequados e `tipo: despesa`.
- **Firebase:** mesmo padrão de `movimentacoes`.
- **Verificação:** cadastrar despesa; total de despesas e saldo refletem o lançamento.

### RF-003 – Editar registros

- **UC:** UC-03. **Prioridade:** ALTA.
- **UI:** reaproveitar formulário com dados carregados (`getDoc` ou passagem de item da lista); botão **Salvar**.
- **Firebase:** `updateDoc` no documento; atualizar `atualizadoEm`.
- **Verificação:** alterar valor de um lançamento existente; lista e resumo atualizados após refresh ou listener.

### RF-004 – Excluir registros

- **UC:** UC-04. **Prioridade:** ALTA.
- **UI:** exclusão com diálogo de confirmação.
- **Firebase:** `deleteDoc(doc(db, 'movimentacoes', id))` com checagem de `userId` nas rules.
- **Verificação:** excluir item e confirmar remoção no histórico e nos totais.

### RF-005 – Categorizar receitas e despesas

- **Prioridade:** MÉDIA.
- **UI:** `Picker` / lista de categorias no formulário; opcional CRUD de categorias.
- **Firebase:** campo `categoria` no documento ou subcoleção/coleção `categorias`.
- **Verificação:** lançamentos distintos com categorias diferentes aparecem corretamente no histórico e, se aplicável, no relatório por categoria.

### RF-006 – Resumo (totais de receitas e despesas)

- **UC:** UC-05 (parte). **Prioridade:** ALTA.
- **UI:** **Resumo** com totais do período selecionado (padrão: mês corrente).
- **Firebase:** query filtrada por `userId` e intervalo de `data`; somar `valor` por `tipo` no aplicativo.
- **Verificação:** somar manualmente 3 lançamentos de teste e comparar com a tela.

### RF-007 – Lucro ou prejuízo

- **UC:** UC-05 (parte). **Prioridade:** ALTA.
- **UI:** exibir resultado destacado (ex.: “Lucro: R$ …” ou “Prejuízo: R$ …”).
- **Firebase:** deriva dos mesmos dados do RF-006.
- **Verificação:** cenário só receitas, só despesas e misto.

### RF-008 – Movimentações por período

- **Prioridade:** MÉDIA.
- **UI:** seletor de intervalo ou presets (mês atual, mês anterior).
- **Firebase:** mesma coleção com `where('data', '>=', inicio)` e `where('data', '<=', fim)` (ajustar tipos timestamp/string de forma consistente).
- **Verificação:** lançamentos fora do intervalo não entram nos totais nem na lista filtrada.

### RF-009 – Histórico de movimentações

- **UC:** UC-06. **Prioridade:** MÉDIA.
- **UI:** lista rolável com tipo, valor, data, categoria; toque leva à edição.
- **Firebase:** query ordenada por `data` descendente.
- **Verificação:** ordem e contagem corretas após vários CRUDs.

### RF-010 – Relatórios simples

- **UC:** UC-07. **Prioridade:** BAIXA.
- **UI:** tela **Relatórios**: por exemplo barras ou pizza com **react-native-chart-kit** (ou tabela resumida por categoria/mês se gráfico for inviável no prazo).
- **Firebase:** agregação no cliente a partir dos mesmos documentos.
- **Verificação:** totais do relatório batem com o resumo para o mesmo período.

---

## 5. Requisitos não funcionais e evidências na implementação

| ID | Evidência / abordagem |
|----|------------------------|
| RNF-001 Interface simples | Telas com fluxo curto, labels claros, feedback de erro/sucesso; revisão com base no [Projeto de Interface](04-Projeto%20de%20Interface.md). |
| RNF-002 Responsivo / móvel | React Native em smartphones; testar em pelo menos um tamanho de tela pequeno e um médio. |
| RNF-003 Tempo de resposta | Operações locais de UI imediatas; chamadas Firestore assíncronas com indicador de carregamento; meta operacional ≤ 10 s em rede razoável. |
| RNF-004 Segurança básica | Firebase Auth + **Security Rules** restringindo dados por `uid`. |
| RNF-005 Persistência | Firestore como fonte de verdade; dados permanecem após fechar o app. |
| RNF-006 Navegador web | A especificação prevê **aplicação móvel** (restrição do projeto). O foco de entrega é **APK/IPA ou build de desenvolvimento**; versão web não é obrigatória para fechar o escopo acadêmico, salvo decisão explícita da equipe. |
| RNF-007 Disponibilidade | Uso em condições normais depende da disponibilidade do Firebase/Google Cloud; documentar dependência de conectividade para sincronização. |

---

## 6. Ambiente, build e verificação da implementação

### 6.1 Pré-requisitos de desenvolvimento

- Node.js (LTS recomendado), npm ou yarn.
- Android Studio (emulador Android) e/ou dispositivo físico com USB debugging; para iOS, macOS + Xcode se a equipe for publicar para iPhone.
- Conta Google e projeto criado no [Console Firebase](https://console.firebase.google.com/) com **Authentication** (ex.: e-mail/senha) e **Firestore** ativados.
- Arquivos de configuração do app conforme documentação do Firebase para React Native / Expo.

### 6.2 Execução local (exemplo com Expo)

Após o código estar no repositório, a equipe deve documentar aqui os comandos exatos. Modelo:

```bash
npm install
npx expo start
```

Abrir no emulador ou **Expo Go** no celular; fazer login e executar os cenários da seção 4.

### 6.3 Comprovação para entrega acadêmica

- **Repositório:** link do GitHub com README contendo os comandos de build/run.
- **Funcionalidade:** vídeo curto ou checklist assinado pelos testes manuais cobrindo RF-001 a RF-007 no mínimo; RF-008 a RF-010 conforme priorização do cronograma.
- **Dados:** prints do Firestore (coleção `movimentacoes`) e do app mostrando o mesmo conjunto de lançamentos.
- **“Hospedagem”:** não é obrigatória loja (Play/App Store); basta app executável em modo debug/release ou APK gerado, mais instruções de instalação no README.

---

## 7. Consistência com a arquitetura documentada

O arquivo [Arquitetura da Solução](05-Arquitetura%20da%20Solução.md) pode conter seções voltadas a modelo relacional/SQL. Para **este projeto**, a **persistência efetiva** descrita na programação de funcionalidades é o **Firestore** (modelo de documentos). Recomenda-se alinhar o documento de arquitetura em versão futura para evitar contradição (diagrama lógico de dados no Firestore ou referência cruzada a este artefato).

---

*Documento gerado para o projeto MEI Easy — 1º semestre letivo de 2026 — stack: React Native + Firebase (Auth + Firestore).*
