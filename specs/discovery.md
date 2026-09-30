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

- **Pessoa planejando a rotina:** quer saber as condições atuais para decidir o que vestir ou como se deslocar.
- **Viajante:** quer consultar a previsão dos próximos dias para planejar uma viagem ou atividade.
- **Usuário em dispositivo móvel:** precisa consultar a previsão rapidamente em uma tela pequena, possivelmente fora de casa.

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

| Risco | Probabilidade | Impacto | Mitigação |
| --- | --- | --- | --- |
| Cidades com o mesmo nome levam à seleção do local errado. | Média | Alto | Exibir país, região ou coordenadas nos resultados e exigir seleção explícita. |
| Falha, limite de uso ou lentidão da fonte meteorológica impede a consulta. | Média | Alto | Implementar estados de carregamento e erro, timeout, retry e mensagens claras. |
| A fonte retorna dados incompletos ou em formato inesperado. | Média | Alto | Validar a resposta, definir campos obrigatórios e tratar dados ausentes sem quebrar a interface. |
| A regra de "previsão de cinco dias" é interpretada de formas diferentes. | Média | Médio | Confirmar se o período inclui hoje e registrar a decisão na especificação. |
| Conversão ou arredondamento inconsistente reduz a confiança nos valores. | Baixa | Médio | Centralizar a conversão e aplicar a mesma regra à condição atual e à previsão. |
| O volume de informações prejudica a leitura em telas pequenas. | Média | Alto | Adotar layout responsivo mobile-first e validar em diferentes larguras de tela. |
| Datas, nomes de cidades e condições meteorológicas aparecem em formato inadequado ao público brasileiro. | Média | Médio | Definir idioma, formato de data e regras de localização antes da implementação. |

## Perguntas em Aberto

| Pergunta | Impacto se permanecer sem resposta |
| --- | --- |
| Qual fonte de dados meteorológicos será utilizada e ela exige autenticação ou possui limites de uso? | Pode alterar a arquitetura, o custo e a viabilidade da integração. |
| A busca deve iniciar somente por ação explícita do usuário ou também com atraso após a digitação? | Afeta a experiência de busca, o número de requisições e o risco de atingir limites da API. |
| O resultado da busca deve permitir selecionar uma cidade ou o sistema deve escolher automaticamente o primeiro resultado? | Pode causar consultas para a localização errada e afetar a usabilidade. |
| Como diferenciar cidades homônimas: país, estado/província, região, coordenadas ou combinação desses dados? | Sem essa regra, o usuário pode visualizar o clima de uma cidade diferente da desejada. |
| A previsão de cinco dias inclui o dia atual ou representa os cinco dias completos seguintes? | Afeta o contrato de dados, o conteúdo exibido e os critérios de aceite. |
| Quais dados devem ser exibidos além da temperatura e da condição meteorológica, como umidade, vento, pressão ou precipitação? | Pode alterar o modelo de dados e o espaço necessário na interface. |
| A temperatura deve ser arredondada? Em caso afirmativo, para quantas casas decimais? | Pode gerar inconsistência visual e divergência entre testes e interface. |
| Qual unidade deve ser usada inicialmente: Celsius ou a preferência do dispositivo/usuário? | Define o comportamento inicial e pode afetar a expectativa do público-alvo. |
| A escolha de unidade deve ser mantida entre consultas ou sessões? | Determina se será necessário persistir uma preferência do usuário. |
| O produto precisa suportar favoritos, histórico, geolocalização ou consulta automática da localização atual? | Pode ampliar significativamente o escopo, a privacidade envolvida e a arquitetura. |
| Quais idiomas e formatos de data devem ser suportados na primeira versão? | Afeta localização, conteúdo, formatação e cobertura de testes. |
| Existe uma meta de tempo de resposta ou disponibilidade para a aplicação? | Sem metas, não há base objetiva para avaliar desempenho e confiabilidade. |
| Quais navegadores e versões de dispositivos móveis precisam ser suportados? | Define a matriz de compatibilidade e os testes de responsividade. |
| É necessário armazenar ou compartilhar dados de busca e localização do usuário? | Pode introduzir requisitos de privacidade, consentimento e persistência. |

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
