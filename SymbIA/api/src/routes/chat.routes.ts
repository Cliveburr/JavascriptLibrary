import { Router } from 'express';
import { ChatController } from '../controllers/chat.controller';

const router = Router();

// Listar todos os chats do usuário
router.get('/', ChatController.getAll);

// Obter um chat específico
router.get('/:id', ChatController.getById);

// Criar um novo chat
router.post('/', ChatController.create);

// Adicionar mensagem a um chat existente
router.post('/:id/messages', ChatController.addMessage);

// Stream de chat
router.post('/stream', ChatController.streamChat);

// Gerar título para novo chat
router.post('/generate-title', ChatController.generateTitle);

// Excluir um chat
router.delete('/:id', ChatController.delete);

export { router as chatRoutes };
