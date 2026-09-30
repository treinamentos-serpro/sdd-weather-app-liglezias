# Discovery — Aplicação de Previsão do Tempo

## Contexto

A empresa solicitou uma aplicação de previsão do tempo para permitir que usuários consultem rapidamente as condições meteorológicas de uma cidade. A experiência deve atender tanto usuários em computadores quanto em dispositivos móveis.

O produto inicial deve cobrir quatro necessidades principais:

- localizar uma cidade;
- consultar o clima atual;
- consultar a previsão dos próximos cinco dias;
- visualizar temperaturas em Celsius ou Fahrenheit.

O principal valor esperado é oferecer uma consulta simples, clara e responsiva, sem exigir conhecimento técnico ou configuração complexa do usuário.

### Personas iniciais

| Persona | Objetivo principal | Contexto de uso | Métrica de sucesso percebida |
| --- | --- | --- | --- |
| **Pessoa planejando a rotina** | Consultar o clima atual para decidir o que vestir ou como se deslocar. | Principalmente mobile, pela manhã ou antes de sair; desktop como alternativa em casa ou no trabalho. | Encontra a cidade e entende a condição atual em até 1 minuto, sem precisar repetir a busca. |
| **Viajante** | Ver a previsão dos próximos cinco dias para planejar uma viagem ou atividade. | Principalmente desktop, durante o planejamento; mobile para consultas durante o deslocamento. | Consegue consultar os cinco dias e comparar temperaturas mínima e máxima sem informações ambíguas. |
| **Usuário com preferência de unidade** | Visualizar todas as temperaturas na unidade que reconhece, Celsius ou Fahrenheit. | Mobile ou desktop, durante uma consulta já realizada. | Alterna a unidade em uma ação e vê clima atual e previsão atualizados sem nova busca. |

## Requisitos Funcionais

### RF-01 — Buscar cidade

O sistema deve permitir que o usuário informe o nome de uma cidade e inicie uma busca.

- A busca deve aceitar texto digitado pelo usuário.
- O sistema deve apresentar cidades correspondentes quando houver mais de uma possibilidade.
- O sistema deve informar quando nenhuma cidade for encontrada.
- O sistema deve tratar entradas vazias ou inválidas sem realizar uma busca desnecessária.

### RF-02 — Selecionar cidade

O sistema deve permitir que o usuário selecione a cidade desejada entre os resultados da busca.

- A cidade selecionada deve ser identificada de forma clara.
- A seleção deve iniciar ou habilitar a consulta das informações meteorológicas daquela cidade.
- O sistema deve lidar com cidades de mesmo nome de forma que o usuário consiga diferenciá-las, por exemplo, exibindo país ou região.

### RF-03 — Exibir clima atual

O sistema deve exibir as condições meteorológicas atuais da cidade selecionada.

As informações devem incluir, no mínimo:

- temperatura atual;
- condição meteorológica resumida;
- identificação da cidade consultada.

### RF-04 — Exibir previsão de cinco dias

O sistema deve exibir a previsão meteorológica para os cinco dias seguintes à consulta.

Cada dia da previsão deve apresentar, no mínimo:

- identificação do dia;
- condição meteorológica resumida;
- temperatura máxima e mínima.

### RF-05 — Alternar unidade de temperatura

O sistema deve permitir alternar a exibição de temperaturas entre Celsius e Fahrenheit.

- A unidade atualmente selecionada deve ser visível.
- A alteração deve atualizar a temperatura atual e as temperaturas da previsão.
- A troca de unidade não deve exigir que o usuário refaça a busca.

### RF-06 — Informar estados da operação

O sistema deve comunicar o estado das consultas ao usuário.

- Durante uma busca ou carregamento, deve indicar que os dados estão sendo carregados.
- Em caso de falha, deve apresentar uma mensagem compreensível e orientar o usuário sobre a possibilidade de tentar novamente.
- Quando não houver cidade ou dados para exibir, deve apresentar um estado vazio apropriado.

## Requisitos Não-Funcionais

### RNF-01 — Responsividade

A aplicação deve funcionar em dispositivos móveis e em telas maiores, adaptando layout, controles e conteúdo sem perda de legibilidade ou funcionalidade.

### RNF-02 — Usabilidade

A jornada principal deve ser simples: buscar uma cidade, selecioná-la e visualizar os dados. Os controles e estados da interface devem ser compreensíveis sem instruções externas.

### RNF-03 — Acessibilidade

A interface deve ser utilizável por teclado e por tecnologias assistivas, com rótulos, nomes acessíveis e foco adequado nos campos, resultados, controles e mensagens de estado.

### RNF-04 — Desempenho percebido

A aplicação deve fornecer feedback imediato após ações do usuário e evitar que uma consulta em andamento bloqueie a interação de forma desnecessária.

### RNF-05 — Confiabilidade

Falhas de rede, respostas inválidas e ausência de resultados não devem causar quebra da aplicação. O usuário deve receber uma mensagem adequada e uma forma de recuperar a operação quando aplicável.

### RNF-06 — Consistência dos dados

A unidade selecionada deve ser aplicada de maneira consistente em todas as temperaturas exibidas na tela.

## Riscos

| Tipo | Risco | Probabilidade | Impacto | Mitigação |
| --- | --- | --- | --- | --- |
| Técnico | A fonte meteorológica fica indisponível, lenta ou sujeita a limite de uso. | Média | Alto | Implementar timeout, estados de carregamento e erro, retry controlado e monitoramento. |
| Técnico | A fonte retorna dados incompletos, incompatíveis ou em formato inesperado. | Média | Alto | Validar respostas, definir campos obrigatórios e tratar dados ausentes sem quebrar a interface. |
| Técnico | A aplicação realiza chamadas excessivas durante a busca. | Média | Alto | Usar busca explícita ou debounce, cancelar requisições anteriores e respeitar limites da API. |
| Técnico | A conversão ou o arredondamento de Celsius para Fahrenheit fica inconsistente. | Baixa | Médio | Centralizar a conversão em uma função testada e reutilizá-la em todas as temperaturas. |
| Técnico | Falhas de rede ou respostas parciais deixam a interface em estado inconsistente. | Média | Alto | Modelar estados de loading, sucesso, vazio e erro, com retry e preservação da última busca válida. |
| Técnico | O layout ou a interação não funciona adequadamente em telas pequenas. | Média | Alto | Adotar abordagem mobile-first e validar em diferentes larguras, navegadores e orientações. |
| Produto | Cidades com o mesmo nome levam à seleção do local errado. | Média | Alto | Exibir país, região ou coordenadas e exigir seleção explícita do resultado. |
| Produto | A definição de "previsão de cinco dias" não é compreendida de forma única. | Média | Médio | Confirmar se inclui hoje, registrar a regra na spec e refletir a decisão na interface. |
| Produto | A tela exibe informação demais e dificulta a consulta rápida. | Média | Alto | Priorizar clima atual e previsão, testar com usuários e organizar detalhes por hierarquia visual. |
| Produto | A busca não atende variações de nomes, acentos ou idiomas dos usuários. | Média | Médio | Definir escopo de localização, normalizar entradas quando possível e exibir mensagens úteis. |
| Produto | Requisitos adicionais como favoritos, histórico ou geolocalização fazem o escopo crescer. | Alta | Alto | Registrar o que está fora do escopo, priorizar o MVP e exigir decisão antes de incluir novas funções. |
| Produto | Usuários não confiam nos dados por falta de contexto sobre local, horário ou atualização. | Média | Alto | Exibir cidade selecionada, horário da consulta, unidade e origem ou momento de atualização dos dados. |
| Produto | A interface não é acessível para pessoas que usam teclado ou tecnologias assistivas. | Média | Alto | Definir critérios de acessibilidade, usar semântica adequada e testar teclado, foco e leitores de tela. |
| Produto | A aplicação não atende ao idioma, formato de data ou expectativa de unidade do público-alvo. | Média | Médio | Confirmar público e localização prioritários, adotar pt-BR e definir Celsius como padrão provisório. |

## Perguntas em Aberto

| Pergunta | Impacto se permanecer sem resposta |
| --- | --- |
| Quem é o público prioritário e qual problema de decisão a aplicação deve resolver primeiro? | Sem prioridade de público, o produto pode tentar atender necessidades incompatíveis e perder foco. |
| Qual é o objetivo de negócio e como será medido o sucesso do produto? | Impede definir métricas, priorizar funcionalidades e avaliar se a solução gera valor. |
| A aplicação será pública, interna ou restrita a um grupo de usuários? | Altera autenticação, suporte, segurança, distribuição e requisitos de disponibilidade. |
| Qual fonte de dados meteorológicos será utilizada? | Pode alterar a arquitetura, a qualidade dos dados, o custo e a viabilidade da integração. |
| A fonte exige autenticação, possui limites de uso ou impõe restrições de licença? | Pode exigir gerenciamento de credenciais, cache, monitoramento e mudanças de escopo. |
| A busca deve iniciar somente por ação explícita do usuário ou também com atraso após a digitação? | Afeta a experiência de busca, o número de requisições e o risco de atingir limites da API. |
| O sistema deve sugerir resultados enquanto o usuário digita? | Define a complexidade da interação, a latência esperada e o volume de chamadas externas. |
| O resultado da busca deve permitir seleção explícita ou o sistema deve escolher automaticamente o primeiro resultado? | A escolha automática pode consultar a localização errada e reduzir a confiança do usuário. |
| Como diferenciar cidades homônimas: país, estado/província, região, coordenadas ou combinação desses dados? | Sem essa regra, o usuário pode visualizar o clima de uma cidade diferente da desejada. |
| O sistema deve aceitar acentos, abreviações, erros de digitação e nomes em outros idiomas? | Afeta a taxa de sucesso da busca, a normalização do texto e a experiência internacional. |
| A previsão de cinco dias inclui o dia atual ou representa os cinco dias completos seguintes? | Afeta o contrato de dados, o conteúdo exibido e os critérios de aceite. |
| A previsão será diária ou deve incluir dados por hora? | Define o modelo de dados, a densidade da interface e o custo de processamento. |
| Quais dados devem ser exibidos além da temperatura e da condição meteorológica, como umidade, vento, pressão ou precipitação? | Pode alterar o modelo de dados, o espaço necessário e a prioridade das informações. |
| Como o sistema deve representar uma condição meteorológica desconhecida ou um dado ausente? | Evita exibir informação enganosa ou quebrar a tela quando a resposta for parcial. |
| A temperatura deve ser arredondada? Em caso afirmativo, para quantas casas decimais? | Pode gerar inconsistência visual e divergência entre testes e interface. |
| Qual unidade deve ser usada inicialmente: Celsius, Fahrenheit ou preferência do dispositivo/usuário? | Define o comportamento inicial e pode afetar a expectativa do público-alvo. |
| A escolha de unidade deve ser mantida entre consultas ou sessões? | Determina se será necessário persistir uma preferência do usuário. |
| A conversão deve ocorrer localmente ou a API deve ser consultada novamente na nova unidade? | Afeta latência, consumo da API, precisão e complexidade da implementação. |
| O produto precisa suportar favoritos, histórico, geolocalização ou consulta automática da localização atual? | Pode ampliar significativamente o escopo, a privacidade envolvida e a arquitetura. |
| A geolocalização será opcional? Como o sistema funcionará quando o usuário negar permissão? | Define o fluxo de fallback e evita bloquear a consulta manual. |
| O usuário poderá consultar apenas uma cidade por vez ou comparar várias cidades? | Altera o modelo de estado, o layout e a quantidade de chamadas à API. |
| Quais idiomas, formatos de data e convenções regionais devem ser suportados na primeira versão? | Afeta localização, conteúdo, formatação e cobertura de testes. |
| Qual deve ser o conteúdo inicial antes de o usuário fazer uma busca? | Define o estado vazio e a primeira impressão da aplicação. |
| Como devem funcionar os estados de carregamento, erro, timeout, ausência de resultados e resposta parcial? | Sem regras consistentes, a experiência pode ficar confusa e dificultar a recuperação. |
| Deve haver botão de tentar novamente e a última busca deve ser preservada após um erro? | Determina se o usuário precisará repetir trabalho e influencia a recuperação de falhas. |
| Existe uma meta de tempo de resposta ou disponibilidade para a aplicação? | Sem metas, não há base objetiva para avaliar desempenho e confiabilidade. |
| A aplicação precisa funcionar com conexão instável, cache ou modo offline? | Pode exigir armazenamento local, políticas de validade e tratamento adicional de dados antigos. |
| Quais navegadores, sistemas operacionais e versões de dispositivos móveis precisam ser suportados? | Define a matriz de compatibilidade e os testes de responsividade. |
| Quais requisitos mínimos de acessibilidade serão adotados? | Sem um nível definido, não há critério objetivo para validar teclado, leitores de tela e contraste. |
| É necessário armazenar, compartilhar ou enviar para terceiros dados de busca e localização do usuário? | Pode introduzir requisitos de privacidade, consentimento, retenção e conformidade. |
| Haverá analytics, publicidade ou outras integrações de terceiros? | Afeta privacidade, desempenho, consentimento e arquitetura da aplicação. |
| Quem será responsável por monitorar falhas da API, atualizar dependências e prestar suporte? | Sem ownership definido, incidentes e degradação do serviço podem permanecer sem tratamento. |
| Quais funcionalidades estão explicitamente fora do escopo da primeira versão? | Evita crescimento descontrolado do produto e conflitos de expectativa entre stakeholders. |

## Suposições

### Decisões provisórias para o treinamento

- A fonte de dados será a Open-Meteo, sem necessidade de chave de API.
- "Previsão de cinco dias" significa hoje e os quatro dias seguintes.
- A unidade padrão será Celsius.
- A aplicação não terá autenticação nem persistência em servidor.
- O idioma inicial da interface será português do Brasil.

- A primeira versão terá uma única cidade em foco por vez.
- O usuário informará uma cidade manualmente; geolocalização automática não faz parte do escopo inicial até confirmação.
- A aplicação utilizará uma fonte externa de dados meteorológicos com informações de clima atual e previsão diária.
- A fonte de dados fornecerá dados suficientes para identificar a cidade e montar a previsão de cinco dias.
- Celsius e Fahrenheit serão as únicas unidades de temperatura necessárias na primeira versão.
- A conversão de unidade será feita sem uma nova consulta à fonte de dados.
- O idioma principal da interface será português do Brasil.
- O sistema não exigirá criação de conta ou autenticação para a consulta básica.
- A aplicação será uma interface web responsiva, acessível por navegadores modernos em computadores e dispositivos móveis.
- Mensagens de erro e estados vazios serão exibidos na própria interface, sem depender de notificações externas.
- Favoritos, histórico, alertas meteorológicos, mapas e notificações estão fora do escopo inicial, salvo decisão posterior.
