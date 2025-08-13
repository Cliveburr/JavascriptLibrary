
Layout da Tela:

Utilizando o component TwoAreaLayout
    # Tab's renderizada na area left do component
        - Tab Memory
            - Botão add
            - Lista das memories
                - Cada item um menu dropdown para ações da memory
                    - Deletar
        - Tab Chats
            - Botão add
            - Se for debug ativo, mostrar botão para ChatDebug
            - Lista dos chats com divisão por por dia

    # Princial
        - Full width, com apenas rolavem vertical se precisar
        - No topo do canto esquerdo, um box seletor do lado esquerdo superior para selecionar o set de modelos llm a ser usado
        - 2 Modo de exibição, com chat selecionado e sem chat selecionado
            - Com chat selecionado
                - Conteudo do chat selecionado
                - Abaixo o campo de texto para o usuário interagir com o chat, com o botão enviar dinamico, mudando para "pause" e "stop" quando estiver rodando
            - Sem chat selecionado
                - Campo de texto para o usuário enviar a primeira mensagem centralizada

