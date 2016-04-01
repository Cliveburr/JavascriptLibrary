# MSC

Assembly
    Asserts
        Javascript
        Html
        Css
    Code
    ObjectTree

Server
    Open Assemblies
    Session Instance
        ObjectTree
        Open Assembly
        Return Asserts

    Session Development
        Join
        ObjectTree
            Create
            Update
            Test
            Remove
        Create/Open Assembly
            Create/Open Code
                Type
                Test
                    Tokenizer
                    Link
                    ObjectTree
                Update
                    Tokenizer
                    Link
                    ObjectTree
                    SyntaxCheck
                    CodeGenerate
        Return Asserts

Client Instance
    Connect
        Request Main Asserts
        ?Open Websocket
    Request Asserts
        ?Update Assert

Client Develpment
    Connect
        Open Websocket
    Request Asserts
        Update Assert
    Test Code
    Write Code










Assembly Sample
    asserts
        js
        html
            /index.html
        css
    code
        js
            /index.js
    ObjectTree