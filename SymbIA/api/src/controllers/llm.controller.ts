import type { Request, Response } from 'express';
import { LlmGateway, generateChatTitle } from '@symbia/core';
import { LlmSetService } from '@symbia/core';

async function getLlmSetForChat(llmSetService: LlmSetService, llmSetId?: string) {
    if (llmSetId) {
        const requestedSet = await llmSetService.getLlmSetById(llmSetId);
        if (requestedSet && (requestedSet.models.chat || requestedSet.models.reasoning)) {
            return requestedSet;
        }
    }
    const allSets = await llmSetService.loadLlmSets();
    return allSets.find(set => set.models.chat || set.models.reasoning) || null;
}

export class LlmController {
    constructor(
        private llmGateway: LlmGateway,
        private llmSetService: LlmSetService
    ) { }

    async generateTitle(req: Request, res: Response): Promise<void> {
        const { firstMessage, llmSetId } = req.body;
        if (!firstMessage || typeof firstMessage !== 'string') {
            res.status(400).json({ error: 'Mensagem inicial ausente ou inválida' });
            return;
        }
        try {
            // Recupera configuração do modelo LLM igual ao thought-cycle.service.ts
            const llmSetConfig = await getLlmSetForChat(this.llmSetService, llmSetId);
            if (!llmSetConfig) {
                res.status(404).json({ error: 'Nenhum modelo LLM disponível' });
                return;
            }
            // Monta mensagem para o LLM
            const messages = [
                { role: 'user', content: firstMessage }
            ];
            const title = await generateChatTitle(this.llmGateway, llmSetConfig, messages);
            res.json({ title });
        } catch {
            res.status(500).json({ error: 'Erro ao gerar título via LLM' });
        }
    }
}
