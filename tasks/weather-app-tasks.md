# Weather App — Backlog de Tarefas

Fonte: [plano técnico](../plans/weather-app-plan.md), derivado da [especificação](../specs/weather-app-spec.md).

As tarefas estão organizadas por entrega e em ordem de dependência. Tipos: `UI`, `Data`, `Test` e `Infra`.

## Entrega 1 — Contratos e funções de domínio

### T-01 — Definir contratos compartilhados
- **Tipo:** Data
- **Descrição:** Definir os tipos `Unit`, `City`, `WeatherCondition`, `CurrentWeather`, `ForecastDay`, `WeatherData`, `SearchState` e `WeatherState`.
- **Critérios de aceite:** Compila em TypeScript strict; país, clima atual e previsão são opcionais conforme o plano; previsão presente tem cinco dias completos.
- **Dependências:** nenhuma.
- **Arquivos prováveis:** `src/types/weather.ts`.
- **Rastreabilidade:** FR-01–FR-07; RNF4, RNF8.

### T-02 — Implementar conversão e arredondamento C/F
- **Tipo:** Data
- **Descrição:** Criar funções puras de conversão Celsius/Fahrenheit e arredondamento para inteiro mais próximo.
- **Critérios de aceite:** 0°C = 32°F, 100°C = 212°F e -40°C = -40°F; conversão não altera valores Celsius de origem.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/lib/temperature.ts`.
- **Rastreabilidade:** FR-05; RNF8; AC-FR05-01 a AC-FR05-03.

### T-03 — Testar conversão e arredondamento
- **Tipo:** Test
- **Descrição:** Cobrir a função de conversão com valores de fronteira e decimais.
- **Critérios de aceite:** Testa os exemplos de T-02, negativos, arredondamento e alternância repetida sem acúmulo de erro.
- **Dependências:** T-02.
- **Arquivos prováveis:** `tests/unit/temperature.test.ts`.
- **Rastreabilidade:** FR-05; AC-FR05-01 a AC-FR05-03.

### T-04 — Implementar mapeamento de códigos WMO
- **Tipo:** Data
- **Descrição:** Mapear códigos WMO para descrições em pt-BR e fallback neutro.
- **Critérios de aceite:** Códigos suportados têm descrição; código desconhecido não gera exceção nem condição inventada.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/lib/weatherCodes.ts`.
- **Rastreabilidade:** FR-03, FR-04; edge case de condição desconhecida.

### T-05 — Implementar formatação de datas e horários
- **Tipo:** Data
- **Descrição:** Criar funções puras para formatar datas e timestamps no timezone da cidade.
- **Critérios de aceite:** Datas preservam o dia local e a ordem cronológica; timestamp usa o timezone informado; timestamp ausente não é inventado.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/lib/format.ts`.
- **Rastreabilidade:** FR-03, FR-04; RNF8; AC-FR03-02, AC-FR04-01.

### T-06 — Testar mapeamento WMO e formatação
- **Tipo:** Test
- **Descrição:** Testar códigos meteorológicos e formatação temporal em timezone distinto do ambiente.
- **Critérios de aceite:** Inclui código conhecido/desconhecido e datas determinísticas para timezone diferente do local.
- **Dependências:** T-04, T-05.
- **Arquivos prováveis:** `tests/unit/weatherCodes.test.ts`, `tests/unit/format.test.ts`.
- **Rastreabilidade:** FR-03, FR-04; RNF8.

## Entrega 2 — Integração com Open-Meteo

### T-07 — Implementar service de geocoding
- **Tipo:** Data
- **Descrição:** Consultar a API de geocoding e normalizar até 10 resultados em `City`.
- **Critérios de aceite:** Envia `name`, `count=10` e `language=pt`; ausência de resultados retorna lista vazia; preserva acentos/espaços internos; aceita `AbortSignal`; aplica timeout de 10s.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/services/geocodingService.ts`.
- **Rastreabilidade:** FR-01, FR-02; RNF4, RNF5.

### T-08 — Testar service de geocoding
- **Tipo:** Test
- **Descrição:** Testar URL, parâmetros, payload e erros com `fetch` mockado.
- **Critérios de aceite:** Cobre sucesso, sem resultados, campos opcionais, HTTP, rede, JSON inválido, timeout e cancelamento; não chama a API real.
- **Dependências:** T-07.
- **Arquivos prováveis:** `tests/unit/geocodingService.test.ts`.
- **Rastreabilidade:** FR-01, FR-02; RNF4, RNF5.

### T-09 — Implementar service de forecast
- **Tipo:** Data
- **Descrição:** Consultar forecast em Celsius e normalizar clima atual e previsão para `WeatherData`.
- **Critérios de aceite:** Envia latitude, longitude, `current`, `daily`, `timezone=auto`, `forecast_days=5` e `temperature_unit=celsius`; valida current e daily independentemente; preserva seção válida se outra faltar; retorna erro se nenhuma seção for utilizável; aceita cancelamento e timeout de 10s.
- **Dependências:** T-01, T-04, T-05.
- **Arquivos prováveis:** `src/services/weatherService.ts`.
- **Rastreabilidade:** FR-02–FR-07; RNF4, RNF5, RNF8.

### T-10 — Testar service de forecast
- **Tipo:** Test
- **Descrição:** Testar parâmetros, normalização, dados parciais e classificação de erros com `fetch` mockado.
- **Critérios de aceite:** Cobre cinco dias, current ausente, forecast incompleto, nenhuma seção válida, HTTP 429, erro HTTP, rede, timeout, JSON inválido e cancelamento; não chama a API real.
- **Dependências:** T-09.
- **Arquivos prováveis:** `tests/unit/weatherService.test.ts`.
- **Rastreabilidade:** FR-03, FR-04, FR-06, FR-07; RNF4.

## Entrega 3 — Estado e orquestração

### T-11 — Implementar hook `useWeather`
- **Tipo:** Data
- **Descrição:** Orquestrar busca, seleção, forecast, unidade, estados assíncronos e retry.
- **Critérios de aceite:** Expõe operações do `WeatherViewModel`; mantém estados separados de busca e clima; cobre `idle/loading/success/empty/error`; cancela operações substituídas; mantém cidade no retry; resposta parcial é sucesso se ao menos uma seção for válida; trocar unidade não chama services.
- **Dependências:** T-01, T-07, T-09.
- **Arquivos prováveis:** `src/hooks/useWeather.ts`.
- **Rastreabilidade:** FR-01, FR-02, FR-05–FR-07; RNF4, RNF8.

### T-12 — Testar estados, retry e concorrência do hook
- **Tipo:** Test
- **Descrição:** Testar o hook com services falsos.
- **Critérios de aceite:** Cobre estados, os dois formatos de resposta parcial, cancelamento de resultado obsoleto, retry com sucesso/falha e unidade sem novo request.
- **Dependências:** T-11.
- **Arquivos prováveis:** `tests/unit/useWeather.test.ts`.
- **Rastreabilidade:** FR-01, FR-02, FR-05–FR-07; RNF4, RNF8.

## Entrega 4 — Interface responsiva

### T-13 — Preparar base visual responsiva
- **Tipo:** UI
- **Descrição:** Configurar base da tela mobile-first com Tailwind e tema dark glassmorphism.
- **Critérios de aceite:** Jornada utilizável a 320px e desktop sem sobreposição ou rolagem horizontal; foco visível; cores atendem ao contraste definido no plano.
- **Dependências:** nenhuma.
- **Arquivos prováveis:** `src/styles/index.css`, `src/App.tsx`.
- **Rastreabilidade:** RNF2, RNF3; US-05.

### T-14 — Criar barra de busca acessível
- **Tipo:** UI
- **Descrição:** Criar input de cidade, submissão explícita e validação local.
- **Critérios de aceite:** Possui label/role acessível e operação por teclado; input vazio ou menor que 2 caracteres não chama busca; acentos e espaços internos são preservados.
- **Dependências:** T-13.
- **Arquivos prováveis:** `src/components/SearchBar.tsx`.
- **Rastreabilidade:** FR-01, FR-06; RNF1, RNF3, RNF7.

### T-15 — Testar barra de busca
- **Tipo:** Test
- **Descrição:** Testar submissão, validação e acessibilidade do campo de busca.
- **Critérios de aceite:** Cobre busca válida, vazia, curta e com acentos; inválida não dispara callback; usa queries por role/label.
- **Dependências:** T-14.
- **Arquivos prováveis:** `tests/unit/SearchBar.test.tsx`.
- **Rastreabilidade:** FR-01; RNF3.

### T-16 — Criar resultados e seleção de cidade
- **Tipo:** UI
- **Descrição:** Exibir resultados distinguíveis e emitir a cidade selecionada.
- **Critérios de aceite:** Exibe nome e contexto de localização disponível; não inventa país/região; seleção por teclado retorna o `City` correto.
- **Dependências:** T-01, T-13.
- **Arquivos prováveis:** `src/components/CityResults.tsx`.
- **Rastreabilidade:** FR-02; RNF3, RNF7.

### T-17 — Criar componentes de estado
- **Tipo:** UI
- **Descrição:** Criar apresentações para estado inicial, loading, vazio e erro, incluindo retry quando aplicável.
- **Critérios de aceite:** Loading é anunciado; vazio não é tratado como erro técnico; erro tem mensagem clara e ação de retry; controles são acessíveis.
- **Dependências:** T-13.
- **Arquivos prováveis:** `src/components/states/LoadingState.tsx`, `EmptyState.tsx`, `ErrorState.tsx`.
- **Rastreabilidade:** FR-06, FR-07; RNF3, RNF4, RNF6.

### T-18 — Criar exibição do clima atual
- **Tipo:** UI
- **Descrição:** Exibir cidade, temperatura, unidade, condição e referência temporal disponíveis.
- **Critérios de aceite:** Não inventa campos ausentes; horário usa timezone da cidade; temperatura é derivada da unidade e arredondada conforme o plano.
- **Dependências:** T-01, T-02, T-04, T-05, T-13.
- **Arquivos prováveis:** `src/components/CurrentWeather.tsx`.
- **Rastreabilidade:** FR-03, FR-05; RNF3, RNF8.

### T-19 — Criar exibição da previsão diária
- **Tipo:** UI
- **Descrição:** Criar lista e cards para a previsão dos cinco dias.
- **Critérios de aceite:** Exibe cinco dias completos em ordem cronológica/timezone da cidade; cards têm dia, condição, mínima, máxima e unidade; forecast incompleto não é apresentado como completo.
- **Dependências:** T-01, T-02, T-04, T-05, T-13.
- **Arquivos prováveis:** `src/components/ForecastList.tsx`, `src/components/ForecastCard.tsx`.
- **Rastreabilidade:** FR-04, FR-05; RNF2, RNF3, RNF8.

### T-20 — Criar alternância Celsius/Fahrenheit
- **Tipo:** UI
- **Descrição:** Criar controle acessível para alternar unidade de apresentação.
- **Critérios de aceite:** Celsius é inicial; unidade ativa é visível e acessível; valores atuais e da previsão mudam sem request.
- **Dependências:** T-01, T-02, T-13.
- **Arquivos prováveis:** `src/components/UnitToggle.tsx`.
- **Rastreabilidade:** FR-05; RNF3, RNF8.

### T-21 — Compor a jornada na aplicação
- **Tipo:** UI
- **Descrição:** Conectar hook e componentes no fluxo buscar → selecionar → consultar.
- **Critérios de aceite:** Estados são apresentados no contexto correto; resposta parcial exibe seção válida e avisa a indisponível; resposta antiga não sobrescreve busca atual; mantém uma cidade em foco.
- **Dependências:** T-11, T-14, T-16, T-17, T-18, T-19, T-20.
- **Arquivos prováveis:** `src/App.tsx`.
- **Rastreabilidade:** FR-01–FR-07; RNF1–RNF8.

## Entrega 5 — Testes de integração e qualidade

### T-22 — Testar componentes e estados da interface
- **Tipo:** Test
- **Descrição:** Criar testes Testing Library para resultados, dados, unidade, estados e acessibilidade.
- **Critérios de aceite:** Cobre loading/empty/error/success, cidade homônima, timestamp ausente, resposta parcial, cinco dias e troca de unidade sem rede; verifica teclado e foco usando roles/labels.
- **Dependências:** T-15 a T-21.
- **Arquivos prováveis:** `tests/unit/CityResults.test.tsx`, `CurrentWeather.test.tsx`, `ForecastList.test.tsx`, `UnitToggle.test.tsx` e testes dos componentes de estado.
- **Rastreabilidade:** FR-01–FR-07; RNF2, RNF3, RNF6, RNF8.

### T-23 — Implementar testes E2E principais
- **Tipo:** Test
- **Descrição:** Testar jornadas completas no browser usando interceptação Playwright.
- **Critérios de aceite:** Cobre busca, seleção, clima, previsão, vazio, homônimos, alternância sem novo forecast, erro e retry; não acessa API real.
- **Dependências:** T-21.
- **Arquivos prováveis:** `tests/e2e/weather.spec.ts`.
- **Rastreabilidade:** FR-01–FR-07; US-01–US-06.

### T-24 — Verificar responsividade, acessibilidade e performance
- **Tipo:** Test
- **Descrição:** Verificar viewport mínimo, teclado, contraste e limites de desempenho.
- **Critérios de aceite:** Jornada não sobrepõe a 320px nem desktop; navegação por teclado e foco funcionam; contraste é 4.5:1 para texto normal e 3:1 para texto grande/componentes; carga inicial fica abaixo de 2s em cache frio, dispositivo móvel intermediário e 4G simulada; feedback da busca ocorre em até 100ms.
- **Dependências:** T-21, T-23.
- **Arquivos prováveis:** `tests/e2e/weather.spec.ts`, fixtures/configuração Playwright se necessário.
- **Rastreabilidade:** RNF1, RNF2, RNF3; US-05.

### T-25 — Executar quality gates
- **Tipo:** Infra
- **Descrição:** Executar verificações finais do repositório após integração.
- **Critérios de aceite:** `pnpm lint`, `pnpm build` e `pnpm test` passam; E2E passa quando browsers Playwright estiverem disponíveis.
- **Dependências:** T-03, T-06, T-08, T-10, T-12, T-22, T-23, T-24.
- **Arquivos prováveis:** Nenhum; configurações existentes somente se um gate exigir ajuste.
- **Rastreabilidade:** Requisitos funcionais e não funcionais do backlog.

## Rastreabilidade — Requisitos funcionais

| Requisito | Tarefas |
| --- | --- |
| FR-01 — Buscar cidades | T-07, T-08, T-11, T-14, T-15, T-17, T-21, T-22, T-23 |
| FR-02 — Selecionar cidade | T-07, T-08, T-09, T-11, T-16, T-21, T-22, T-23 |
| FR-03 — Exibir clima atual | T-05, T-09, T-10, T-18, T-21, T-22, T-23 |
| FR-04 — Exibir previsão | T-05, T-09, T-10, T-19, T-21, T-22, T-23 |
| FR-05 — Alternar unidade | T-02, T-03, T-11, T-18, T-19, T-20, T-22, T-23 |
| FR-06 — Comunicar estados | T-07, T-08, T-09, T-10, T-11, T-12, T-17, T-21, T-22, T-23 |
| FR-07 — Tentar novamente | T-09, T-10, T-11, T-12, T-17, T-21, T-22, T-23 |