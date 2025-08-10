import { UserEntity } from '../../entities';
import { LlmGateway } from '../llm-gateway';
import { LlmRequestMessage, LlmSetConfig } from '../llm.types';

export const generateChatTitle = async (
    llmGateway: LlmGateway,
    user: UserEntity,
    userMessage: string,
    llmSetConfig: LlmSetConfig,
    streamCallback: (content: string) => void
): Promise<string> => {

    const messages: LlmRequestMessage[] = [
        {
            role: 'system',
            content: `You are an assistant that generates short and descriptive titles for conversations.  
User language: ${user.reponseLanguage}  

Instructions:  
- Generate a title of at most 60 characters based on the user's first message.  
- Write the title naturally in the user's language.  
- Respond with the title only, without quotes, formatting, or extra text.`
        },
        {
            role: 'user',
            content: userMessage
        }
    ];

    const response = await llmGateway.invokeAsync(
        llmSetConfig.models.reasoning,
        messages,
        streamCallback);

    return response.content;
};