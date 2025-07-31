



Style:
    - Futuristas
    - Cores neutras
    - Paddings e Margins curtissimos priorizando o maximo de informação na tela
    - Fonte menor que o padrão

Comportamento geral:
    - Ao abrir, lembrar qual a ultima memories e chat usados e selecionar eles
    - Ao selecionar uma memorie carregar os chats relacionado a memories
    - Ao selecionar uma memorie carregar o conteudo do chat
    - Se não tiver nenhum chat na memories, exibir o campo de texto para iniciar um novo chat alinhado horizontalmente
    - Ao clicar no botão para iniciar um novo chat, não precisa perguntar nome, limpe o campo de chat e exibir o campo de texto para iniciar um novo chat alinhado horizontalmente
    - Se estiver no modo de iniciar novo chat com o campo de texto no alinhado horizontalmente e o usuario enviar a primeira message, dar inicio ao thought-cycle normalmente, e somente após o termino do primeiro thought-cycle, chamar o LLM no modo "reasoning" pedindo para criar um titulo para esse chat de no maximo 60 caracteres, após isso atualize a tela com o nome do chat correto


Tela divida em 2 partes verticalmente
    # Parte da esquerda
        - No topo o logo do projeto em /assets/logo.png com href para "/"
        - Abaixo o portrait do usuario seguido do username, em formato de dropdown
            - Dropdown butons
                Configuração do perfil
                ---
                Logout
        - Abaixo as memories do usuário, um botão de add, e em lista cada memories em formato de button que ao ser clicado seleciona a memories e carrega abaixo os chats relacionados a essa memories, e botão discreto para remover
        - Abaixo todos os chats relacionados a memorie selecionada, ao clicar carregar o conteudo do chat
    # Parte da direita
        - No topo do canto esquerdo, um box seletor do lado esquerdo superior para selecionar o set de modelos llm a ser usado
        - Abaixo o conteudo do chat carregado, exibindo os diversos modais possiveis, texto-mensagem, texto-info, texto-erro, formularios, graficos, links variados e outros..
        - Abaixo o campo de texto para o usuário interagir com o chat, com o botão enviar dinamico, mudando para "pause" e "stop" quando estiver rodando
