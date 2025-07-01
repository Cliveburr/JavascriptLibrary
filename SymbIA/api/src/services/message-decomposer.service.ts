import { DecomposedItem, MessageDecomposition, LLMProvider } from '../interfaces/llm.interface';
import { v4 as uuidv4 } from 'uuid';
import { LLMManager } from './llm.service';

export class MessageDecomposer {

  constructor(
    private llmManager: LLMManager
  ) {
  }
  
  /**
   * Decompõe uma mensagem do usuário em intenções, contextos e ações usando LLM
   */
  public async decomposeMessage(message: string): Promise<MessageDecomposition> {
    console.log('🧠 Starting LLM decomposition for message:', message.substring(0, 100) + '...');
    
    const provider = await this.llmManager.getAvailableProvider();
    if (!provider) {
      throw new Error('No LLM provider available');
    }

    const prompt = this.buildDecompositionPrompt(message);
    console.log('📝 Generated prompt for LLM');
    
    try {
      console.log('⏳ Calling LLM...');
      const llmResponse = await Promise.race([
        provider.generateSingleResponse(prompt),
        new Promise<string>((_, reject) => 
          setTimeout(() => reject(new Error('LLM timeout after 1 minute')), 60000)
        )
      ]);
      
      console.log('✅ LLM response received:', llmResponse.substring(0, 200) + '...');
      
      // Tentar extrair JSON da resposta do LLM
      const jsonMatch = llmResponse.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        console.log('📋 JSON array found in response');
        const parsedResponse = JSON.parse(jsonMatch[0]);
        const items = this.processLLMResponse(parsedResponse);
        console.log(`🎯 Successfully processed ${items.length} items from LLM`);
        
        return {
          originalMessage: message,
          decomposedItems: items,
          timestamp: new Date().toISOString(),
          totalItems: items.length
        };
      } else {
        throw new Error('No valid JSON array found in LLM response');
      }
    } catch (parseError) {
      console.error('❌ Failed to parse LLM response:', parseError);
      throw new Error(`LLM decomposition failed: ${parseError}`);
    }
  }

  /**
   * Constrói o prompt para o LLM decompor a mensagem
   */
  private buildDecompositionPrompt(message: string): string {
    return `Você é um agente que deve decompor uma mensagem em itens independentes para posterior processamento.

INSTRUÇÕES:
- Para cada item, isole uma ação clara (verbo + alvo).
- Separe informações contextuais relevantes como itens separados, quando necessário.
- Não repita partes entre itens.
- Mantenha os itens autônomos e claros para serem executados individualmente.

IMPORTANTE:
Os exemplos abaixo são apenas ilustrações. A mensagem real vem depois.

EXEMPLO:
Entrada: "agende para desligar as luzes daqui 10min"  
Saída:
[
  "agendar ação para 10 minutos no futuro",
  "executar ação: desligar luzes"
]
---
Entrada: "qual é a url da company X na develop?"  
Saída:
[
  "buscar url",
  "contexto: company X no ambiente develop"
]
---
Entrada: "gere um gráfico dos acessos semanais e envie no meu email"  
Saída:
[
  "gerar gráfico de acessos semanais",
  "enviar gráfico por email"
]
--- fim dos exemplos ---

Agora analise a MENSAGEM REAL abaixo:

MENSAGEM:
"""${message}"""

Retorne apenas uma lista JSON de strings:
["item1", "item2", "item3"]

JSON:`;
  }

  /**
   * Processa a resposta do LLM e converte para DecomposedItem[]
   */
  private processLLMResponse(llmResponse: any): DecomposedItem[] {
    console.log('🔍 Processing LLM response:', JSON.stringify(llmResponse, null, 2));
    const items: DecomposedItem[] = [];
    
    if (Array.isArray(llmResponse)) {
      console.log(`📝 Found ${llmResponse.length} items in response array`);
      llmResponse.forEach((content: any, index: number) => {
        console.log(`Processing item ${index}:`, content);
        if (typeof content === 'string' && content.trim().length > 0) {
          const cleanContent = content.trim();
          items.push({
            id: uuidv4(),
            type: 'context', // Tipo padrão já que removemos a categorização
            content: cleanContent,
            priority: 3, // Prioridade padrão
            dependencies: undefined
          });
        } else {
          console.log(`⚠️ Skipping invalid item ${index}: not a valid string`);
        }
      });
    } else {
      console.log('❌ Response is not an array');
      // Tentativa de fallback para formato antigo ou outros formatos
      if (llmResponse.items && Array.isArray(llmResponse.items)) {
        console.log('🔄 Attempting fallback to old format...');
        llmResponse.items.forEach((item: any, index: number) => {
          if (item.content && typeof item.content === 'string') {
            items.push({
              id: uuidv4(),
              type: 'context',
              content: item.content.trim(),
              priority: 3,
              dependencies: undefined
            });
          }
        });
      } else if (typeof llmResponse === 'string') {
        console.log('🔄 Attempting to process single string...');
        items.push({
          id: uuidv4(),
          type: 'context',
          content: llmResponse.trim(),
          priority: 3,
          dependencies: undefined
        });
      }
    }
    
    console.log(`✅ Processed ${items.length} valid items`);
    return items;
  }

  /**
   * Valida e normaliza o tipo do item
   */
  private validateItemType(type: string): DecomposedItem['type'] {
    const validTypes: DecomposedItem['type'][] = ['instruction', 'action', 'question', 'intention', 'context'];
    const normalizedType = type.toLowerCase() as DecomposedItem['type'];
    return validTypes.includes(normalizedType) ? normalizedType : 'context';
  }

  /**
   * Valida e normaliza a prioridade
   */
  private validatePriority(priority: any): number {
    const num = parseInt(priority);
    return (num >= 1 && num <= 5) ? num : 3;
  }
}
