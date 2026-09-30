# Discovery — Aplicação de Previsão do Tempo

## Contexto

A empresa solicitou uma aplicação de previsão do tempo para permitir que usuários consultem rapidamente as condições meteorológicas de uma cidade. A experiência deve atender tanto usuários em computadores quanto em dispositivos móveis.

O produto inicial deve cobrir quatro necessidades principais:

- localizar uma cidade;
- consultar o clima atual;
- consultar a previsão dos próximos cinco dias;
- visualizar temperaturas em Celsius ou Fahrenheit.

O principal valor esperado é oferecer uma consulta simples, clara e responsiva, sem exigir conhecimento técnico ou configuração complexa do usuário.

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

- **Ambiguidade na busca:** cidades com o mesmo nome podem levar o usuário a selecionar o local errado. A apresentação de país, região ou coordenadas reduz esse risco.
- **Indisponibilidade da fonte de dados:** falhas ou lentidão do serviço meteorológico podem impedir a consulta. A aplicação precisa de estados de erro, carregamento e nova tentativa.
- **Dados meteorológicos incompletos:** a fonte pode não retornar todos os campos esperados. O produto deve definir quais campos são obrigatórios e como indicar dados ausentes.
- **Interpretação de "cinco dias":** pode haver diferença entre os cinco dias seguintes e um período que inclui o dia atual. Essa regra precisa ser confirmada antes da especificação detalhada.
- **Conversão incorreta de unidade:** arredondamento ou conversão inconsistente pode reduzir a confiança do usuário. A regra de conversão deve ser única e aplicada a todas as temperaturas.
- **Uso em telas pequenas:** excesso de informações pode prejudicar leitura e navegação em dispositivos móveis. O layout deve priorizar a consulta principal e testar diferentes larguras de tela.
- **Localização e linguagem:** nomes de cidades, datas e condições meteorológicas podem exigir regras de idioma e formato regional ainda não definidas.

## Perguntas em Aberto

1. Qual fonte de dados meteorológicos será utilizada e ela exige autenticação ou possui limites de uso?
2. A busca deve iniciar somente por ação explícita do usuário ou também com atraso após a digitação?
3. O resultado da busca deve permitir selecionar uma cidade ou o sistema deve escolher automaticamente o primeiro resultado?
4. Como diferenciar cidades homônimas: país, estado/província, região, coordenadas ou combinação desses dados?
5. A previsão de cinco dias inclui o dia atual ou representa os cinco dias completos seguintes?
6. Quais dados devem ser exibidos além da temperatura e da condição meteorológica, como umidade, vento, pressão ou precipitação?
7. A temperatura deve ser arredondada? Em caso afirmativo, para quantas casas decimais?
8. Qual unidade deve ser usada inicialmente: Celsius ou a preferência do dispositivo/usuário?
9. A escolha de unidade deve ser mantida entre consultas ou sessões?
10. O produto precisa suportar favoritos, histórico, geolocalização ou consulta automática da localização atual?
11. Quais idiomas e formatos de data devem ser suportados na primeira versão?
12. Existe uma meta de tempo de resposta ou disponibilidade para a aplicação?
13. Quais navegadores e versões de dispositivos móveis precisam ser suportados?
14. É necessário armazenar ou compartilhar dados de busca e localização do usuário?

## Suposições

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
