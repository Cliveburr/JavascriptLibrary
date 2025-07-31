import type { Request, Response } from 'express';
import { LlmGateway } from '@symbia/core';
import { LlmSetService } from '@symbia/core';

async function getLlmSetForChat(llmSetService: LlmSetService, llmSetId?: string) {
    if (llmSetId) {
        const requestedSet = await llmSetService.getLlmSetById(llmSetId);
        if (requestedSet && (requestedSet.models.fastChat || requestedSet.models.reasoning)) {
            return requestedSet;
        }
    }
    const allSets = await llmSetService.loadLlmSets();
    return allSets.find(set => set.models.fastChat || set.models.reasoning) || null;
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
            // Gerar título usando o LLM
            const messages = [
                {
                    role: 'system',
                    content: 'Você é um assistente que gera títulos curtos e descritivos para conversas. Gere um título de máximo 60 caracteres baseado na primeira mensagem do usuário. Responda apenas com o título, sem aspas ou formatação extra.'
                },
                {
                    role: 'user',
                    content: firstMessage
                }
            ];

            const titleResponse = await this.llmGateway.invokeAsync(
                llmSetConfig.models.reasoning,
                messages,
                () => { }, // firstCallback
                () => { }  // chunkCallback
            );

            res.json({ title: titleResponse.content.trim() });
        } catch {
            res.status(500).json({ error: 'Erro ao gerar título via LLM' });
        }
    }
}
