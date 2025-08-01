import { Request, Response } from 'express';
import { Chat, IChat, IMessage } from '../models/chat.model';
import { LLMManager } from '../services/llm.service';
import { ThoughtCycleService } from '../services/throught-cycle/thought-cycle.service';
import { StreamChatProgress, StreamChatProgressType, ThoughtCycleContext } from '../interfaces/thought-cycle';
import { date } from 'zod';

const llmManager = new LLMManager();
const thoughtCycleService = new ThoughtCycleService(llmManager);

export class ChatController {
  // Listar todos os chats do usuário
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      // Temporariamente usando usuário hardcoded para debug
      const userId = (req as any).user?.id || '6887c5ca176ffb6185f3626e';
      
      const chats = await Chat.find({ userId })
        .sort({ updatedAt: -1 })
        .select('title createdAt updatedAt')
        .lean();

      res.json({
        message: 'Chats retrieved successfully',
        data: chats,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error getting chats:', error);
      res.status(500).json({ error: 'Failed to get chats' });
    }
  }

  // Obter um chat específico com todas as mensagens
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      // Temporariamente usando usuário hardcoded para debug
      const userId = (req as any).user?.id || '6887c5ca176ffb6185f3626e';

      // Verificar se o ID é um ObjectId válido
      if (!id || id.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(id)) {
        res.status(400).json({ error: 'Invalid chat ID format' });
        return;
      }

      const chat = await Chat.findOne({ _id: id, userId }).lean();

      if (!chat) {
        res.status(404).json({ error: 'Chat not found' });
        return;
      }

      res.json({
        message: 'Chat retrieved successfully',
        data: chat,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error getting chat:', error);
      res.status(500).json({ error: 'Failed to get chat' });
    }
  }

  // Criar um novo chat
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { title, message } = req.body;
      // Temporariamente usando usuário hardcoded para debug
      const userId = (req as any).user?.id || '6887c5ca176ffb6185f3626e';

      if (!title || !message) {
        res.status(400).json({ error: 'Title and message are required' });
        return;
      }

      const userMessage: IMessage = {
        role: 'user',
        content: message,
        timestamp: new Date()
      };

      const newChat = new Chat({
        title,
        userId,
        messages: [userMessage]
      });

      await newChat.save();

      res.status(201).json({
        message: 'Chat created successfully',
        data: newChat,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error creating chat:', error);
      res.status(500).json({ error: 'Failed to create chat' });
    }
  }

  // Adicionar mensagem a um chat existente
  static async addMessage(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { message, role = 'user' } = req.body;
      // Temporariamente usando usuário hardcoded para debug
      const userId = (req as any).user?.id || '6887c5ca176ffb6185f3626e';

      if (!message) {
        res.status(400).json({ error: 'Message is required' });
        return;
      }

      const chat = await Chat.findOne({ _id: id, userId });

      if (!chat) {
        res.status(404).json({ error: 'Chat not found' });
        return;
      }

      const newMessage: IMessage = {
        role: role as 'user' | 'assistant',
        content: message,
        timestamp: new Date()
      };

      chat.messages.push(newMessage);
      await chat.save();

      res.json({
        message: 'Message added successfully',
        data: chat,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error adding message:', error);
      res.status(500).json({ error: 'Failed to add message' });
    }
  }

  // Stream de chat com thought cycle
  static async streamChat(req: Request, res: Response): Promise<void> {
    try {
      const { chatId, message }: { chatId: string, message: string } = req.body;
      // Temporariamente usando usuário hardcoded para debug
      const userId = (req as any).user?.id || '6887c5ca176ffb6185f3626e';

      if (!message) {
        res.status(400).json({ error: 'Message is required' });
        return;
      }

      // Set up server-sent events
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control',
      });

      const { chat, isNewChat } = await ChatController.findChat(chatId, userId);
      if (!chat) {
        res.write(`data: ${JSON.stringify({ error: 'Chat not found' })}\n\n`);
        res.end();
        return;
      }      
      //let messages: IMessage[] = [];

      // // Se for novo chat, criar temporariamente
      // if (isNewChat) {
      //   //messages = [{ role: 'user', content: message, timestamp: new Date() }];
      // } else {
      //   // Buscar chat existente
      //   // chat = await Chat.findOne({ _id: chatId, userId });
      //   // if (!chat) {
      //   //   res.write(`data: ${JSON.stringify({ error: 'Chat not found' })}\n\n`);
      //   //   res.end();
      //   //   return;
      //   // }
        
      //   // Adicionar nova mensagem do usuário
      //   const userMessage: IMessage = {
      //     role: 'user',
      //     content: message,
      //     timestamp: new Date()
      //   };
        
      //   chat.messages.push(userMessage);
      //   messages = chat.messages;
      // }

      const onProgress = (message: StreamChatProgress) => {
        res.write(`data: ${JSON.stringify(message)}\n\n`);
        if (message.type == StreamChatProgressType.Done ||
          message.type == StreamChatProgressType.Error) {
            res.end();
        }
      };

      try {
        // Preparar contexto para o thought cycle
        const ctx: ThoughtCycleContext = {
          chat,
          message,
          messages: [
            { role: 'user', content: message, timestamp: new Date() }
          ],
          executedActions: []
        };

        // Função para enviar progresso via stream
        // const onProgress = (progressMessage: string) => {
        //   res.write(`data: ${JSON.stringify({ 
        //     type: 'progress', 
        //     content: progressMessage 
        //   })}\n\n`);
        // };


        // Iniciar thought cycle com callback de progresso
        // A resposta final já é gerada pela ação finalize.action.ts
        await thoughtCycleService.runThoughtCycle(ctx, onProgress);

        // Enviar a resposta final como conteúdo
        // res.write(`data: ${JSON.stringify({ 
        //   type: 'content', 
        //   content: assistantResponse 
        // })}\n\n`);

        // Adicionar resposta do assistente
        // const assistantMessage: IMessage = {
        //   role: 'assistant',
        //   content: assistantResponse,
        //   timestamp: new Date()
        // };

        // if (isNewChat) {
        //   // Para novo chat, precisamos gerar um título
        //   res.write(`data: ${JSON.stringify({ 
        //     type: 'system',
        //     needsTitle: true 
        //   })}\n\n`);
        // } else {
        //   // Para chat existente, salvar a mensagem
        //   chat!.messages.push(assistantMessage);
        //   await chat!.save();
        // }
        if (isNewChat) {
          onProgress({ type: StreamChatProgressType.RequestTitle });
        }

        chat.messages.push(...ctx.messages);

        await chat.save();

        // Send end signal
        // res.write(`data: ${JSON.stringify({ 
        //   type: 'system',
        //   done: true, 
        //   chatId: chat?._id 
        // })}\n\n`);
        // res.end();
        onProgress({ type: StreamChatProgressType.Done });

      } catch (error) {
        console.error('Thought cycle error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        // res.write(`data: ${JSON.stringify({ 
        //   type: 'error',
        //   error: errorMessage 
        // })}\n\n`);
        // res.end();
        onProgress({ type: StreamChatProgressType.Error, data: errorMessage });
      }

    } catch (error) {
      console.error('Chat stream endpoint error:', error);
      // Se o stream já foi iniciado, enviar erro via SSE
      if (res.headersSent) {
        res.write(`data: ${JSON.stringify({ type: 'error', error: 'Internal server error' })}\n\n`);
        res.end();
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  static async findChat(chatId: string, userId: string): Promise<{ chat: IChat | null, isNewChat: boolean}> {
    // Se é um novo chat ou ID temporário
    if (chatId === '<new>' || chatId === null || chatId === undefined || 
        chatId.startsWith('temp-') || 
        !chatId || 
        chatId.length !== 24 || 
        !/^[0-9a-fA-F]{24}$/.test(chatId)) {
      return { chat: new Chat({
        title: 'New chat',
        userId,
        messages: []
      }), isNewChat: true };
    }
    else {
      try {
        const chat = await Chat.findOne({ _id: chatId, userId });
        return { chat, isNewChat: false };
      } catch (error) {
        // Se houver erro de cast, tratar como novo chat
        console.log('Invalid chatId format, treating as new chat:', chatId);
        return { chat: new Chat({
          title: 'New chat',
          userId,
          messages: []
        }), isNewChat: true };
      }
    }
  }

  // Gerar título para um novo chat
  static async generateTitle(req: Request, res: Response): Promise<void> {
    try {
      const { message, assistantResponse } = req.body;
      // Temporariamente usando usuário hardcoded para debug
      const userId = (req as any).user?.id || '6887c5ca176ffb6185f3626e';

      if (!message || !assistantResponse) {
        res.status(400).json({ error: 'Message and assistant response are required' });
        return;
      }

      const provider = await llmManager.getAvailableProvider();
      if (!provider) {
        res.status(503).json({ error: 'No LLM provider available' });
        return;
      }

      // Prompt para gerar título
      const titlePrompt = `Com base na seguinte conversa, gere um título curto e descritivo de no máximo 100 caracteres:

Usuário: ${message}
Assistente: ${assistantResponse}

Título:`;

      let title = '';
      for await (const chunk of provider.generateResponse(titlePrompt)) {
        title += chunk;
      }

      // Limpar e limitar o título
      title = title.trim().replace(/^["']|["']$/g, '').substring(0, 100);

      // Criar o chat com o título gerado
      const userMessage: IMessage = {
        role: 'user',
        content: message,
        timestamp: new Date()
      };

      const assistantMessage: IMessage = {
        role: 'assistant',
        content: assistantResponse,
        timestamp: new Date()
      };

      const newChat = new Chat({
        title,
        userId,
        messages: [userMessage, assistantMessage]
      });

      await newChat.save();

      res.json({
        message: 'Chat created with title',
        data: { 
          chat: newChat,
          title 
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error generating title:', error);
      res.status(500).json({ error: 'Failed to generate title' });
    }
  }

  // Excluir um chat
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      // Temporariamente usando usuário hardcoded para debug
      const userId = (req as any).user?.id || '6887c5ca176ffb6185f3626e';

      // Verificar se o ID é um ObjectId válido
      if (!id || id.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(id)) {
        res.status(400).json({ error: 'Invalid chat ID format' });
        return;
      }

      const deletedChat = await Chat.findOneAndDelete({ _id: id, userId });

      if (!deletedChat) {
        res.status(404).json({ error: 'Chat not found' });
        return;
      }

      res.json({
        message: 'Chat deleted successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error deleting chat:', error);
      res.status(500).json({ error: 'Failed to delete chat' });
    }
  }
}
