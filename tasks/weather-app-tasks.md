# Weather App — Backlog de Tarefas

Fonte: [plano técnico](../plans/weather-app-plan.md), derivado da [especificação](../specs/weather-app-spec.md).

As tarefas estão organizadas por entrega e em ordem de dependência. Os IDs foram preservados para manter a rastreabilidade; a ordem de execução é a ordem apresentada abaixo, não a ordem numérica dos IDs. Tipos: `UI`, `Data`, `Test` e `Infra`.

## Entrega 1 — Contratos e funções de domínio

### T-01 — Definir contratos compartilhados
- **Tipo:** Data
- **Descrição:** Definir os tipos `Unit`, `City`, `WeatherCondition`, `CurrentWeather`, `ForecastDay`, `WeatherData`, `SearchState` e `WeatherState`.
- **Critérios de aceite:** `pnpm build` compila os contratos com TypeScript strict; `City.country`, `WeatherData.current` e `WeatherData.forecast` aceitam ausência; quando presente, `forecast` aceita uma lista de cinco `ForecastDay`. (FR-01–FR-07, RNF4, RNF8)
- **Dependências:** nenhuma.
- **Arquivos prováveis:** `src/types/weather.ts`.
- **Rastreabilidade:** FR-01–FR-07; RNF4, RNF8.

### T-02 — Implementar conversão e arredondamento C/F
- **Tipo:** Data
- **Descrição:** Criar funções puras de conversão Celsius/Fahrenheit e arredondamento para inteiro mais próximo.
- **Critérios de aceite:** As funções retornam 32°F para 0°C, 212°F para 100°C e -40°F para -40°C; arredondam para o inteiro mais próximo; não mutam o valor de entrada em Celsius. (FR-05, AC-FR05-01 a AC-FR05-03)
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/lib/temperature.ts`.
- **Rastreabilidade:** FR-05; RNF8; AC-FR05-01 a AC-FR05-03.

### T-04 — Implementar mapeamento de códigos WMO
- **Tipo:** Data
- **Descrição:** Mapear códigos WMO para descrições em pt-BR e fallback neutro.
- **Critérios de aceite:** Todo código listado no mapeamento retorna código e label pt-BR não vazia; um código não mapeado retorna o fallback neutro definido e não lança exceção. (FR-03, FR-04; edge case de condição desconhecida)
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/lib/weatherCodes.ts`.
- **Rastreabilidade:** FR-03, FR-04; edge case de condição desconhecida.

### T-05 — Implementar formatação de datas e horários
- **Tipo:** Data
- **Descrição:** Criar funções puras para formatar datas e timestamps no timezone da cidade.
- **Critérios de aceite:** Para um timestamp e timezone fixados no teste, a saída corresponde à data/hora local esperada; uma lista de datas é formatada sem mudar sua ordem; entrada de timestamp ausente não gera texto de horário. (FR-03, FR-04; AC-FR03-02, AC-FR04-01, RNF8)
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/lib/format.ts`.
- **Rastreabilidade:** FR-03, FR-04; RNF8; AC-FR03-02, AC-FR04-01.

## Entrega 2 — Integração com Open-Meteo

### T-07 — Implementar service de geocoding
- **Tipo:** Data
- **Descrição:** Consultar a API de geocoding e normalizar até 10 resultados em `City`.
- **Critérios de aceite:** Request contém `name` com o texto de busca, `count=10` e `language=pt`; resposta sem `results` produz `[]`; normalização mantém acentos/espaços internos e campos opcionais; timeout ocorre em 10s e signal abortado cancela o request. (FR-01, FR-02; RNF4, RNF5; AC-FR01-01, AC-FR01-03)
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/services/geocodingService.ts`.
- **Rastreabilidade:** FR-01, FR-02; RNF4, RNF5.

### T-09 — Implementar service de forecast
- **Tipo:** Data
- **Descrição:** Consultar forecast em Celsius e normalizar clima atual e previsão para `WeatherData`.
- **Critérios de aceite:** Request envia coordenadas da cidade e `current`, `daily`, `timezone=auto`, `forecast_days=5`, `temperature_unit=celsius`; normaliza arrays diários de cinco posições; mantém `current` válido se `daily` for inválido e vice-versa; rejeita resultado sem nenhuma seção utilizável ou timezone; timeout é 10s e signal abortado cancela o request. (FR-02–FR-07; RNF4, RNF5, RNF8)
- **Dependências:** T-01, T-04, T-05.
- **Arquivos prováveis:** `src/services/weatherService.ts`.
- **Rastreabilidade:** FR-02–FR-07; RNF4, RNF5, RNF8.

## Entrega 3 — Estado e orquestração

### T-11 — Implementar hook `useWeather`
- **Tipo:** Data
- **Descrição:** Orquestrar busca, seleção, forecast, unidade, estados assíncronos e retry.
- **Critérios de aceite:** Retorna `search`, `weather`, `unit`, `selectUnit`, `searchCities`, `selectCity` e `retryWeather`; busca e forecast têm status independentes; só publica os cinco status definidos; uma seleção chama o service de forecast exatamente uma vez; retry reutiliza a cidade selecionada; resposta parcial com uma seção válida resulta em success e sem seção válida em error; `selectUnit` não chama service. (FR-01, FR-02, FR-05–FR-07; RNF4, RNF8)
- **Dependências:** T-01, T-07, T-09.
- **Arquivos prováveis:** `src/hooks/useWeather.ts`.
- **Rastreabilidade:** FR-01, FR-02, FR-05–FR-07; RNF4, RNF8.

## Entrega 4 — Interface responsiva

### T-13 — Preparar base visual responsiva
- **Tipo:** UI
- **Descrição:** Configurar base da tela mobile-first com Tailwind e tema dark glassmorphism.
- **Critérios de aceite:** Em 320px e em viewport desktop definidos nos testes, busca e conteúdo não se sobrepõem nem causam rolagem horizontal; controles têm foco visível; contraste mede pelo menos 4.5:1 para texto normal e 3:1 para texto grande/componentes. (RNF2, RNF3; US-05)
- **Dependências:** T-11.
- **Arquivos prováveis:** `src/styles/index.css`, `src/App.tsx`.
- **Rastreabilidade:** RNF2, RNF3; US-05.

### T-14 — Criar barra de busca acessível
- **Tipo:** UI
- **Descrição:** Criar input de cidade, submissão explícita e validação local.
- **Critérios de aceite:** O input tem label acessível e é alcançável/submetível por teclado; vazio, somente espaços ou menos de 2 caracteres não invocam busca; query válida preserva acentos e espaços internos. (FR-01, FR-06; AC-FR01-01, AC-FR01-02, AC-FR01-04; RNF3)
- **Dependências:** T-13.
- **Arquivos prováveis:** `src/components/SearchBar.tsx`.
- **Rastreabilidade:** FR-01, FR-06; RNF1, RNF3, RNF7.

### T-16 — Criar resultados e seleção de cidade
- **Tipo:** UI
- **Descrição:** Exibir resultados distinguíveis e emitir a cidade selecionada.
- **Critérios de aceite:** Cada resultado mostra nome e cada campo country/admin1 que estiver presente, sem placeholder apresentado como dado real; Enter/Space no resultado em foco emite exatamente o objeto `City` daquele item. (FR-02; AC-FR02-01, AC-FR02-02; RNF3)
- **Dependências:** T-01, T-13.
- **Arquivos prováveis:** `src/components/CityResults.tsx`.
- **Rastreabilidade:** FR-02; RNF3, RNF7.

### T-17 — Criar estado de carregamento
- **Tipo:** UI
- **Descrição:** Criar a apresentação de carregamento exibida durante busca e consulta meteorológica.
- **Critérios de aceite:** Renderiza indicador com role/status acessível; não renderiza mensagem de sucesso/erro; aceita o mesmo estado de carregamento tanto para geocoding quanto para forecast. (FR-01, FR-06; AC-FR06-01; RNF3)
- **Dependências:** T-13.
- **Arquivos prováveis:** `src/components/states/LoadingState.tsx`.
- **Rastreabilidade:** FR-01, FR-06; RNF3, RNF6.

### T-18 — Criar estado vazio
- **Tipo:** UI
- **Descrição:** Criar a apresentação para busca sem resultados e para a ausência inicial de dados.
- **Critérios de aceite:** Renderiza mensagem de nenhum resultado sem role/mensagem de erro técnico; o campo de busca continua habilitado e pode receber nova query. (FR-01, FR-06; AC-FR01-03, AC-FR06-03; RNF3)
- **Dependências:** T-13.
- **Arquivos prováveis:** `src/components/states/EmptyState.tsx`.
- **Rastreabilidade:** FR-01, FR-06; RNF3, RNF6.

### T-19 — Criar estado de erro com retry
- **Tipo:** UI
- **Descrição:** Criar a apresentação de erro recuperável, com mensagem clara e ação de tentar novamente.
- **Critérios de aceite:** Mensagem não contém stack trace nem URL; botão de retry possui nome acessível, recebe foco e invoca callback uma vez por ativação; componente pode renderizar mensagem de erro de busca ou forecast. (FR-06, FR-07; AC-FR06-02, AC-FR07-01; RNF3, RNF6)
- **Dependências:** T-13.
- **Arquivos prováveis:** `src/components/states/ErrorState.tsx`.
- **Rastreabilidade:** FR-06, FR-07; RNF3, RNF4, RNF6.

### T-20 — Criar exibição do clima atual
- **Tipo:** UI
- **Descrição:** Exibir cidade, temperatura, unidade, condição e referência temporal disponíveis.
- **Critérios de aceite:** Com payload sem timestamp não aparece horário; com timezone definido, horário exibido corresponde ao horário local esperado; temperaturas C/F correspondem à função de T-02, arredondadas ao inteiro. (FR-03, FR-05; AC-FR03-01, AC-FR03-02, AC-FR05-01, AC-FR05-03; RNF8)
- **Dependências:** T-01, T-02, T-04, T-05, T-13.
- **Arquivos prováveis:** `src/components/CurrentWeather.tsx`.
- **Rastreabilidade:** FR-03, FR-05; RNF3, RNF8.

### T-21 — Criar exibição da previsão diária
- **Tipo:** UI
- **Descrição:** Criar lista e cards para a previsão dos cinco dias.
- **Critérios de aceite:** Com cinco itens válidos, renderiza cinco cards na mesma ordem das datas; cada card contém data, condição, mínima, máxima e unidade; com menos de cinco dias, não apresenta a lista como previsão completa. (FR-04, FR-05; AC-FR04-01, AC-FR04-02, AC-FR05-01; RNF2, RNF8)
- **Dependências:** T-01, T-02, T-04, T-05, T-13.
- **Arquivos prováveis:** `src/components/ForecastList.tsx`, `src/components/ForecastCard.tsx`.
- **Rastreabilidade:** FR-04, FR-05; RNF2, RNF3, RNF8.

### T-22 — Criar alternância Celsius/Fahrenheit
- **Tipo:** UI
- **Descrição:** Criar controle acessível para alternar unidade de apresentação.
- **Critérios de aceite:** Renderiza Celsius como selecionado inicialmente; selecionar Fahrenheit/Celsius atualiza unidade e valores de current e forecast; controle tem nome acessível e nenhuma seleção chama service. (FR-05; AC-FR05-01, AC-FR05-02; RNF3, RNF8)
- **Dependências:** T-01, T-02, T-13.
- **Arquivos prováveis:** `src/components/UnitToggle.tsx`.
- **Rastreabilidade:** FR-05; RNF3, RNF8.

## Entrega 5 — Integração da interface

### T-23 — Compor a jornada na aplicação
- **Tipo:** UI
- **Descrição:** Conectar hook e componentes no fluxo buscar → selecionar → consultar.
- **Critérios de aceite:** Uma jornada de busca e seleção exibe dados da cidade selecionada; loading/empty/error/success usam suas apresentações correspondentes; resposta parcial exibe seção válida mais aviso; resposta abortada não substitui resultado atual; somente uma cidade é exibida por vez. (FR-01–FR-07; RNF1–RNF8)
- **Dependências:** T-11, T-14, T-16, T-17, T-18, T-19, T-20, T-21, T-22.
- **Arquivos prováveis:** `src/App.tsx`.
- **Rastreabilidade:** FR-01–FR-07; RNF1–RNF8.

## Entrega 6 — Testes

### T-03 — Testar conversão e arredondamento
- **Tipo:** Test
- **Descrição:** Cobrir a função de conversão com valores de fronteira e decimais.
- **Critérios de aceite:** Vitest contém asserts para 0°C, 100°C, -40°C, pelo menos um valor decimal positivo e um negativo; duas conversões para Fahrenheit a partir do mesmo valor Celsius produzem resultado idêntico. (FR-05, AC-FR05-01 a AC-FR05-03)
- **Dependências:** T-02.
- **Arquivos prováveis:** `tests/unit/temperature.test.ts`.
- **Rastreabilidade:** FR-05; AC-FR05-01 a AC-FR05-03.

### T-06 — Testar mapeamento WMO e formatação
- **Tipo:** Test
- **Descrição:** Testar códigos meteorológicos e formatação temporal em timezone distinto do ambiente.
- **Critérios de aceite:** Vitest verifica um código mapeado, um código desconhecido e ao menos um timestamp próximo à mudança de dia em timezone diferente do timezone do processo; os resultados esperados são literais e determinísticos. (FR-03, FR-04; AC-FR03-02, AC-FR04-01)
- **Dependências:** T-04, T-05.
- **Arquivos prováveis:** `tests/unit/weatherCodes.test.ts`, `tests/unit/format.test.ts`.
- **Rastreabilidade:** FR-03, FR-04; RNF8.

### T-08 — Testar service de geocoding
- **Tipo:** Test
- **Descrição:** Testar URL, parâmetros, payload e erros com `fetch` mockado.
- **Critérios de aceite:** Testes verificam URL/parâmetros, lista de resultados normalizada, ausência de `results`, país/região ausentes, respostas HTTP não-2xx, rejeição de rede, JSON inválido, timeout em 10s e cancelamento; todos usam `fetch` mockado. (FR-01, FR-02; RNF4, RNF5)
- **Dependências:** T-07.
- **Arquivos prováveis:** `tests/unit/geocodingService.test.ts`.
- **Rastreabilidade:** FR-01, FR-02; RNF4, RNF5.

### T-10 — Testar service de forecast
- **Tipo:** Test
- **Descrição:** Testar parâmetros, normalização, dados parciais e classificação de erros com `fetch` mockado.
- **Critérios de aceite:** Fixtures verificam os parâmetros exatos, mapeamento de cinco dias, preservação independente de current/forecast, erro sem seção válida, HTTP 429, outro HTTP não-2xx, rejeição de rede, timeout em 10s, JSON inválido e cancelamento; nenhum teste usa rede real. (FR-03, FR-04, FR-06, FR-07; RNF4)
- **Dependências:** T-09.
- **Arquivos prováveis:** `tests/unit/weatherService.test.ts`.
- **Rastreabilidade:** FR-03, FR-04, FR-06, FR-07; RNF4.

### T-12 — Testar estados, retry e concorrência do hook
- **Tipo:** Test
- **Descrição:** Testar o hook com services falsos.
- **Critérios de aceite:** Asserções verificam transições idle/loading/success/empty/error; current válido com forecast inválido e o inverso resultam em success parcial; sem seção válida resulta em error; resposta após abort não altera estado; retry chama forecast novamente para a mesma cidade; alterar unidade não chama service. (FR-01, FR-02, FR-05–FR-07; RNF4, RNF8)
- **Dependências:** T-11.
- **Arquivos prováveis:** `tests/unit/useWeather.test.ts`.
- **Rastreabilidade:** FR-01, FR-02, FR-05–FR-07; RNF4, RNF8.

### T-15 — Testar barra de busca
- **Tipo:** Test
- **Descrição:** Testar submissão, validação e acessibilidade do campo de busca.
- **Critérios de aceite:** Vitest confirma uma chamada com query válida/acento; zero chamadas para vazio, espaços e um caractere; campo é localizado por label/role e submetido por teclado. (FR-01; AC-FR01-01, AC-FR01-02, AC-FR01-04; RNF3)
- **Dependências:** T-14.
- **Arquivos prováveis:** `tests/unit/SearchBar.test.tsx`.
- **Rastreabilidade:** FR-01; RNF3.

### T-24 — Testar resultados e seleção de cidade
- **Tipo:** Test
- **Descrição:** Testar `CityResults`: exibição distinguível e seleção por teclado.
- **Critérios de aceite:** Testing Library verifica pelo menos dois resultados homônimos diferenciados por campos disponíveis; quando country/admin1 forem ausentes não exibe esses dados; ativar resultado em foco emite o objeto correspondente. (FR-02; AC-FR02-01, AC-FR02-02; RNF3, RNF7)
- **Dependências:** T-16.
- **Arquivos prováveis:** `tests/unit/CityResults.test.tsx`.
- **Rastreabilidade:** FR-01, FR-02; RNF3, RNF7.

### T-25 — Testar estado de carregamento
- **Tipo:** Test
- **Descrição:** Testar `LoadingState` isoladamente.
- **Critérios de aceite:** Testing Library encontra um indicador com role=status (ou role equivalente documentado); não encontra mensagem de sucesso ou erro enquanto loading estiver ativo. (FR-06; AC-FR06-01; RNF3)
- **Dependências:** T-17.
- **Arquivos prováveis:** `tests/unit/LoadingState.test.tsx`.
- **Rastreabilidade:** FR-01, FR-06; RNF3, RNF6.

### T-26 — Testar estado vazio
- **Tipo:** Test
- **Descrição:** Testar `EmptyState` isoladamente.
- **Critérios de aceite:** Testing Library encontra a mensagem de nenhum resultado; não encontra mensagem/role de erro técnico; callback/controle para nova busca permanece disponível. (FR-01, FR-06; AC-FR01-03, AC-FR06-03)
- **Dependências:** T-18.
- **Arquivos prováveis:** `tests/unit/EmptyState.test.tsx`.
- **Rastreabilidade:** FR-01, FR-06; RNF3, RNF6.

### T-27 — Testar estado de erro e retry
- **Tipo:** Test
- **Descrição:** Testar `ErrorState` isoladamente, incluindo a ação de retry.
- **Critérios de aceite:** Testing Library verifica mensagem compreensível sem stack trace/URL; Enter ou Space no botão de retry invoca o callback exatamente uma vez. (FR-06, FR-07; AC-FR06-02, AC-FR07-01; RNF3, RNF6)
- **Dependências:** T-19.
- **Arquivos prováveis:** `tests/unit/ErrorState.test.tsx`.
- **Rastreabilidade:** FR-06, FR-07; RNF3, RNF4, RNF6.

### T-28 — Testar exibição do clima atual
- **Tipo:** Test
- **Descrição:** Testar `CurrentWeather` com dados completos e com timestamp ausente.
- **Critérios de aceite:** Com timestamp ausente, nenhum horário é exibido; com current válido, cidade/temperatura/unidade/condição aparecem; valor formatado corresponde ao arredondamento da unidade selecionada. (FR-03, FR-05; AC-FR03-01, AC-FR03-02, AC-FR05-01, AC-FR05-03)
- **Dependências:** T-20.
- **Arquivos prováveis:** `tests/unit/CurrentWeather.test.tsx`.
- **Rastreabilidade:** FR-03, FR-05; RNF3, RNF8.

### T-29 — Testar exibição da previsão diária
- **Tipo:** Test
- **Descrição:** Testar `ForecastList` e `ForecastCard` com cinco dias e com forecast incompleto.
- **Critérios de aceite:** Com fixture de cinco dias, renderiza cinco cards em ordem e cada card mostra dia, condição, mínima, máxima e unidade; com fixture de quatro dias não renderiza cinco dias nem declara previsão completa. (FR-04, FR-05; AC-FR04-01, AC-FR04-02, AC-FR05-01)
- **Dependências:** T-21.
- **Arquivos prováveis:** `tests/unit/ForecastList.test.tsx`, `tests/unit/ForecastCard.test.tsx`.
- **Rastreabilidade:** FR-04, FR-05; RNF2, RNF3, RNF8.

### T-30 — Testar alternância de unidade
- **Tipo:** Test
- **Descrição:** Testar `UnitToggle` isoladamente.
- **Critérios de aceite:** Inicialização seleciona Celsius; controles são localizáveis por nome acessível; selecionar Fahrenheit e depois Celsius emite os valores esperados; callback de request permanece sem chamadas. (FR-05; AC-FR05-01, AC-FR05-02; RNF3)
- **Dependências:** T-22.
- **Arquivos prováveis:** `tests/unit/UnitToggle.test.tsx`.
- **Rastreabilidade:** FR-05; RNF3, RNF8.

### T-31 — Implementar testes E2E principais
- **Tipo:** Test
- **Descrição:** Testar jornadas completas no browser usando interceptação Playwright.
- **Critérios de aceite:** Playwright passa cenários separados para busca→seleção→clima+5 dias, sem resultados, homônimos, C/F sem segundo request forecast, falha+retry e retry com nova falha; todas as respostas vêm de `page.route` e nenhuma requisição externa ocorre. (FR-01–FR-07; US-01–US-06)
- **Dependências:** T-23.
- **Arquivos prováveis:** `tests/e2e/weather.spec.ts`.
- **Rastreabilidade:** FR-01–FR-07; US-01–US-06.

### T-32 — Verificar responsividade, acessibilidade e performance
- **Tipo:** Test
- **Descrição:** Verificar viewport mínimo, teclado, contraste e limites de desempenho.
- **Critérios de aceite:** Em viewport 320px e desktop, não há rolagem horizontal nem sobreposição na jornada; teclado alcança os controles e mantém foco visível; auditoria mede contraste ≥4.5:1 para texto normal e ≥3:1 para texto grande/componentes; com cache frio, perfil móvel intermediário e 4G simulado, interface inicial utilizável <2s; ação→feedback ≤100ms. (RNF1, RNF2, RNF3; US-05)
- **Dependências:** T-23, T-31.
- **Arquivos prováveis:** `tests/e2e/weather.spec.ts`, fixtures/configuração Playwright se necessário.
- **Rastreabilidade:** RNF1, RNF2, RNF3; US-05.

## Entrega 7 — Hardening

### T-33 — Executar quality gates
- **Tipo:** Infra
- **Descrição:** Executar verificações finais do repositório após integração.
- **Critérios de aceite:** Os comandos `pnpm lint`, `pnpm build` e `pnpm test` terminam com código 0; `pnpm test:e2e` termina com código 0 quando os browsers Playwright estiverem instalados; falhas são registradas e resolvidas antes da conclusão. (Quality gates do projeto; todos os FRs)
- **Dependências:** T-03, T-06, T-08, T-10, T-12, T-24, T-25, T-26, T-27, T-28, T-29, T-30, T-31, T-32.
- **Arquivos prováveis:** Nenhum; configurações existentes somente se um gate exigir ajuste.
- **Rastreabilidade:** Requisitos funcionais e não funcionais do backlog.

## Rastreabilidade — Requisitos funcionais

| Requisito | Tarefas |
| --- | --- |
| FR-01 — Buscar cidades | T-07, T-08, T-11, T-14, T-15, T-17, T-18, T-23, T-24, T-25, T-26, T-31 |
| FR-02 — Selecionar cidade | T-07, T-08, T-09, T-11, T-16, T-23, T-24, T-31 |
| FR-03 — Exibir clima atual | T-05, T-09, T-10, T-20, T-23, T-28, T-31 |
| FR-04 — Exibir previsão | T-05, T-09, T-10, T-21, T-23, T-29, T-31 |
| FR-05 — Alternar unidade | T-02, T-03, T-11, T-20, T-21, T-22, T-23, T-28, T-29, T-30, T-31 |
| FR-06 — Comunicar estados | T-07, T-08, T-09, T-10, T-11, T-12, T-17, T-18, T-19, T-23, T-25, T-26, T-27, T-31 |
| FR-07 — Tentar novamente | T-09, T-10, T-11, T-12, T-19, T-23, T-27, T-31 |