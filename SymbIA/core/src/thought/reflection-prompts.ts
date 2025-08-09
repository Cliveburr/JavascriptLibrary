
/*
Before change do Body JSON prompt schema

private buildReflectionPrompt(messages: Message[], actions: ActionHandler[]): Array<LlmRequestMessage> {
        const history = messages
            .map(msg => parseMessageForPrompt(msg));

        if (history[history.length - 1]?.role != 'user') {
            history.push({ role: 'user', content: 'Anwser the system!' });
        }

        const systemPrompt = `You are an AI assistant that must reflect on the user's message and select exactly one action from the list below.

Available Actions

${actions.map(a => `- ${a.name}
  ${a.whenToUse}`).join('\n')}

CRUCIAL RULES:
1. Even if you think you already know the answer, you MUST choose MemorySearch if there is ANY chance memory could help.
2. If you skip MemorySearch when it is applicable, your answer will be considered WRONG.
3. Output exactly three XML-like tags in this exact order:
   <title>...</title>
   <reflection>...</reflection>
   <action>...</action>
4. Do not output anything else, no explanations, no markdown.`;

        // Obey **exactly** this output format:
        // ##Title: a short sentence (≤ 10 words) about the reflection
        // ##Reflection: a concise sentence (≤ 150 words) explaining why this action is best
        // ##Action: EXACT action name here`;

        // <title>a short sentence (≤ 10 words) about the reflection</title>
        // <reflection>a concise sentence (≤ 150 words) explaining why this action is best</reflection>
        // <action>EXACT action name here</action>`;

        return [
            { role: 'system', content: systemPrompt },
            ...history,
        ];
    }
*/

export const reflectionPromptV1 = `You must choose exactly ONE action: Reply or MemorySearch.

Decision steps (in order):
1) If there exists a memory_search_result for the same request and every target is resolved (found=true|false|error), choose Reply.
2) If this is the first pass and the request may depend on stored information, choose MemorySearch to determine what to search.
3) If there are unresolved targets for the same request that have not been searched yet, choose MemorySearch.
4) Otherwise, if memory might help, choose MemorySearch. If not, choose Reply.

BODY requirements (this is shown to the user while streaming):
- Write your reflection that leads to the decision (brief, clear, user-friendly).
- Explain the key cues you used (e.g., “the request asks for user-specific data, so I’ll search memory first”).
- No labels like “BODY:”, “Reasoning:”, “Reflection:”. Start immediately with the content.
- Keep it concise (1–3 short sentences or 2–4 bullet points).

STRICT OUTPUT FORMAT:
1) First output ONLY the BODY (your visible reflection). Do NOT prefix with any label.
2) Then output EXACTLY the line:
<<END-OF-BODY>>
3) Then output EXACTLY ONE single line containing ONLY:
{"action":"Reply"}  or  {"action":"MemorySearch"}

Compliance checks:
- The VERY FIRST characters of your output must be the BODY content (not a label).
- No markdown fences.
- No extra lines or spaces before/after the JSON line.
- The BODY can be any length; the JSON must be a single line and valid.

Examples (follow exactly):

User: "qual é o meu endereço?"
Good:
O pedido depende de dados pessoais possivelmente armazenados. Vou primeiro consultar a memória para verificar se já tenho essa informação.
<<END-OF-BODY>>
{"action":"MemorySearch"}

Bad (do NOT do this):
BODY: O pedido depende de dados pessoais possivelmente armazenados...
<<END-OF-BODY>>
{"action":"MemorySearch"}`;
