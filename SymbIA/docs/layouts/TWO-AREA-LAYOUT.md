
Component de layout utilizado por diversas paginas, TwoAreaLayout

- Tela divida em 2 partes verticalmente
- Divisor em modo drag-n-move para redimensionar as partes da esquerda e direita, salvando o status no browser

# Parte da esquerda
    - Full width, com apenas rolavem vertical se precisar
    - No topo o logo do projeto em /assets/logo.png com href para "/"
    - Abaixo o portrait do usuario seguido do username, em formato de dropdown
        - Dropdown butons
            Configuração do perfil
            ---
            Logout
    - Abaixo um Tabs
        - Tab Menu, essa tab vai ser fixa, sempre a mesma
            - Link para dashboard
            - Link para style
            - Link para Prompts
        - Proximas tab vai ser dinamica, cada pagina que utilizar esse layout pode adicionar Tab aqui passando o texto e o fragmento para ser renderizados na tab
    
# Parte da direita
    - Main area para redinzeriar o principal da pagina client