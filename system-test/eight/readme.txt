- o shadow-dom vai ser objetos javascript
Node {
    tag:
    atributes:
    childrens:
    events:
}

- ações no shadow-dom
    - replace = para trocar um node por outro
    - refresh = para forçar uma checagem do shadow-dom com o dom

- uma view é um Node, porém com eventos especiais

- o state vai ser persistido com classes especiais para controlar seus objetos
- toda data de um Node pode estar no state e vai ser um tipo de Proxy
    - toda mudança de data vai disparar um evento



- definir enviroments - dev, prod
    - define resource loaders
    - definir os projetos
        definir builders e watchers

tool
web



- client
    quando receber um request, ajustar o index.html, amazernar em cache e retonar ao client
    o client vai fazer o request do pacote inicial
    então a conexão ws será estabelecida
    então a primeira navegação será realizada pelo ws