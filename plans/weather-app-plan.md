# Weather App — Plano Técnico

Este plano traduz [specs/weather-app-spec.md](../specs/weather-app-spec.md) em decisões técnicas e contratos. Ele não contém código de produção.

## Architecture

### Visão geral

A aplicação será uma SPA React estática com quatro camadas simples:

1. **Apresentação:** componentes React responsáveis por formulário, resultados, clima atual, previsão, unidade e estados visuais.
2. **Orquestração:** hook `useWeather`, que coordena busca, seleção, carregamento, sucesso, vazio, erro e retry.
3. **Dados:** services isolados para geocoding e forecast da Open-Meteo.
4. **Domínio compartilhado:** tipos e funções puras para conversão, formatação e mapeamento de códigos meteorológicos.

Os componentes não conhecerão URLs, parâmetros da API ou o formato bruto das respostas. O service converterá respostas externas em contratos internos antes de entregá-las ao hook.

### Princípios

- Celsius será a unidade interna canônica; Fahrenheit será derivado na apresentação.
- Uma cidade ficará em foco por vez.
- Não haverá store global, autenticação, backend ou persistência local.
- O fluxo principal será teclado-acessível e mobile-first.
- Cada requisito funcional será rastreado a critérios de aceite e testes.

### Rastreabilidade arquitetural

| Decisão | Requisitos relacionados |
| --- | --- |
| Busca e seleção separadas | FR-01, FR-02, AC-FR01-01, AC-FR02-01 |
| Dados internos normalizados em Celsius | FR-03, FR-04, FR-05, RNF8 |
| Estados explícitos e retry | FR-06, FR-07, RNF4, RNF6 |
| Layout responsivo e semântica acessível | RNF2, RNF3, US-05 |
| Fonte pública sem segredo | RNF5 |

## Tech Stack

| Tecnologia | Uso | Justificativa |
| --- | --- | --- |
| TypeScript strict | Tipos e contratos | Reduz erros entre API, service, hook e componentes. |
| React | Interface e composição | Já definido pela stack do projeto e adequado ao fluxo por estados. |
| Vite | Build e desenvolvimento | Build estático simples e compatível com deploy em GitHub Pages. |
| Tailwind CSS | Estilos responsivos | Permite implementar mobile-first e manter o escopo visual pequeno. |
| Open-Meteo | Geocoding e previsão | Fonte pública, sem chave de API, conforme RNF5. |
| Vitest + Testing Library | Testes unitários e de componentes | Cobrem funções puras, services e comportamento acessível da UI. |
| Playwright | Testes E2E | Valida jornada completa, erros e viewport de 320px. |
| Biome | Lint e formatação | Mantém consistência no código TypeScript/React existente. |
| pnpm | Dependências e scripts | Gerenciador já adotado pelo repositório. |

Não será introduzido Redux, React Query ou um backend: o volume e a duração do estado não justificam essas camadas no MVP.

## Project Structure

```text
src/
├── components/
│   ├── SearchBar.tsx          # input, submit, validação e acessibilidade
│   ├── CityResults.tsx        # resultados e seleção de cidade
│   ├── CurrentWeather.tsx     # clima atual
│   ├── ForecastList.tsx       # cinco dias
│   ├── ForecastCard.tsx       # item de um dia
│   ├── UnitToggle.tsx         # Celsius/Fahrenheit
│   └── states/                # idle, loading, empty e error
├── hooks/
│   └── useWeather.ts          # orquestração do fluxo e retry
├── services/
│   ├── geocodingService.ts    # Open-Meteo geocoding
│   └── weatherService.ts      # Open-Meteo forecast
├── lib/
│   ├── temperature.ts         # conversão e arredondamento
│   ├── format.ts              # datas, números e unidade
│   └── weatherCodes.ts        # WMO code -> label/ícone semântico
├── types/
│   └── weather.ts             # contratos internos e estados
├── styles/
│   └── index.css              # Tailwind e estilos globais mínimos
├── App.tsx                    # composição da tela
└── main.tsx                   # bootstrap React
tests/
├── unit/                      # funções, services, hooks e componentes
└── e2e/                       # jornadas com API interceptada
```

Os nomes acima são a estrutura-alvo; os arquivos podem ser agrupados apenas quando isso reduzir duplicação sem misturar responsabilidades.

## Data Model

Os contratos internos abaixo são a fonte de verdade entre services, hook e UI. Os campos de temperatura terminados em `C` permanecem em Celsius mesmo quando a UI estiver em Fahrenheit.

```ts
type Unit = 'celsius' | 'fahrenheit'

interface City {
  id: number
  name: string
  country: string
  admin1?: string
  latitude: number
  longitude: number
  timezone?: string
}

interface WeatherCondition {
  code: number
  label: string
}

interface CurrentWeather {
  time: string
  temperatureC: number
  condition: WeatherCondition
}

interface ForecastDay {
  date: string
  temperatureMinC: number
  temperatureMaxC: number
  condition: WeatherCondition
}

interface WeatherData {
  city: City
  timezone: string
  current: CurrentWeather
  forecast: ForecastDay[] // exatamente 5 itens no sucesso completo
}

type AsyncStatus = 'idle' | 'loading' | 'success' | 'empty' | 'error'

interface SearchState {
  status: AsyncStatus
  query: string
  results: City[]
  message?: string
}

interface WeatherState {
  status: AsyncStatus
  data?: WeatherData
  message?: string
}
```

### Contratos de service

```ts
interface GeocodingService {
  searchCities(query: string, signal?: AbortSignal): Promise<City[]>
}

interface WeatherService {
  getWeather(city: City, signal?: AbortSignal): Promise<WeatherData>
}
```

### Regras do modelo

- `City.id`, latitude e longitude identificam a cidade selecionada; o texto do input não é usado como identidade.
- `WeatherData.forecast` só entra em `success` com cinco dias completos conforme FR-04.
- Uma resposta sem campo essencial deve produzir erro ou estado de dados indisponíveis, nunca um valor inventado.
- A conversão para Fahrenheit e o arredondamento para inteiro ocorrem fora do modelo bruto, na camada de apresentação/lib.

## Data Flow

```mermaid
flowchart LR
  A[Usuário informa cidade] --> B[SearchBar]
  B --> C{Validação local}
  C -->|válido| D[useWeather.searchCities]
  C -->|vazio ou curto| E[Mensagem de input]
  D --> F[geocodingService]
  F --> G[Open-Meteo Geocoding]
  G --> H[City[] normalizado]
  H --> I[Lista de resultados]
  I --> J[Usuário seleciona City]
  J --> K[useWeather.loadWeather]
  K --> L[weatherService]
  L --> M[Open-Meteo Forecast]
  M --> N[WeatherData normalizado]
  N --> O[Estado success]
  O --> P[CurrentWeather + ForecastList]
  O --> Q[UnitToggle]
  Q --> R[Conversão local C/F]
  K --> S[loading / error / retry]
```

### Sequência principal

1. `SearchBar` valida input vazio, espaços e mínimo de 2 caracteres.
2. O hook define `search.status = loading` e chama `GeocodingService` com `AbortSignal`.
3. O service consulta a Open-Meteo, valida a resposta e retorna até 10 `City`.
4. O usuário seleciona um `City` por identificador estável.
5. O hook define `weather.status = loading` e chama `WeatherService` uma vez.
6. O service normaliza clima atual, timezone e cinco dias.
7. A UI renderiza dados em Celsius; a unidade escolhida transforma apenas a apresentação.
8. Uma nova busca ou seleção invalida a resposta anterior para evitar dados obsoletos.

## External APIs

### Geocoding

**Endpoint:** `GET https://geocoding-api.open-meteo.com/v1/search`

**Parâmetros:**

| Parâmetro | Valor planejado | Regra |
| --- | --- | --- |
| `name` | texto do usuário | obrigatório, mínimo de 2 caracteres |
| `count` | `10` | máximo definido por FR-01 |
| `language` | `pt` | labels compatíveis com a UI pt-BR |
| `format` | `json` | resposta estruturada |

**Campos consumidos:** `id`, `name`, `latitude`, `longitude`, `country`, `admin1`, `timezone`.

O service deve tratar ausência de `results` como lista vazia, não como exceção.

### Forecast

**Endpoint:** `GET https://api.open-meteo.com/v1/forecast`

**Parâmetros:**

| Parâmetro | Valor planejado | Regra |
| --- | --- | --- |
| `latitude` | latitude da `City` | obrigatório |
| `longitude` | longitude da `City` | obrigatório |
| `current` | `temperature_2m,weather_code` | dados atuais mínimos |
| `daily` | `weather_code,temperature_2m_max,temperature_2m_min` | previsão mínima |
| `timezone` | `auto` | datas no fuso da cidade |
| `forecast_days` | `5` | hoje + quatro dias |
| `temperature_unit` | `celsius` | Celsius canônico interno |

**Campos consumidos:**

- `timezone`;
- `current.time`, `current.temperature_2m`, `current.weather_code`;
- `daily.time`, `daily.temperature_2m_min`, `daily.temperature_2m_max`, `daily.weather_code`.

O service deve validar que os arrays `daily` têm cinco posições e que os campos essenciais possuem valores numéricos ou datas válidas. A resposta deve ser transformada em `WeatherData`; componentes não devem consumir o payload bruto.

### Política de rede

- Usar `fetch` nativo ou helper pequeno equivalente, sem cliente HTTP adicional.
- Propagar `AbortSignal` para cancelar uma busca substituída por outra.
- Definir timeout no service e classificar HTTP não-2xx, timeout, rede e payload inválido em erros internos distintos.
- Não enviar chave, token ou dado pessoal para a API.

## State Management

O estado viverá no hook `useWeather`, usado por `App` e distribuído por props. Não haverá store global.

### Estado de busca

- `idle`: tela inicial sem resultados.
- `loading`: geocoding em andamento.
- `success`: resultados disponíveis para seleção.
- `empty`: resposta válida sem cidades.
- `error`: falha de rede, timeout, HTTP ou payload.

### Estado meteorológico

- `idle`: nenhuma cidade selecionada.
- `loading`: forecast em andamento.
- `success`: `WeatherData` válido.
- `empty`: reservado para ausência de dados utilizáveis, sem inventar conteúdo.
- `error`: falha recuperável ou não recuperável.

### Unidade

`unit` começa em `'celsius'` e é mantida no estado local de `App` ou do hook. `selectUnit` apenas altera a unidade de apresentação; não chama services e não altera `WeatherData`.

### Concorrência

Cada nova busca cancela a requisição anterior quando possível e recebe um identificador de operação. Uma resposta cujo identificador não seja o atual deve ser ignorada.

## Error Handling

| Situação | Estado | Mensagem/ação | Dados preservados |
| --- | --- | --- | --- |
| Input vazio ou curto | validação local | Informar mínimo de 2 caracteres; sem request | query |
| Geocoding sem resultados | `search.empty` | “Nenhuma cidade encontrada.”; nova busca | query |
| Falha de geocoding | `search.error` | erro de conexão/serviço; retry pela nova busca | query |
| Forecast em andamento | `weather.loading` | indicador de carregamento | cidade |
| Timeout ou falha de rede | `weather.error` | “Não foi possível carregar o clima. Tente novamente.” | cidade |
| HTTP 429 ou indisponibilidade | `weather.error` | serviço temporariamente indisponível; retry manual | cidade |
| JSON inválido/contrato inesperado | `weather.error` | dados indisponíveis; não renderizar payload parcial | cidade |
| Dados parciais | `weather.error` ou seção indisponível | informar quais dados não estão disponíveis | seções completas |
| Retry com sucesso | `weather.success` | atualizar dados | cidade |
| Retry com nova falha | `weather.error` | manter retry disponível | cidade |

Erros técnicos não devem expor stack trace, URL completa ou detalhes internos ao usuário. O retry será manual e não haverá repetição automática agressiva.

## Testing Strategy

### Unitários — Vitest

- Conversão Celsius/Fahrenheit e arredondamento para inteiro.
- Formatação de datas usando timezone fornecido.
- Mapeamento de códigos WMO para condições conhecidas e fallback desconhecido.
- Validação de input vazio, espaços e mínimo de 2 caracteres.
- Normalização de respostas de geocoding e forecast.
- Validação de cinco dias e campos essenciais.
- Classificação de timeout, HTTP, rede, JSON inválido e rate limit.
- Transições do hook: `idle`, `loading`, `success`, `empty` e `error`.
- Retry com sucesso e retry com nova falha.

Services usarão mocks de `fetch`; nenhum teste unitário chamará a API real.

### Componentes — Testing Library

- Busca por role/label, submissão e validação local.
- Resultados distinguíveis e seleção por teclado.
- Renderização de clima atual e cinco dias.
- Toggle de unidade sem nova chamada de rede.
- Mensagens e estados de loading, empty e error.
- Foco visível e nomes acessíveis dos controles principais.

### E2E — Playwright

Os endpoints serão interceptados com `page.route` para respostas determinísticas.

1. Busca cidade → seleção → clima atual e previsão de cinco dias.
2. Busca vazia, curta e sem resultados.
3. Cidades homônimas e seleção correta.
4. Alternância Celsius/Fahrenheit sem nova requisição meteorológica.
5. Falha, timeout e retry com sucesso.
6. Retry com nova falha.
7. Jornada completa em viewport de 320px e viewport desktop.
8. Navegação do fluxo principal apenas com teclado.

### Quality gates

Antes de considerar uma tarefa concluída: `pnpm lint`, `pnpm build` e `pnpm test`. O conjunto E2E deve ser executado antes da entrega quando o ambiente Playwright estiver disponível.

## Risks & Trade-offs

| Risco/decisão | Trade-off | Decisão do plano |
| --- | --- | --- |
| Dependência da Open-Meteo | Simplicidade e ausência de chave versus disponibilidade externa | Isolar services, validar payloads e oferecer retry manual. |
| Sem cache ou persistência | Menos complexidade e privacidade melhor versus mais requests | Aceitar no MVP; não implementar cache local. |
| Estado em hook local | Simplicidade versus menor reutilização entre páginas | Adequado para uma única tela e uma cidade em foco. |
| Celsius interno + conversão local | Contrato simples versus necessidade de testar conversão | Adotar e cobrir com testes de fronteira. |
| `timezone=auto` | Datas corretas para a cidade versus dependência da resposta da API | Exigir timezone válido no sucesso; não inventar timezone ausente. |
| Sem cliente HTTP adicional | Menos dependências versus menos helpers prontos | Usar `fetch` e um pequeno normalizador de erros. |
| Sem telemetria de usuário | Menor risco de privacidade versus menor visibilidade operacional | Usar mensagens na UI, smoke checks e ownership explícito. |
| Suporte às duas versões mais recentes | Menor custo de testes versus não cobrir browsers antigos | Validar Chrome, Edge, Firefox e Safari desktop/mobile definidos na spec. |
| Falha parcial de dados | Evita informação enganosa versus menos conteúdo exibido | Renderizar somente seções completas e sinalizar indisponibilidade. |

### Pontos de atenção para o próximo backlog

- Confirmar a disponibilidade e o formato dos campos usados nos endpoints antes de implementar os services.
- Transformar os contratos deste plano em tarefas independentes, começando por tipos e funções puras.
- Não introduzir favoritos, geolocalização, cache, previsão horária ou qualquer item de `Out of Scope` sem nova decisão de produto.