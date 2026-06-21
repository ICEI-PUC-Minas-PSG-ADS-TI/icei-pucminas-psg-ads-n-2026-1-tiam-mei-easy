---
name: Backlog Débito Técnico
overview: Inventário dos principais débitos técnicos do MEI Easy, organizados por prioridade, para serem corrigidos em sprints futuras após consenso da equipe.
todos:
  - id: todo-01-auth
    content: "Implementar RF-001: telas login/cadastro, AuthContext e rotas protegidas"
    status: pending
  - id: todo-02-usuario-id
    content: Remover usuario_teste das 7 telas; usar uid do auth em todos os services
    status: pending
  - id: todo-03-nome-home
    content: Substituir userName hardcoded Gustavo na HomePage por dados do usuário autenticado
    status: pending
  - id: todo-04-firestore-rules
    content: Criar firestore.rules com isolamento por request.auth.uid e versionar no repo
    status: pending
  - id: todo-05-env-seguranca
    content: Proteger .env (gitignore na raiz, mover para src/app, validar config na inicialização)
    status: pending
  - id: todo-06-relatorios-rota
    content: Corrigir navegação quebrada para Relatórios ou implementar RF-009
    status: pending
  - id: todo-07-escopo-dados
    content: Adicionar usuarioId em clientes e estoque; alinhar com auth
    status: pending
  - id: todo-08-codigo-morto
    content: Remover ou implementar NovoClienteScreen.js vazio
    status: pending
  - id: todo-09-deep-linking
    content: Completar linkingScreens no AppNavigator (Clientes, Estoque, Dashboard)
    status: pending
  - id: todo-10-rfs-parciais
    content: Fechar gaps dos RFs parciais (filtro categoria, perfil, metas, RF-013 status, etc.)
    status: pending
  - id: todo-11-refatorar-duplicacao
    content: Extrair constants/theme.js e utils/formatacao.js; centralizar db Firestore
    status: pending
  - id: todo-12-ux-consistencia
    content: Unificar headers, botão voltar e ConfirmModal cross-platform
    status: pending
  - id: todo-13-queries-performance
    content: Otimizar getMovimentacoes com filtros Firestore e índices compostos
    status: pending
  - id: todo-14-erros-validacao
    content: Padronizar tratamento de erros e validação de formulários
    status: pending
  - id: todo-15-limpeza-docs
    content: Corrigir README, naming de arquivos e alinhar atribuição de RFs na documentação
    status: pending
isProject: false
---

# Backlog de débito técnico — MEI Easy

Levantamento do código em [`src/app`](src/app) e documentação. Itens agrupados por **severidade**; cada um vira um card de trabalho futuro.

```mermaid
flowchart TD
  subgraph critico [Critico - bloqueia producao]
    Auth[RF-001 Auth ausente]
    UserId[usuario_teste hardcoded]
    Rules[Sem Firestore Rules]
    Env[.env na raiz sem gitignore]
  end
  subgraph alto [Alto - funcionalidade quebrada ou incompleta]
    Relatorios[Rota Relatorios inexistente]
    Escopo[Clientes/Estoque sem usuarioId]
    RFsParciais[RFs parciais vs spec]
  end
  subgraph medio [Medio - consistencia e manutencao]
    UX[Alertas web vs native]
    Duplicacao[Constantes e helpers duplicados]
    Tema[ThemeContext subutilizado]
  end
  Auth --> UserId
  UserId --> Rules
  Rules --> Escopo
```

---

## 1. Crítico — segurança e autenticação

### TODO-01: Implementar RF-001 (login/cadastro)
- **Problema:** Não há telas de auth, contexto de sessão nem rotas protegidas. [`App.js`](src/app/App.js) só monta `ThemeProvider` + `AppNavigator`.
- **Evidência:** `getAuth` exportado em [`firebase.js`](src/app/config/firebase.js) mas nunca usado para `signIn`/`signOut`.
- **Impacto:** RNF-004 (segurança) e pré-requisito de todos os RFs conforme [`docs/07-Programação de Funcionalidades.md`](docs/07-Programação de Funcionalidades.md).

### TODO-02: Eliminar `usuario_teste` hardcoded
- **Problema:** `USUARIO_ID = 'usuario_teste'` duplicado em **7 telas**; comentário explícito de débito em [`NovaMovimentacaoScreen.js`](src/app/screens/movimentacoes/NovaMovimentacaoScreen.js) (linhas 8–9).
- **Arquivos afetados:**
  - [`ListaMovimentacoesScreen.js`](src/app/screens/movimentacoes/ListaMovimentacoesScreen.js)
  - [`NovaMovimentacaoScreen.js`](src/app/screens/movimentacoes/NovaMovimentacaoScreen.js)
  - [`ListaCategoriasScreen.js`](src/app/screens/categorias/ListaCategoriasScreen.js)
  - [`FormularioCategoriaScreen.js`](src/app/screens/categorias/FormularioCategoriaScreen.js)
  - [`ListaContasScreen.js`](src/app/screens/contas/ListaContasScreen.js)
  - [`FormularioContaScreen.js`](src/app/screens/contas/FormularioContaScreen.js)
  - [`DashboardScreen.js`](src/app/screens/dashboard/DashboardScreen.js)
- **Ação futura:** Criar `AuthContext` (ou hook `useAuth`) e usar `auth.currentUser.uid` em todos os services.

### TODO-03: Nome hardcoded na Home
- **Problema:** [`HomePage.js`](src/app/screens/screensMisc/HomePage.js) exibe `const userName = "Gustavo"` — dado fictício, não vem do perfil/auth.
- **Ação futura:** Substituir por nome do usuário autenticado (RF-004) após TODO-01.

### TODO-04: Firestore Security Rules
- **Problema:** Nenhum arquivo `firestore.rules` no repositório; docs exigem isolamento por `request.auth.uid`.
- **Risco:** Com regras permissivas no Console, todos os usuários veem dados de todos.

### TODO-05: Credenciais Firebase expostas
- **Problema:** [`.env`](.env) na **raiz** do repo; só [`src/app/.gitignore`](src/app/.gitignore) ignora `.env` — **não há `.gitignore` na raiz**.
- **Detalhe:** [`isFirebaseConfigValid()`](src/app/config/firebaseConfig.js) existe mas nunca é chamada na inicialização.
- **Ação futura:** Mover `.env` para `src/app/`, adicionar `.gitignore` na raiz, documentar rotação de chaves se já commitadas.

---

## 2. Alto — rotas quebradas e escopo de dados

### TODO-06: Rota "Relatórios" inexistente
- **Problema:** [`HomePage.js`](src/app/screens/screensMisc/HomePage.js) navega para `"Relatórios"`, mas [`AppNavigator.js`](src/app/navigation/AppNavigator.js) não registra essa screen → erro em runtime.
- **Relacionado:** RF-009 (MÉDIA) ainda não implementado.

### TODO-07: Clientes e estoque sem isolamento por usuário
- **Problema:** [`ListaClientesScreen.js`](src/app/screens/clientes/ListaClientesScreen.js) consulta coleção `clientes` inteira, sem `usuarioId`.
- **Problema:** [`addEstoque.js`](src/app/services/estoque/addEstoque.js) tem `userId` comentado; estoque é global.
- **Impacto:** Mesmo após auth, dados de clientes/estoque continuariam compartilhados.

### TODO-08: Arquivo morto `NovoClienteScreen.js`
- **Problema:** [`NovoClienteScreen.js`](src/app/screens/clientes/NovoClienteScreen.js) está **vazio** e não registrado; CRUD de clientes está todo inline em `ListaClientesScreen`.

### TODO-09: Deep linking incompleto (web)
- **Problema:** [`AppNavigator.js`](src/app/navigation/AppNavigator.js) — `linkingScreens` não inclui `Clientes`, `Estoque`, `Dashboard`; URLs web quebram para essas rotas.

### TODO-10: RFs parciais vs especificação
| RF | Estado | Débito |
|----|--------|--------|
| RF-002 | Parcial | Sem filtro por **categoria** na lista de movimentações |
| RF-004 | Ausente | Sem tela de perfil |
| RF-005 | Parcial | Toggle de tema só na Home; telas de feature ignoram `ThemeContext` |
| RF-006 | Ausente | Metas financeiras |
| RF-007 | Parcial | Clientes sem `usuarioId` e sem vínculo `clienteId` em receitas |
| RF-009 | Ausente | Relatórios (ver TODO-06) |
| RF-010 | Ausente | Recorrências |
| RF-011 | Ausente | Notificações/alertas MEI |
| RF-013 | Parcial | Status `pendente`/`pago` no código vs `aberto`/`cancelado` na spec |

Referência: [`docs/02-Especificação do Projeto.md`](docs/02-Especificação do Projeto.md)

---

## 3. Médio — consistência de código e UX

### TODO-11: Duplicação de constantes e helpers
- Paleta (`AZUL_ESCURO`, `#4fc3f7`, etc.) redefinida em cada screen.
- `formatarMoeda` / `extrairNumero` copiados em [`NovaMovimentacaoScreen.js`](src/app/screens/movimentacoes/NovaMovimentacaoScreen.js), [`FormularioContaScreen.js`](src/app/screens/contas/FormularioContaScreen.js) e [`dashboardService.js`](src/app/services/dashboardService.js).
- **Ação futura:** Extrair `constants/theme.js` e `utils/formatacao.js`.

### TODO-12: Headers e navegação inconsistentes
- Home/Estoque usam [`header.js`](src/app/components/header.js); demais telas têm header inline customizado.
- [`ListaClientesScreen.js`](src/app/screens/clientes/ListaClientesScreen.js) não tem botão voltar como as outras features.

### TODO-13: Confirmações de exclusão ad hoc
- Web: `window.confirm` em movimentações e contas.
- Native: `Alert.alert`.
- [`ConfirmModal.js`](src/app/components/ConfirmModal.js) existe mas só estoque usa — categorias podem falhar silenciosamente no web.

### TODO-14: Inicialização Firestore fragmentada
- Estoque usa `db` de [`firebase.js`](src/app/config/firebase.js).
- Movimentações/categorias/contas chamam `getFirestore(app)` localmente em cada service.
- **Ação futura:** Centralizar instância `db` exportada.

### TODO-15: Queries ineficientes
- [`getMovimentacoes`](src/app/services/movimentacoesService.js) busca **todos** os docs do usuário e filtra datas no cliente — não escala; sem índices compostos Firestore.

### TODO-16: Tratamento de erro inconsistente
- Estoque: `console.log` apenas.
- Clientes: `alert()` + `console.log`.
- Outras telas: `Alert.alert` — padrão único ausente.

### TODO-17: Naming e arquivos soltos
- `HomePage.js` exporta `HomeScreen`; `estoqueScreen.js` exporta `App`.
- Comentário de debug em [`App.js`](src/app/App.js): *"ESTA LINHA ESTAVA FALTANDO"*.
- [`FlatList` dentro de `ScrollView`](src/app/screens/clientes/ListaClientesScreen.js) — risco de performance.
- README em [`src/README.md`](src/README.md) referencia pasta `/utils` inexistente e path `cd ./app` incorreto (correto: `src/app`).

---

## 4. Baixo — melhorias futuras (não bloqueiam entrega acadêmica)

### TODO-18: TypeScript
- Projeto 100% `.js`; docs mencionam `.tsx` para dashboard — sem type safety.

### TODO-19: Validação de formulários
- Sem validação de CPF/CNPJ, e-mail ou formato de data em clientes/movimentações.

### TODO-20: Alinhar distribuição de RFs na documentação
- [`docs/02-Especificação do Projeto.md`](docs/02-Especificação do Projeto.md) lista RF-008 como Danilo e RF-009 como Gustavo, mas resumo da equipe inverte Dashboard/Relatórios — revisar atribuições para evitar confusão.

---

## Ordem sugerida de execução (quando sair do plan mode)

1. **TODO-05** — Proteger `.env` (rápido, alto impacto)
2. **TODO-01 + TODO-02 + TODO-04** — Auth + substituir `usuario_teste` + Rules (núcleo de segurança)
3. **TODO-03** — Nome real na Home (depende de auth/perfil)
4. **TODO-06 + TODO-10 (RF-009)** — Corrigir rota ou implementar Relatórios
5. **TODO-07 + TODO-08** — Escopo clientes/estoque + limpar arquivo morto
6. **TODO-11 a TODO-17** — Refatoração incremental (pode ser paralelizada entre membros)
7. **TODO-18 a TODO-20** — Backlog de qualidade / docs

**Estimativa:** TODOs 1–5 são pré-requisito para qualquer uso multi-usuário real; TODOs 6–17 podem ser divididos por módulo (movimentações, contas, estoque, etc.) conforme divisão atual da equipe.
