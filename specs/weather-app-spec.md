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

A aplicação terá uma cidade em foco por vez. A previsão será diária e compreenderá o dia atual e os quatro dias seguintes. O clima atual e a previsão deverão estar associados à cidade selecionada e ao respectivo fuso horário.

## Functional Requirements

### FR-01 — Buscar cidades

O sistema deve permitir que o usuário informe o nome de uma cidade e inicie uma busca.

- O campo deve aceitar texto digitado.
- A busca deve ser acionada por ação explícita do usuário.
- Entradas vazias ou compostas apenas por espaços não devem iniciar uma chamada.
- Os resultados devem conter dados suficientes para diferenciar cidades homônimas, incluindo no mínimo nome da cidade e país quando disponíveis.
- O sistema deve apresentar estado de carregamento enquanto a busca estiver em andamento.
- O sistema deve informar quando não houver resultados.

### FR-02 — Selecionar uma cidade

O sistema deve permitir que o usuário selecione uma cidade entre os resultados da busca.

- A cidade selecionada deve ficar identificada na área de clima.
- A seleção deve usar o identificador e a localização retornados pelo resultado, não apenas o texto digitado.
- A seleção deve iniciar a consulta meteorológica da cidade.
- O usuário deve conseguir distinguir cidades com o mesmo nome por país, região ou outra informação de localização disponível.

### FR-03 — Exibir clima atual

O sistema deve exibir o clima atual da cidade selecionada.

A área de clima atual deve apresentar, no mínimo:

- nome da cidade e contexto de localização disponível;
- temperatura atual;
- unidade da temperatura;
- condição meteorológica resumida;
- horário ou momento de referência dos dados, quando fornecido pela fonte.

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

### FR-06 — Comunicar estados da operação

O sistema deve comunicar os estados relevantes da jornada de consulta.

- Antes da primeira busca, deve apresentar um estado inicial que oriente o usuário sem inventar dados meteorológicos.
- Durante buscas de cidade ou clima, deve apresentar feedback de carregamento.
- Em caso de erro, deve apresentar uma mensagem clara e, quando aplicável, uma ação de nova tentativa.
- Quando não houver resultados, deve informar essa condição sem tratá-la como erro técnico.
- O sistema não deve exibir dados de uma consulta anterior como se fossem resultado da nova cidade solicitada.

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

## Acceptance Criteria

### AC para FR-01 — Buscar cidades

**Cenário 1 — Busca válida**

- **Dado** que o usuário esteja no estado inicial e informe um nome de cidade válido
- **Quando** executar a busca
- **Então** o sistema deve exibir um estado de carregamento e depois uma lista de resultados correspondentes ou uma mensagem de ausência de resultados

**Cenário 2 — Entrada vazia**

- **Dado** que o campo esteja vazio ou contenha apenas espaços
- **Quando** o usuário tentar buscar
- **Então** o sistema não deve iniciar uma chamada e deve indicar que uma cidade precisa ser informada

### AC para FR-02 — Selecionar uma cidade

**Cenário 1 — Seleção de resultado**

- **Dado** que uma lista de cidades tenha sido exibida
- **Quando** o usuário selecionar um resultado
- **Então** a aplicação deve identificar a cidade selecionada e iniciar a consulta meteorológica associada à localização desse resultado

**Cenário 2 — Cidades homônimas**

- **Dado** que existam dois resultados com o mesmo nome
- **Quando** a lista for exibida
- **Então** cada resultado deve apresentar informação adicional de localização suficiente para diferenciá-los

### AC para FR-03 — Exibir clima atual

**Cenário 1 — Consulta bem-sucedida**

- **Dado** que o usuário tenha selecionado uma cidade
- **Quando** os dados meteorológicos atuais forem recebidos
- **Então** a aplicação deve exibir cidade, temperatura, unidade e condição meteorológica resumida

**Cenário 2 — Referência temporal**

- **Dado** que a fonte forneça horário ou momento de referência
- **Quando** o clima atual for exibido
- **Então** a aplicação deve apresentar esse contexto temporal de forma compreensível

### AC para FR-04 — Exibir previsão de cinco dias

**Cenário 1 — Período correto**

- **Dado** que a consulta meteorológica tenha sido concluída com sucesso
- **Quando** a previsão for exibida
- **Então** devem aparecer exatamente cinco dias, correspondentes a hoje e aos quatro dias seguintes, em ordem cronológica

**Cenário 2 — Dados mínimos por dia**

- **Dado** que um dia possua dados válidos
- **Quando** esse dia for exibido
- **Então** o item deve mostrar dia, condição, temperatura máxima, temperatura mínima e unidade

### AC para FR-05 — Alternar unidade de temperatura

**Cenário 1 — Conversão para Fahrenheit**

- **Dado** que os dados estejam exibidos em Celsius
- **Quando** o usuário selecionar Fahrenheit
- **Então** a temperatura atual e todas as temperaturas da previsão devem ser atualizadas para Fahrenheit sem nova busca meteorológica

**Cenário 2 — Retorno para Celsius**

- **Dado** que os dados estejam exibidos em Fahrenheit
- **Quando** o usuário selecionar Celsius
- **Então** todos os valores devem voltar para Celsius e a unidade ativa deve ficar visível

### AC para FR-06 — Comunicar estados da operação

**Cenário 1 — Carregamento**

- **Dado** que uma busca esteja em andamento
- **Quando** a aplicação estiver aguardando a resposta
- **Então** deve haver uma indicação de carregamento e o usuário não deve interpretar a tela como resultado concluído

**Cenário 2 — Erro recuperável**

- **Dado** que a consulta falhe por rede, timeout ou indisponibilidade da fonte
- **Quando** o erro for identificado
- **Então** a aplicação deve exibir uma mensagem clara e oferecer nova tentativa quando a recuperação for possível

**Cenário 3 — Sem resultados**

- **Dado** que a busca não encontre cidades
- **Quando** a resposta for processada
- **Então** a aplicação deve informar que nenhum resultado foi encontrado e manter o campo disponível para nova busca

## Non-Functional Requirements

### RNF1 — Performance

- A carga inicial deve ocorrer em menos de 2 segundos em uma conexão típica.
- A busca deve fornecer feedback visual imediato e ser percebida como instantânea, ainda que a resposta da fonte demore.

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

- Mensagens de erro devem ser claras, específicas e compreensíveis para usuários não técnicos.
- Quando possível, a mensagem deve indicar a ação de recuperação, como tentar novamente ou ajustar a busca.

### RNF7 — Usabilidade

- A jornada buscar → selecionar → consultar deve ser compreensível sem instruções externas.
- A cidade selecionada e a unidade ativa devem permanecer visíveis durante a consulta.

### RNF8 — Consistência dos dados

- A unidade ativa deve ser aplicada consistentemente ao clima atual e à previsão.
- A previsão deve permanecer associada à cidade selecionada e ser exibida em ordem cronológica.

## Edge Cases

| Caso | Comportamento esperado |
| --- | --- |
| Campo de busca vazio ou com espaços | Não realizar chamada; informar que uma cidade deve ser digitada. |
| Cidade inexistente | Exibir mensagem de nenhum resultado e manter possibilidade de nova busca. |
| Texto com caracteres especiais ou acentos | Preservar o texto com segurança, realizar a busca conforme suporte da fonte e informar ausência de resultados quando necessário. |
| Busca com muitas correspondências | Exibir resultados suficientes para seleção explícita e informação de localização para diferenciação. |
| Resposta de geocoding sem resultados | Tratar como estado vazio, não como falha inesperada da interface. |
| Falha de rede durante geocoding | Exibir erro claro, manter o campo preenchido quando possível e permitir nova tentativa. |
| Timeout na consulta meteorológica | Encerrar o estado de carregamento, informar a falha e oferecer retry. |
| API indisponível ou com erro HTTP | Não exibir dados incompletos como se fossem atuais; mostrar erro recuperável. |
| Resposta meteorológica parcial | Exibir apenas dados válidos quando isso não causar ambiguidade; indicar dados indisponíveis nos demais campos. |
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
- mapas, radar ou visualizações geográficas;
- modo offline garantido ou sincronização de cache;
- previsão horária detalhada;
- integração com calendário, agenda ou aplicativos externos;
- publicidade, analytics ou integrações de terceiros não definidas;
- suporte multilíngue além de pt-BR;
- alteração da fonte pública para um provedor que exija chave de API.

## Open Questions

As seguintes questões permanecem abertas e devem ser resolvidas antes de transformar a spec em um plano técnico detalhado:

1. Quais navegadores e versões mínimas serão oficialmente suportados?
2. Qual é a definição operacional de “conexão típica” para validar a carga inicial inferior a 2 segundos?
3. Quais campos meteorológicos adicionais, se houver, serão exibidos além dos mínimos desta spec, como umidade, vento, pressão ou precipitação?
4. Qual regra de arredondamento será usada para temperaturas convertidas?
5. Qual formato de data e horário será usado quando a fonte fornecer timezone diferente do dispositivo?
6. Qual o limite máximo de resultados de cidades exibidos em uma busca?
7. Qual é o texto final das mensagens de erro, ausência de resultados e timeout?
8. Será permitido persistir localmente a unidade escolhida ou a última cidade, apesar de não haver persistência de servidor?
9. Qual mecanismo de observabilidade operacional será adotado para acompanhar falhas da fonte pública após o deploy?
10. Quem será responsável por manutenção, suporte e resposta a indisponibilidade da fonte?
