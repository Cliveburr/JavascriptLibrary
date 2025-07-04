import { Request, Response } from 'express';
import { Chat, IChat, IMessage } from '../models/chat.model';
import { LLMManager } from '../services/llm.service';

const llmManager = new LLMManager();

export class ChatController {
  // Listar todos os chats do usuário
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      
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
      const userId = (req as any).user.id;

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
      const userId = (req as any).user.id;

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
      const userId = (req as any).user.id;

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

  // Stream de chat com mensagem nova
  static async streamChat(req: Request, res: Response): Promise<void> {
    try {
      const { chatId, message, isNewChat = false, model = 'llama3:8b' } = req.body;
      const userId = (req as any).user.id;

      if (!message) {
        res.status(400).json({ error: 'Message is required' });
        return;
      }

      const provider = await llmManager.getAvailableProvider();
      if (!provider) {
        res.status(503).json({ error: 'No LLM provider available' });
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

      let chat: IChat | null = null;
      let messages: IMessage[] = [];

      // Se for novo chat, criar temporariamente
      if (isNewChat) {
        messages = [{ role: 'user', content: message, timestamp: new Date() }];
      } else {
        // Buscar chat existente
        chat = await Chat.findOne({ _id: chatId, userId });
        if (!chat) {
          res.write(`data: ${JSON.stringify({ error: 'Chat not found' })}\n\n`);
          res.end();
          return;
        }
        
        // Adicionar nova mensagem do usuário
        const userMessage: IMessage = {
          role: 'user',
          content: message,
          timestamp: new Date()
        };
        
        chat.messages.push(userMessage);
        messages = chat.messages;
      }

      // Preparar mensagens para o LLM
      const llmMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      let assistantResponse = '';

      try {
        // Stream da resposta do LLM
        for await (const chunk of provider.generateConversationResponse(llmMessages, model)) {
          assistantResponse += chunk;
          res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
        }

        // Adicionar resposta do assistente
        const assistantMessage: IMessage = {
          role: 'assistant',
          content: assistantResponse,
          timestamp: new Date()
        };

        if (isNewChat) {
          // Para novo chat, precisamos gerar um título
          res.write(`data: ${JSON.stringify({ needsTitle: true })}\n\n`);
        } else {
          // Para chat existente, salvar a mensagem
          chat!.messages.push(assistantMessage);
          await chat!.save();
        }

        // Send end signal
        res.write(`data: ${JSON.stringify({ done: true, chatId: chat?._id })}\n\n`);
        res.end();
      } catch (error) {
        console.error('Streaming error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.write(`data: ${JSON.stringify({ error: errorMessage })}\n\n`);
        res.end();
      }
    } catch (error) {
      console.error('Chat stream endpoint error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Gerar título para um novo chat
  static async generateTitle(req: Request, res: Response): Promise<void> {
    try {
      const { message, assistantResponse } = req.body;
      const userId = (req as any).user.id;

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
      const userId = (req as any).user.id;

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
