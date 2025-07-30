import type { Request, Response } from 'express';
import { container } from 'tsyringe';
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
    async generateTitle(req: Request, res: Response): Promise<void> {
        const { chatId, memoryId, firstMessage, llmSetId } = req.body;
        if (!firstMessage || typeof firstMessage !== 'string') {
            res.status(400).json({ error: 'Mensagem inicial ausente ou inválida' });
            return;
        }
        try {
            // Recupera configuração do modelo LLM igual ao thought-cycle.service.ts
            const llmSetService = container.resolve(LlmSetService);
            const llmGateway = container.resolve(LlmGateway);
            const llmSetConfig = await getLlmSetForChat(llmSetService, llmSetId);
            if (!llmSetConfig) {
                res.status(404).json({ error: 'Nenhum modelo LLM disponível' });
                return;
            }
            // Monta mensagem para o LLM
            const messages = [
                { role: 'user', content: firstMessage }
            ];
            const title = await generateChatTitle(llmGateway, llmSetConfig, messages);
            res.json({ title });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao gerar título via LLM' });
        }
    }
}
