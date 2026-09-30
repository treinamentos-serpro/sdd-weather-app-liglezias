# Weather App — Especificação de Produto

## Overview

O Weather App é uma aplicação web responsiva para consulta rápida de condições meteorológicas. O usuário poderá buscar uma cidade, selecionar o local correto, visualizar o clima atual e consultar a previsão de hoje mais os quatro dias seguintes.

A primeira versão será orientada a consultas imediatas, sem autenticação e sem persistência de servidor. A interface será em português do Brasil, terá Celsius como unidade padrão e permitirá alternância para Fahrenheit sem uma nova busca.

### Objetivos

- Permitir que uma pessoa encontre uma cidade e consulte sua condição meteorológica atual.
- Exibir uma previsão diária de cinco dias de forma clara e comparável.
- Oferecer uma experiência funcional em telas a partir de 320px até desktop.
- Comunicar carregamento, ausência de resultados e falhas de forma compreensível.
- Manter o produto simples de publicar como aplicação estática, usando a Open-Meteo sem chave de API.

### Público e personas

- **Pessoa planejando a rotina:** precisa consultar rapidamente o clima atual antes de sair.
- **Viajante:** precisa avaliar a previsão dos próximos cinco dias para planejar atividades.
- **Usuário com preferência de unidade:** precisa visualizar os valores na unidade que reconhece, Celsius ou Fahrenheit.

### Escopo da consulta

A aplicação terá uma cidade em foco por vez. A previsão será diária e compreenderá o dia atual e os quatro dias seguintes. O clima atual e a previsão deverão estar associados à cidade selecionada e ao respectivo fuso horário, que será usado para identificar e formatar as datas exibidas.

## Functional Requirements

### FR-01 — Buscar cidades

O sistema deve permitir que o usuário informe o nome de uma cidade e inicie uma busca.

- O campo deve aceitar texto digitado.
- A busca deve ser acionada por ação explícita do usuário.
- O campo deve aceitar no mínimo 2 caracteres não vazios e limitar a lista exibida a no máximo 10 resultados.
- Entradas vazias ou compostas apenas por espaços não devem iniciar uma chamada.
- A busca deve preservar acentos e espaços internos do nome informado.
- Os resultados devem conter dados suficientes para diferenciar cidades homônimas, incluindo no mínimo nome da cidade e país quando disponíveis.
- O sistema deve apresentar estado de carregamento enquanto a busca estiver em andamento.
- O sistema deve informar quando não houver resultados.

### FR-02 — Selecionar uma cidade

O sistema deve permitir que o usuário selecione uma cidade entre os resultados da busca.

- A cidade selecionada deve ficar identificada na área de clima.
- A seleção deve usar o identificador e a localização retornados pelo resultado, não apenas o texto digitado.
- A seleção deve iniciar a consulta meteorológica da cidade.
- Uma seleção deve iniciar uma única consulta meteorológica para a cidade selecionada.
- O usuário deve conseguir distinguir cidades com o mesmo nome por país, região ou outra informação de localização disponível.

### FR-03 — Exibir clima atual

O sistema deve exibir o clima atual da cidade selecionada.

A área de clima atual deve apresentar, no mínimo:

- nome da cidade e contexto de localização disponível;
- temperatura atual;
- unidade da temperatura;
- condição meteorológica resumida;
- horário ou momento de referência dos dados, formatado no fuso horário da cidade quando fornecido pela fonte.
- Quando a fonte não fornecer referência temporal, a interface não deve inventar um horário.
- As datas devem ser calculadas e exibidas no fuso horário da cidade selecionada.

### FR-04 — Exibir previsão de cinco dias

O sistema deve exibir a previsão diária de hoje mais os quatro dias seguintes.

Cada item da previsão deve apresentar, no mínimo:

- identificação do dia;
- condição meteorológica resumida;
- temperatura máxima;
- temperatura mínima;
- unidade aplicada aos valores.

A previsão deve ser apresentada em ordem cronológica e não deve misturar dados de cidades diferentes.

### FR-05 — Alternar unidade de temperatura

O sistema deve permitir alternar a exibição entre Celsius e Fahrenheit.

- Celsius deve ser a unidade inicial.
- A unidade ativa deve estar visível e ser identificável por teclado e tecnologia assistiva.
- A troca deve atualizar a temperatura atual e todos os valores da previsão.
- A troca de unidade não deve realizar nova busca meteorológica.
- Os valores convertidos devem usar uma regra única de conversão e arredondamento.
- Os valores devem ser arredondados para o inteiro mais próximo antes da exibição.

### FR-06 — Comunicar estados da operação

O sistema deve comunicar os estados relevantes da jornada de consulta.

- Antes da primeira busca, deve apresentar um estado inicial que oriente o usuário sem inventar dados meteorológicos.
- Durante buscas de cidade ou clima, deve apresentar feedback de carregamento.
- Em caso de erro, deve apresentar uma mensagem clara e, quando aplicável, uma ação de nova tentativa.
- Quando não houver resultados, deve informar essa condição sem tratá-la como erro técnico.
- O sistema não deve exibir dados de uma consulta anterior como se fossem resultado da nova cidade solicitada.

### FR-07 — Tentar novamente uma consulta

O sistema deve permitir nova tentativa quando uma consulta meteorológica falhar de forma recuperável.

- A ação de retry deve manter a cidade selecionada e repetir a consulta meteorológica mais recente.
- Ao iniciar o retry, a interface deve voltar ao estado de carregamento.
- Em caso de sucesso, deve exibir os dados atualizados.
- Em caso de nova falha, deve manter a mensagem de erro e a possibilidade de tentar novamente.

## User Stories

### US-01 — Consulta rápida da rotina

Como pessoa planejando a rotina, quero buscar minha cidade e ver o clima atual para decidir como me vestir ou me deslocar.

**Requisitos relacionados:** FR-01, FR-02, FR-03.

### US-02 — Planejamento de viagem

Como viajante, quero consultar a previsão de hoje e dos quatro dias seguintes para planejar minhas atividades.

**Requisitos relacionados:** FR-02, FR-03, FR-04.

### US-03 — Escolha de cidade homônima

Como pessoa planejando a rotina, quero ver país ou região nos resultados para selecionar o local correto quando houver cidades com o mesmo nome.

**Requisitos relacionados:** FR-01, FR-02.

### US-04 — Preferência de unidade

Como usuário com preferência de unidade, quero alternar entre Celsius e Fahrenheit para interpretar as temperaturas sem repetir a busca.

**Requisitos relacionados:** FR-03, FR-04, FR-05.

### US-05 — Consulta em dispositivo móvel

Como pessoa planejando a rotina, quero consultar a previsão em uma tela pequena para tomar uma decisão rapidamente fora de casa.

**Requisitos relacionados:** FR-01, FR-03, FR-04.

### US-06 — Recuperação de falha

Como viajante, quero receber uma explicação clara e poder tentar novamente quando uma consulta falhar para concluir meu planejamento sem reiniciar a jornada.

**Requisitos relacionados:** FR-01, FR-02, FR-06.

### Rastreabilidade

| User Story | Requisitos funcionais | Critérios de aceite principais | Requisitos não funcionais |
| --- | --- | --- | --- |
| US-01 | FR-01, FR-02, FR-03, FR-06 | AC-FR01-01, AC-FR01-02, AC-FR01-03, AC-FR02-01, AC-FR03-01, AC-FR06-01 | RNF1, RNF3, RNF6, RNF7 |
| US-02 | FR-02, FR-03, FR-04 | AC-FR02-01, AC-FR03-01, AC-FR03-02, AC-FR04-01, AC-FR04-02 | RNF1, RNF7, RNF8 |
| US-03 | FR-01, FR-02 | AC-FR01-01, AC-FR02-02 | RNF3, RNF7 |
| US-04 | FR-03, FR-04, FR-05 | AC-FR03-01, AC-FR04-02, AC-FR05-01, AC-FR05-02, AC-FR05-03 | RNF3, RNF8 |
| US-05 | FR-01, FR-03, FR-04 | AC-FR01-01, AC-FR03-01, AC-FR04-01 | RNF1, RNF2, RNF3 |
| US-06 | FR-06, FR-07 | AC-FR06-02, AC-FR06-03, AC-FR07-01, AC-FR07-02 | RNF4, RNF6 |

## Acceptance Criteria

### AC para FR-01 — Buscar cidades

#### AC-FR01-01 — Busca com resultados

- **Given** que o usuário esteja no estado inicial e informe um nome de cidade válido
- **When** executar a busca
- **Then** o sistema deve exibir um estado de carregamento e depois uma lista com até 10 resultados correspondentes

#### AC-FR01-02 — Entrada vazia

- **Given** que o campo esteja vazio ou contenha apenas espaços
- **When** o usuário tentar buscar
- **Then** o sistema não deve iniciar uma chamada e deve indicar que uma cidade precisa ser informada

#### AC-FR01-03 — Busca sem resultados

- **Given** que o usuário informe um texto com pelo menos 2 caracteres e não existam cidades correspondentes
- **When** executar a busca
- **Then** o sistema deve exibir a mensagem de nenhum resultado e manter o campo disponível para nova busca

#### AC-FR01-04 — Texto curto

- **Given** que o usuário informe menos de 2 caracteres não vazios
- **When** tentar buscar
- **Then** o sistema não deve iniciar uma chamada e deve indicar o tamanho mínimo da busca

### AC para FR-02 — Selecionar uma cidade

#### AC-FR02-01 — Seleção de resultado

- **Given** que uma lista de cidades tenha sido exibida
- **When** o usuário selecionar um resultado
- **Then** a aplicação deve identificar a cidade selecionada e iniciar a consulta meteorológica associada à localização desse resultado

#### AC-FR02-02 — Cidades homônimas

- **Given** que existam dois resultados com o mesmo nome
- **When** a lista for exibida
- **Then** cada resultado deve apresentar informação adicional de localização suficiente para diferenciá-los

### AC para FR-03 — Exibir clima atual

#### AC-FR03-01 — Consulta bem-sucedida

- **Given** que o usuário tenha selecionado uma cidade
- **When** os dados meteorológicos atuais forem recebidos
- **Then** a aplicação deve exibir cidade, temperatura, unidade e condição meteorológica resumida

#### AC-FR03-02 — Referência temporal

- **Given** que a fonte forneça horário ou momento de referência
- **When** o clima atual for exibido
- **Then** a aplicação deve apresentar esse contexto temporal no fuso horário da cidade, sem inventar um horário ausente

### AC para FR-04 — Exibir previsão de cinco dias

#### AC-FR04-01 — Período correto

- **Given** que a consulta meteorológica tenha sido concluída com sucesso
- **When** a previsão for exibida
- **Then** devem aparecer exatamente cinco dias, correspondentes a hoje e aos quatro dias seguintes, em ordem cronológica

#### AC-FR04-02 — Dados mínimos por dia

- **Given** que um dia possua dados válidos
- **When** esse dia for exibido
- **Then** o item deve mostrar dia, condição, temperatura máxima, temperatura mínima e unidade

### AC para FR-05 — Alternar unidade de temperatura

#### AC-FR05-01 — Conversão para Fahrenheit

- **Given** que os dados estejam exibidos em Celsius
- **When** o usuário selecionar Fahrenheit
- **Then** a temperatura atual e todas as temperaturas da previsão devem ser atualizadas para Fahrenheit sem nova busca meteorológica

#### AC-FR05-02 — Retorno para Celsius

- **Given** que os dados estejam exibidos em Fahrenheit
- **When** o usuário selecionar Celsius
- **Then** todos os valores devem voltar para Celsius e a unidade ativa deve ficar visível

#### AC-FR05-03 — Arredondamento consistente

- **Given** que uma temperatura convertida tenha parte decimal
- **When** a temperatura for exibida
- **Then** o valor deve ser arredondado para o inteiro mais próximo tanto no clima atual quanto na previsão

### AC para FR-06 — Comunicar estados da operação

#### AC-FR06-01 — Carregamento

- **Given** que uma busca esteja em andamento
- **When** a aplicação estiver aguardando a resposta
- **Then** deve haver uma indicação de carregamento e o usuário não deve interpretar a tela como resultado concluído

#### AC-FR06-02 — Erro recuperável

- **Given** que a consulta falhe por rede, timeout ou indisponibilidade da fonte
- **When** o erro for identificado
- **Then** a aplicação deve exibir uma mensagem clara e oferecer nova tentativa quando a recuperação for possível

#### AC-FR06-03 — Sem resultados

- **Given** que a busca não encontre cidades
- **When** a resposta for processada
- **Then** a aplicação deve informar que nenhum resultado foi encontrado e manter o campo disponível para nova busca

### AC para FR-07 — Tentar novamente uma consulta

#### AC-FR07-01 — Retry bem-sucedido

- **Given** que a consulta meteorológica tenha falhado e a cidade selecionada ainda esteja disponível
- **When** o usuário acionar a nova tentativa
- **Then** a aplicação deve manter a cidade, exibir carregamento, realizar uma nova consulta e exibir os dados quando a resposta for bem-sucedida

#### AC-FR07-02 — Retry com nova falha

- **Given** que uma nova tentativa também falhe
- **When** o erro for processado
- **Then** a aplicação deve exibir a mensagem de erro e manter a ação de nova tentativa disponível

## Non-Functional Requirements

### RNF1 — Performance

- A carga inicial deve ocorrer em menos de 2 segundos em uma conexão típica.
- A carga inicial deve ocorrer em menos de 2 segundos, medida do início da navegação até a interface inicial utilizável, em cache frio, dispositivo móvel intermediário e rede 4G simulada.
- A busca deve apresentar feedback visual em até 100ms após a ação do usuário, ainda que a resposta da fonte demore.

### RNF2 — Responsividade

- A interface deve seguir abordagem mobile-first.
- A aplicação deve permanecer funcional em larguras a partir de 320px até desktop.
- Conteúdo, controles e mensagens não devem se sobrepor nem exigir rolagem horizontal para a jornada principal.

### RNF3 — Acessibilidade

- A jornada principal deve ser navegável por teclado.
- Campos, resultados, controles e mensagens devem usar nomes, roles e labels semânticos.
- O contraste deve atender ao nível básico WCAG AA.
- Mudanças de carregamento, erro e resultado devem ser comunicadas a tecnologias assistivas quando necessário.

### RNF4 — Resiliência

- Falhas de rede, timeout, indisponibilidade da API, respostas inválidas e respostas parciais não devem quebrar a aplicação.
- A interface deve degradar de forma graciosa e informar o estado atual.
- Quando aplicável, o usuário deve poder tentar novamente sem reiniciar a aplicação.

### RNF5 — Sem chave de API

- A aplicação deve usar a fonte pública Open-Meteo.
- A consulta não deve exigir chave de API no cliente nem segredo durante o deploy estático.

### RNF6 — Observabilidade básica
### RNF6 — Mensagens de erro e observabilidade básica

- Mensagens de erro devem ser claras, específicas e compreensíveis para usuários não técnicos.
- A interface deve distinguir no mínimo input inválido, nenhum resultado, timeout, falha de rede e indisponibilidade da fonte.
- Quando possível, a mensagem deve indicar a ação de recuperação, como tentar novamente ou ajustar a busca.
| Resposta meteorológica parcial | Se faltar um campo essencial, não montar o card correspondente; indicar que os dados estão indisponíveis e preservar apenas seções completas. |

### RNF7 — Usabilidade

- A jornada buscar → selecionar → consultar deve ser compreensível sem instruções externas.
- A cidade selecionada e a unidade ativa devem permanecer visíveis durante a consulta.

### RNF8 — Consistência dos dados

- A unidade ativa deve ser aplicada consistentemente ao clima atual e à previsão.
- A previsão deve permanecer associada à cidade selecionada e ser exibida em ordem cronológica.

## Edge Cases

| Caso | Comportamento esperado |
| --- | --- |
| Input vazio ou composto apenas por espaços | Não realizar chamada; informar que uma cidade deve ser digitada e manter o foco no campo. |
| Cidade inexistente | Exibir mensagem de nenhum resultado e manter possibilidade de nova busca. |
| Input com caracteres especiais ou acentos | Preservar o texto com segurança, realizar a busca conforme suporte da fonte e informar ausência de resultados quando necessário. |
| Busca com muitas correspondências | Exibir resultados suficientes para seleção explícita e informação de localização para diferenciação. |
| Geocoding sem resultados | Tratar como estado vazio, não como falha inesperada da interface; manter o input disponível para nova busca. |
| Falha de API ou de rede | Exibir erro claro, manter o input preenchido quando possível e permitir nova tentativa sem quebrar a interface. |
| Timeout na consulta meteorológica | Encerrar o estado de carregamento, informar a falha e oferecer retry. |
| API indisponível ou com erro HTTP | Não exibir dados incompletos como se fossem atuais; mostrar erro recuperável. |
| Resposta com JSON inválido ou contrato inesperado | Descartar a resposta inválida, registrar o estado como erro e mostrar mensagem recuperável ao usuário. |
| Limite de requisições atingido | Informar que o serviço está temporariamente indisponível, evitar retries automáticos agressivos e permitir nova tentativa posterior. |
| Resposta meteorológica parcial | Exibir apenas dados válidos quando isso não causar ambiguidade; indicar dados indisponíveis nos demais campos. |
| Resposta sem dados de clima atual | Exibir a cidade e a previsão disponível, indicar que o clima atual está indisponível e não inventar um valor. |
| Condição meteorológica desconhecida | Exibir uma descrição neutra e não inventar ícone ou texto específico. |
| Duas cidades com o mesmo nome | Exibir país, região ou coordenadas para permitir seleção consciente. |
| Nova busca durante uma consulta em andamento | A aplicação deve evitar que a resposta antiga substitua os dados da busca mais recente. |
| Alternância de unidade durante carregamento | Permitir ou adiar a troca de forma consistente, sem perder a unidade selecionada nem exibir valores misturados. |
| Temperatura negativa, zero ou extrema | Exibir o valor corretamente na unidade ativa, sem tratamento visual que altere seu significado. |
| Largura de viewport de 320px | Manter busca, unidade, clima atual e acesso à previsão utilizáveis sem sobreposição. |
| Usuário navega apenas por teclado | Permitir alcançar campo, resultados, retry e alternância de unidade com foco visível e ordem lógica. |
| Usuário nega geolocalização | Não bloquear a aplicação; manter busca manual disponível. |

## Assumptions

- A fonte de dados será a Open-Meteo, sem necessidade de chave de API.
- A previsão de cinco dias significa hoje e os quatro dias seguintes.
- Celsius será a unidade inicial; Fahrenheit será a alternativa suportada.
- A interface inicial será em português do Brasil.
- Não haverá autenticação, criação de conta nem persistência de servidor.
- A primeira versão terá uma única cidade em foco por vez.
- A consulta de cidade será manual; geolocalização automática não será necessária para o fluxo principal.
- A conversão entre unidades ocorrerá a partir dos dados já carregados e não exigirá nova busca.
- A fonte fornecerá dados suficientes para identificar a cidade e montar a previsão diária.
- Usuários terão acesso a um navegador moderno com conexão para consultar dados atualizados.
- A aplicação poderá exibir estado vazio, erro e loading sem depender de notificações externas.
- Nenhuma preferência, última cidade ou cache será persistido localmente na primeira versão.
- O suporte oficial cobrirá as duas versões mais recentes de Chrome, Edge, Firefox e Safari, incluindo suas versões móveis equivalentes.
- A primeira versão exibirá somente os campos meteorológicos mínimos definidos nos requisitos funcionais.
- O monitoramento operacional será feito por verificações manuais de disponibilidade e pelo acompanhamento de relatos de erro; não haverá telemetria de usuário.
- O time responsável pelo produto e pela manutenção do repositório será o owner de suporte e resposta a indisponibilidades.

## Risks

| Risco | Probabilidade | Impacto | Mitigação |
| --- | --- | --- | --- |
| A Open-Meteo fica indisponível, lenta ou sujeita a limite de uso. | Média | Alto | Definir timeout, estados de erro, retry controlado e mensagens claras. |
| A fonte retorna dados incompletos ou incompatíveis. | Média | Alto | Validar a resposta e definir comportamento para campos ausentes. |
| A regra de cinco dias é implementada de forma diferente da decisão do produto. | Média | Alto | Usar hoje + quatro dias em critérios de aceite e testes. |
| Cidades homônimas causam consulta para o local errado. | Média | Alto | Exibir país, região ou coordenadas e exigir seleção explícita. |
| Requisitos adicionais aumentam o escopo do MVP. | Alta | Alto | Manter funcionalidades fora do escopo e exigir decisão antes de incluí-las. |
| A interface não funciona em telas pequenas ou com teclado. | Média | Alto | Validar 320px, desktop, navegação por teclado e critérios WCAG AA básico. |
| Usuários não confiam nos dados por falta de contexto temporal ou localização. | Média | Médio | Exibir cidade, unidade e referência temporal quando disponível. |

## Out of Scope

A primeira versão não incluirá:

- autenticação, contas de usuário ou perfis;
- persistência de dados em servidor;
- favoritos e histórico de cidades;
- comparação simultânea de várias cidades;
- alertas meteorológicos, notificações ou previsões personalizadas;
- geolocalização automática como requisito do fluxo principal;
- solicitação de permissão de geolocalização;
- mapas, radar ou visualizações geográficas;
- modo offline garantido ou sincronização de cache;
- previsão horária detalhada;
- integração com calendário, agenda ou aplicativos externos;
- publicidade, analytics ou integrações de terceiros não definidas;
- suporte multilíngue além de pt-BR;
- alteração da fonte pública para um provedor que exija chave de API.

## Open Questions

Não há questões abertas bloqueantes para o MVP. As decisões pendentes identificadas no discovery foram fechadas pelas premissas acima e poderão ser revisadas em uma versão futura do produto.
