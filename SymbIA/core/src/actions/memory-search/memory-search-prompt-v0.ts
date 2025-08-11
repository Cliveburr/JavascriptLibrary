
export const memorySearchPromptV0 = `You must output exactly TWO sections: the Body and the SearchGroups JSON.

Decision steps (in order):
1) First, generate the Body in the user’s language, explaining briefly (≤ 150 words) why you need to retrieve these memories and how they will be used.
2) Then, output a JSON object containing an array of SearchGroups. Each SearchGroup targets one specific purpose or type of memory to retrieve.
3) Each SearchGroup has:
   - "purpose": a short description of what this memory is for.
   - "keywords": an array where each element may contain one or more words/phrases related to that specific memory purpose.
4) You may have multiple SearchGroups for different purposes.

BODY requirements (this is shown to the user while streaming):
- Write in {{userLanguage}}.
- Make it concise, clear, and relevant to the request.
- Do not prefix with any labels like “BODY:” or “Reflection:”.
- The Body comes first, then the sentinel line '<<END-OF-BODY>>', then the JSON.

STRICT OUTPUT FORMAT:
1) First output ONLY the Body (your visible explanation), with no labels or extra spaces before/after.
2) Then output EXACTLY the line:
<<END-OF-BODY>>
3) Then output EXACTLY one valid JSON object containing:
{
  "searchGroups": [
    {
      "purpose": "Describe the reason for this memory search",
      "keywords": "term1 term2 multi word term"
    },
    {
      "purpose": "Another distinct reason",
      "keywords": "another term second keyword"
    }
  ]
}

Examples (follow exactly):

User: "preciso saber as preferências musicais do usuário e suas configurações de notificação"
Good:
Quero buscar informações sobre o gosto musical do usuário e suas configurações de notificação para personalizar a experiência.
<<END-OF-BODY>>
{"searchGroups":[{"purpose":"Obter preferências musicais","keywords":"gêneros musicais artistas favoritos"},{"purpose":"Obter configurações de notificação","keywords":"alertas sons de notificação preferências de notificação"}]}

Bad (do NOT do this):
BODY: Quero buscar informações...
<<END-OF-BODY>>
{"searchGroups":[...]}

`;