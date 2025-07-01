

- memory
    - criar memory
    - ler memory
    - editar memory
    - excluir memory



# request do usuário
    - usar llm para separar as ações
    - usar llm para criar embedding das ações
    - buscar no qdrant dados sobre os embedding
    - usar llm para processar as ações junto com o resultado da busca
        organizando na sequencia de execução
        chamado ferramentas necessárias


## Primeiro Prompt
Você é um extrator de ações. Sua função é analisar o objetivo do usuário e extrair uma lista de subtarefas independentes que podem ser resolvidas separadamente.

Formato de saída: uma lista JSON de strings, onde cada string é uma ação clara.

Exemplo:
Input: "Quero saber os produtos mais vendidos e depois verificar o que falam sobre eles online"
Output:
[
  "Listar os produtos mais vendidos",
  "Buscar o que falam sobre esses produtos na internet"
]

Agora extraia ações do seguinte objetivo:
"${userPrompt}"


## Segundo Prompt
Você é um planejador inteligente. Sua função é organizar um plano de execução baseado nas informações do input:

Input:
{
    "userPrompt": "O prompt inicial do usuário",
    "knowledge":
    [
        "informações diversas sobre o prompt inicial"
    ],
    "action":
    [
        {
            "name": "um nome descritivo da ação",
            "type": QUERY,
            "observation": ""
        }
    ]
}

Output:
[
    {

    }
]



# Exemplo 1
    User: vc sabe fazer pesquisas na internet?
    LLM: divide em açãos, Primeiro Prompt
    [
        "Verificar se o agente é capaz de fazer pesquisas na internet"
    ]
    LLM: criar embedding
    Qdrant: procurar pelos embedding
    []
    LLM: organiza o plano de execução, Segundo Prompt
    {
        "userPrompt": "vc sabe fazer pesquisas na internet?",
        "knowledge": [],
        "action": []
    }
    Nenhuma ação encontrada, retornar algo como não entendeu

