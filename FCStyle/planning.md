Um projeto de framewok CSS em React para ser utilizado por outros projetos React.
O projeto em SCSS com variaveis para tudo com possibilidade de alterar no browser.

\project - Pasta para conter o projeto
\editor - Um projeto em React para customizar todas as variaveis online e gerar um json para usar como theme

Estruturas do project:
\project
    \grid
        Column - Component que define o display flex para colunas, com uso da variavel global display-gap para definir o gap e propriedade para inverse 
        Rom - Component que define o display flex para rows, com uso da variavel global display-gap para definir o gap e propriedade para inverse 
    \components
        Button - Component que define o propriedades para o <button />
    \form
        Input - Component que define as propriedades para o <input />, pode receber um ValidatorControl ou um texto, adicionar bidings para mudar a cor da borda conforme o status do ValidatorControl
        InputField - Component que define label e exibe validators messages
    \validator
        IValidator - Interface que define um validador conforme abaixo
        ValidatorControl - Classe que vai agrupar um conjunto de IValidator para validar quando precisar, assim como parents, child e parent de outros ValidatorControl para sinalizar a validação


\editor
    \grid
        Column - Uma pagina que exibe grids exemplo com todas possibilidades de configuração
        Rom - Uma pagina que exibe grids exemplo com todas possibilidades de configuração
    \components
        Button - Uma pagina que exibe Buttons exemplo com todas possibilidades de configuração
    \form
        Input - Uma pagina que exibe Buttons exemplo com todas possibilidades de configuração
        InputField - Uma pagina que exibe Buttons exemplo com todas possibilidades de configuração

Exemplo de uso:
<Column>
    <Button Primary>This is the primary button!</Button>
    <Button Second>This is the second button!</Button>
</Column>


Validators

export enum ValidationStatus = Pristine | Valid | Invalid;

export interface IValidator {
    validator?: (value: any) => ValidationStatus;
    asyncValidator?: (value: any) => ValidationStatus;
    message?: string;
}