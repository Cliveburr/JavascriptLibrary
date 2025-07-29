
# Detalhamentos do comportamento geral do principal chat

Formato JSON das mesages
{
	"chat-history": boolean,   // Determina se a mensagem sera usada como contexto nas chamadas LLM,
	"modal":                   // Determina como o content será exibido ao usuário
		"text"                 // Modo plain text
		| "text-for-replace"   // Modo plain text que será substituido pela proxima mensagem
	"role": "user" | "system" | "assistant",    // Autor da mensagem para o LLM
	"content": any             // Conteudo da mensagem que pode variar conforme o modal
}

Formato JSON das memory no banco de vetor
{
	"nosqlId:" id
}

Formato JSON das memory no banco nosql
{
	"_id": id                  // Id nosql do banco
	"memoriesId": id           // Relação a collection "memories"
	"vectorIds": [ ids ]       // Relação dos ids do banco de vetor que fazem referencia a essa memory
	"type":                    // Determina oque contem na memoria
		"text",                // Apenas texto
	"content": any,            // Conteudo da memory que pode variar conforme o type
}

## Usuário manda uma mensagem
	Mensagem do usuário: { "chat-history": true, "modal": "text", "role": "user", "content": {mensagem} }
	- Entra no Loop de pensamento da iteração

## Loop de pensamento da iteração - thought cycle
	- Chamar o mecanismo de decisão da proxima ação
		Passar a mensagem original
		Passar historico de mensagens do chat marcados com a flag "chat-history"
		Passar ações possiveis de se tomar
	- Executar a ação

## Mecanismo de decisão:
	- Enviar para o usuario a mensagem: { "chat-history": false, "modal": "text-for-replace", "content": "Thiking..." }
	- Chamar o LLM no modo "reasoningHeavy" com stream off para responder somente com o nome da proxima ação, todas demais informações vão ser extraida posteriormente
		Passar a mensagem original
		Passar historico de mensagens do chat marcados com a flag "chat-history"
		Passar ações possiveis de se tomar e nome certo de cada ação que ele deve responder
	
## Ações disponiveis: (mais será criada futuramente, fazer de forma dinamica para ser facil criar novas ações e desabilitar ações)
	- Finalizar
		Quando usar: Após analisar todo histórico que engloba a mensagem original, respostas, perguntas e ações realizadas (tudo no formato das mensagnes), decidir que nenhuma das outras ações disponíveis é valida
		- Chamar o LLM no modo "chat" com stream on para enviar a mensagem ao usuário: { "chat-history": false, "modal": "text", "content": {stream} }, com um texto curto explicado oque foi executado
		- Finaliza esse ciclo
	- Question
		Quando usar: Após analisar todo histórico (igual do Finalizar) e após ter tentado buscar alguma memoria e não ter encontrado ou ter tentado usar alguma ferramenta para buscar a informação que precisa e não ter conseguido e deicidir que a melhor escolha é questionar ao usuário sobre
		- Chamar o LLM no modo "chat" com stream on para enviar a mensagem ao usuário: { "chat-history": true, "modal": "text", "role": "assistant", "content": {stream} }, com um texto curto questionando sobre a informação que falta
		- Finaliza esse ciclo
	- MemorySearch
		Quando usar: Após analisar todo histórico (igual do Finalizar) e decidir que precisa buscar algum tipo de informação para tomar outra ação, pode ser algo que o usuário esteja perguntando, algo que precise antes de usar uma ferramenta, ou algo que não faz ideia doque seja
		- Enviar para o usuario a mensagem: { "chat-history": false, "modal": "text-for-replace", "content": "Buscando por memorias..." }
		- Chamar o LLM no modo "reasoning" com stream off para gerar uma lista de pequenos contextos isolados das informações que quer procurar, levar em consideração se o contexto isolado das informações é referente a alguma memoria já recuperada previamente, responder no formato JSON lista de strings [ "informação usuário", "senha site aliexpress" ]
		- Enviar para o usuario a mensagem: { "chat-history": false, "modal": "text-for-replace", "content": "Buscando por memorias, formantado..." }
		- Chamar o LLM no modo "embedding" para gerar uma lista de vetor para cada item da lista retornada anteriormente
		- Enviar para o usuario a mensagem: { "chat-history": false, "modal": "text-for-replace", "content": "Buscando por memorias, pesquisando" }
		- Para cada item da lista, buscar no banco vetorial, e depois buscar no banco nosql os ID's retornado dos bancos vetoriais, gerar a seguinte message para cada memory recuperada { "chat-history": true, "modal": "memory", "content": {memory} }
		- Chamar o LLM no modo "chat" com stream on para enviar a mensagem ao usuário: { "chat-history": true, "modal": "text", "role": "assistant", "content": {stream} }, com um texto curto explicando oque acabou de buscar na memoria
	- MemorySave
		Quando usar: Após analisar todo histórico (igual do Finalizar) e ficar de forma bem explicita que tem informações que precisa ser salva
		- Enviar para o usuario a mensagem: { "chat-history": false, "modal": "text-for-replace", "content": "Salvando memorias..." }
		- Chamar o LLM no modo "reasoning" com stream off para gerar uma lista das memorias que precisa ser salva, vincular a memoria, seja puro texto, json ou outro a pequenos contextos isolados que vão funcionar como chaves de procura dessas informações, responder no formato JSON { "type": "text", "content": "123456", "bindings": [ "informação usuário", "senha site aliexpress" ] }
		- Enviar para o usuario a mensagem: { "chat-history": false, "modal": "text-for-replace", "content": "Salvando memorias, formantado..." }
		- Chamar o LLM no modo "embedding" para gerar uma lista de vetor para cada item da lista retornada anteriormente
		- Enviar para o usuario a mensagem: { "chat-history": false, "modal": "text-for-replace", "content": "Salvando memorias, gravando" }
		- Para cada item da lista, criar um registro no banco nosql e demais registro no banco vetorial apontando para o ID do banco nosql, apos atualizar o nosql com os registros criados no banco vetorial
		- Chamar o LLM no modo "chat" com stream on para enviar a mensagem ao usuário: { "chat-history": true, "modal": "text", "role": "assistant", "content": {stream} }, com um texto curto explicando oque acabou de salvar na memoria
	- MemoryUpdate
		Quando Usar: Após analisar todo histórico (igual do Finalizar) e verificar que memorias já carregadas anteriormente precisam ter o conteudo atualizado
		- Enviar para o usuario a mensagem: { "chat-history": false, "modal": "text-for-replace", "content": "Atualizando memorias..." }
		- Chamar o LLM no modo "reasoning" com stream off para gerar uma lista das memorias que precisa ser atualizadas, vincular o id da memoria para atualizar ao seu novo conteudo, seja puro texto, json ou outro, responder no formato JSON { "_id": "nosql", "content": "123456" }
		- Enviar para o usuario a mensagem: { "chat-history": false, "modal": "text-for-replace", "content": "Atualizando memorias, gravando" }
		- Para cada item da lista, fazer update do registro no banco nosql com o novo conteudo
		- Chamar o LLM no modo "chat" com stream on para enviar a mensagem ao usuário: { "chat-history": true, "modal": "text", "role": "assistant", "content": {stream} }, com um texto curto explicando oque acabou de atualizar
	- MemoryDelete
		Quando Usar: Após analisar todo histórico (igual do Finalizar) e ficar explicitamente claro que o usuário está solicitando para apagar alguma memoria 
		- Enviar para o usuario a mensagem: { "chat-history": false, "modal": "text-for-replace", "content": "Apagando memorias..." }
		- Chamar o LLM no modo "reasoning" com stream off para gerar uma lista dos ids do banco nosql das memorias a ser deletadas, responder no formato JSON [ "nosqlids", "nosqlids" ]
		- Enviar para o usuario a mensagem: { "chat-history": false, "modal": "text-for-replace", "content": "Apagando memorias, deletando" }
		- Para cada item da lista, fazer delete no banco nosql e demais registro no banco vetorial
		- Chamar o LLM no modo "chat" com stream on para enviar a mensagem ao usuário: { "chat-history": true, "modal": "text", "role": "assistant", "content": {stream} }, com um texto curto explicando oque acabou de deletar
	- Usar ferramenta
		## TODO - não fazer por enquanto
