import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import ConfirmModal from '../../components/ConfirmModal';
import QuestionModal from '../../components/QuestionModal';
import { apiService } from '../../services/api';

const Dashboard = () => {
    const { 
        user, 
        logout, 
        memories, 
        selectedMemory, 
        loadMemories, 
        createMemory, 
        deleteMemory, 
        selectMemory,
        chats,
        selectedChat,
        loadChats,
        createChat,
        addChat,
        updateChat,
        deleteChat,
        removeChat,
        selectChat,
        setError,
        clearError,
        error 
    } = useApp();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [showCreateMemoryModal, setShowCreateMemoryModal] = useState(false);
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [memoryToDelete, setMemoryToDelete] = useState(null);
    const [chatToDelete, setChatToDelete] = useState(null);
    const [newMemoryName, setNewMemoryName] = useState('');
    const [isCreatingMemory, setIsCreatingMemory] = useState(false);
    
    // Chat states
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [isStreaming, setIsStreaming] = useState(false);
    const [currentResponse, setCurrentResponse] = useState('');
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const focusTextarea = () => {
        setTimeout(() => {
            textareaRef.current?.focus();
        }, 100); // Pequeno delay para garantir que o elemento esteja pronto
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, currentResponse]);

    useEffect(() => {
        // Carregar memórias e chats quando o componente montar
        if (user) {
            loadMemories();
            loadChats();
            
            // Dar foco inicial no textarea
            focusTextarea();
        }
    }, [user]);

    useEffect(() => {
        // Carregar mensagens do chat selecionado
        if (selectedChat) {
            loadChatMessages();
        } else {
            setMessages([]);
        }
    }, [selectedChat]);

    useEffect(() => {
        // Log apenas para debug durante desenvolvimento
    }, [chats]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleCreateMemory = async () => {
        if (!newMemoryName.trim()) {
            setError('Nome da memória é obrigatório');
            return;
        }

        setIsCreatingMemory(true);
        try {
            await createMemory(newMemoryName.trim());
            setNewMemoryName('');
            setShowCreateMemoryModal(false);
            clearError();
        } catch (error) {
            // Erro já tratado no contexto
        } finally {
            setIsCreatingMemory(false);
        }
    };

    const handleDeleteConfirmMemory = (memory) => {
        setMemoryToDelete(memory);
        setChatToDelete(null);
        setShowDeleteConfirmModal(true);
    };

    const handleDeleteMemory = async () => {
        if (!memoryToDelete) return;

        try {
            await deleteMemory(memoryToDelete._id);
            setShowDeleteConfirmModal(false);
            setMemoryToDelete(null);
            clearError();
        } catch (error) {
            // Erro já tratado no contexto
            setShowDeleteConfirmModal(false);
            setMemoryToDelete(null);
        }
    };

    const handleSelectMemory = (memory) => {
        selectMemory(memory);
    };

    const loadChatMessages = async () => {
        if (!selectedChat || selectedChat._id.startsWith('temp-')) return;
        
        // Usar o ID real se estiver disponível
        const chatId = selectedChat.realId || selectedChat._id;
        
        try {
            const response = await apiService.chats.getById(chatId);
            
            let messages = [];
            if (response.data && response.data.data && response.data.data.messages) {
                messages = response.data.data.messages;
            } else if (response.data && response.data.messages) {
                messages = response.data.messages;
            }
            
            setMessages(messages || []);
        } catch (error) {
            console.error('Error loading chat messages:', error);
            setError('Erro ao carregar mensagens do chat');
        }
    };

    const handleSendMessage = async () => {
        if (!message.trim() || isStreaming) return;

        const userMessage = message.trim();
        setMessage('');
        setIsStreaming(true);
        setCurrentResponse('');

        try {
            if (!selectedChat) {
                // Novo chat - criar chat temporário na lista
                const tempChatId = 'temp-' + Date.now(); // ID único temporário
                const tempChat = {
                    _id: tempChatId,
                    title: 'New chat...',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    isTemporary: true
                };
                
                // Adicionar chat temporário à lista e selecionar
                addChat(tempChat);
                selectChat(tempChat);
                
                // Adicionar mensagem do usuário às mensagens locais
                const newUserMessage = {
                    role: 'user',
                    content: userMessage,
                    timestamp: new Date()
                };
                setMessages([newUserMessage]);

                let assistantResponse = '';

                await apiService.chats.streamChat(
                    null,
                    userMessage,
                    true,
                    (chunk) => {
                        // Receber chunk da resposta
                        assistantResponse += chunk;
                        setCurrentResponse(assistantResponse);
                    },
                    (error) => {
                        console.error('Stream error:', error);
                        setError('Erro na comunicação com IA');
                        setIsStreaming(false);
                    },
                    async (data) => {
                        // Stream concluído
                        if (data.needsTitle) {
                            // Gerar título para o novo chat
                            try {
                                const titleResponse = await apiService.chats.generateTitle(userMessage, assistantResponse);
                                
                                // A resposta está em titleResponse.data.data.chat
                                const newChat = titleResponse.data.data?.chat || titleResponse.data.chat;
                                
                                if (!newChat || !newChat._id) {
                                    throw new Error('Invalid chat data received from API');
                                }
                                
                                // Atualizar o chat temporário com os dados reais, mantendo o mesmo ID temporário para o contexto
                                const updatedChat = {
                                    _id: tempChatId, // Manter o ID temporário para a atualização funcionar
                                    realId: newChat._id, // Guardar o ID real para futuras operações
                                    title: newChat.title,
                                    createdAt: newChat.createdAt,
                                    updatedAt: newChat.updatedAt,
                                    isTemporary: false
                                };
                                
                                updateChat(updatedChat);
                                
                                // Atualizar também o selectedChat para refletir imediatamente no título
                                selectChat(updatedChat);
                                
                                // Finalizar mensagens
                                const assistantMessage = {
                                    role: 'assistant',
                                    content: assistantResponse,
                                    timestamp: new Date()
                                };
                                setMessages([newUserMessage, assistantMessage]);
                                setCurrentResponse('');
                                
                                // Dar foco no textarea após finalizar
                                focusTextarea();
                                
                            } catch (error) {
                                console.error('Error generating title:', error);
                                setError('Erro ao criar título do chat');
                                // Se falhar, remover o chat temporário
                                removeChat(tempChatId);
                                selectChat(null);
                            }
                        }
                        setIsStreaming(false);
                    }
                );
            } else {
                // Chat existente
                const newUserMessage = {
                    role: 'user',
                    content: userMessage,
                    timestamp: new Date()
                };
                
                setMessages(prev => [...prev, newUserMessage]);

                let assistantResponse = '';

                // Usar o ID real se estiver disponível
                const chatId = selectedChat.realId || selectedChat._id;

                await apiService.chats.streamChat(
                    chatId,
                    userMessage,
                    false,
                    (chunk) => {
                        assistantResponse += chunk;
                        setCurrentResponse(assistantResponse);
                    },
                    (error) => {
                        console.error('Stream error:', error);
                        setError('Erro na comunicação com IA');
                        setIsStreaming(false);
                    },
                    (data) => {
                        // Adicionar resposta final às mensagens
                        const assistantMessage = {
                            role: 'assistant',
                            content: assistantResponse,
                            timestamp: new Date()
                        };
                        setMessages(prev => [...prev, assistantMessage]);
                        setCurrentResponse('');
                        setIsStreaming(false);
                        
                        // Dar foco no textarea após finalizar
                        focusTextarea();
                    }
                );
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setError('Erro ao enviar mensagem');
            setIsStreaming(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleNewChat = () => {
        selectChat(null);
        setMessages([]);
        setCurrentResponse('');
        
        // Dar foco no textarea
        focusTextarea();
    };

    const handleDeleteChatConfirm = (chat) => {
        setChatToDelete(chat);
        setMemoryToDelete(null);
        setShowDeleteConfirmModal(true);
    };

    const handleDeleteChat = async () => {
        if (!chatToDelete) return;

        try {
            // Usar o ID real se estiver disponível, senão usar o ID do chat
            const chatIdToDelete = chatToDelete.realId || chatToDelete._id;
            
            // Se o chat não é temporário, fazer chamada da API
            if (!chatToDelete.isTemporary && !chatToDelete._id.startsWith('temp-')) {
                await deleteChat(chatIdToDelete);
            } else {
                // Se é temporário, apenas remover localmente
                removeChat(chatToDelete._id);
            }
            
            if (selectedChat && selectedChat._id === chatToDelete._id) {
                selectChat(null);
            }
            setShowDeleteConfirmModal(false);
            setChatToDelete(null);
            clearError();
        } catch (error) {
            setShowDeleteConfirmModal(false);
            setChatToDelete(null);
        }
    };

    return (
        <div className="columns is-gapless fullheight-container">
            {/* Notificação de erro */}
            {error && (
                <div className="notification is-danger" style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000 }}>
                    <button className="delete" onClick={clearError}></button>
                    {error}
                </div>
            )}
            
            {/* Barra Lateral */}
            <aside 
                className="column is-narrow is-flex is-flex-direction-column"
                style={{ width: '245px', backgroundColor: '#f5f5f5', overflowY: 'auto', height: '100vh' }}
            >
                <div className="p-4 is-flex-grow-1">
                    {/* Logo */}
                    <a className="button is-text has-text-black is-fullwidth is-justify-content-flex-start mb-4">
                        <span className="icon is-medium">
                            {/* Substituir pelo seu logo de 36x36px */}
                            <i className="fas fa-brain fa-2x"></i>
                        </span>
                        <span className="is-size-5 has-text-weight-bold">SymbIA</span>
                    </a>

                    {/* Perfil do Usuário */}
                    <a className="button is-text has-text-black is-fullwidth is-justify-content-flex-start mb-5">
                        <span className="icon">
                            {/* Ícone do usuário 24x24px */}
                            <i className="fas fa-user-circle fa-lg"></i>
                        </span>
                        <span>{user?.name || 'Usuário'}</span>
                    </a>

                    {/* Lista de Memórias */}
                    <div className="menu">
                        <p className="menu-label is-flex is-justify-content-space-between is-align-items-center">
                            Memories
                            <button 
                                className="button is-small is-text"
                                onClick={() => setShowCreateMemoryModal(true)}
                                title="Criar nova memória"
                            >
                                <span className="icon">
                                    <i className="fas fa-plus"></i>
                                </span>
                            </button>
                        </p>
                        <ul className="menu-list">
                            {memories.map((memory) => (
                                <li key={memory._id}>
                                    <a 
                                        className={`is-flex is-justify-content-space-between is-align-items-center ${
                                            selectedMemory?._id === memory._id ? 'is-active' : ''
                                        }`}
                                        onClick={() => handleSelectMemory(memory)}
                                    >
                                        <span className="is-flex-grow-1">{memory.name}</span>
                                        {!memory.isDefault && (
                                            <button 
                                                className="button is-small is-text has-text-danger"
                                                style={{ width: 'auto', padding: '0.25rem', flexShrink: 0 }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteConfirmMemory(memory);
                                                }}
                                                title="Excluir memória"
                                            >
                                                <span className="icon is-small">
                                                    <i className="fas fa-trash"></i>
                                                </span>
                                            </button>
                                        )}
                                    </a>
                                </li>
                            ))}
                            {memories.length === 0 && (
                                <li>
                                    <span className="has-text-grey">Nenhuma memória encontrada</span>
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Lista de Chats */}
                    <div className="menu mt-4">
                        <p className="menu-label is-flex is-justify-content-space-between is-align-items-center">
                            Chats
                            <button 
                                className="button is-small is-text"
                                onClick={handleNewChat}
                                title="Novo chat"
                            >
                                <span className="icon">
                                    <i className="fas fa-plus"></i>
                                </span>
                            </button>
                        </p>
                        <ul className="menu-list">
                            {(chats || []).filter(chat => chat && chat._id).map((chat) => (
                                <li key={chat._id}>
                                    <a 
                                        className={`is-flex is-justify-content-space-between is-align-items-center ${
                                            selectedChat?._id === chat._id ? 'is-active' : ''
                                        }`}
                                        onClick={() => selectChat(chat)}
                                    >
                                        <span className="is-flex-grow-1" style={{ 
                                            whiteSpace: 'nowrap', 
                                            overflow: 'hidden', 
                                            textOverflow: 'ellipsis',
                                            maxWidth: '140px'
                                        }}>
                                            {chat.title}
                                        </span>
                                        <button 
                                            className="button is-small is-text has-text-danger"
                                            style={{ width: 'auto', padding: '0.25rem', flexShrink: 0 }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteChatConfirm(chat);
                                            }}
                                            title="Excluir chat"
                                        >
                                            <span className="icon is-small">
                                                <i className="fas fa-trash"></i>
                                            </span>
                                        </button>
                                    </a>
                                </li>
                            ))}
                            {(chats || []).length === 0 && (
                                <li>
                                    <span className="has-text-grey">Nenhum chat encontrado</span>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </aside>

            {/* Conteúdo Principal */}
            <main className="column">
                <div className="is-flex is-flex-direction-column" style={{ height: '100vh' }}>
                    {/* Histórico da Conversa */}
                    <div className="is-flex-grow-1 p-4" style={{ overflowY: 'auto' }}>
                        {selectedChat || messages.length > 0 ? (
                            <div className="container">
                                {/* Título do Chat */}
                                {selectedChat && (
                                    <div className="mb-4">
                                        <h2 className="title is-4">{selectedChat.title}</h2>
                                    </div>
                                )}
                                
                                {/* Mensagens */}
                                <div className="chat-messages">
                                    {messages.map((msg, index) => (
                                        <div key={index} className={`message ${msg.role === 'user' ? 'is-primary' : 'is-info'}`}>
                                            <div className="message-header">
                                                <p>{msg.role === 'user' ? 'Você' : 'SymbIA'}</p>
                                                <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
                                            </div>
                                            <div className="message-body">
                                                <div style={{ whiteSpace: 'pre-wrap' }}>
                                                    {msg.content}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    
                                    {/* Resposta em tempo real */}
                                    {isStreaming && currentResponse && (
                                        <div className="message is-info">
                                            <div className="message-header">
                                                <p>SymbIA</p>
                                                <span className="icon">
                                                    <i className="fas fa-circle-notch fa-spin"></i>
                                                </span>
                                            </div>
                                            <div className="message-body">
                                                <div style={{ whiteSpace: 'pre-wrap' }}>
                                                    {currentResponse}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div ref={messagesEndRef} />
                                </div>
                            </div>
                        ) : (
                            <div className="has-text-centered mt-6">
                                <div className="icon is-large has-text-grey-light mb-4">
                                    <i className="fas fa-comments fa-3x"></i>
                                </div>
                                <h2 className="title is-4 has-text-grey">Bem-vindo ao SymbIA</h2>
                                <p className="subtitle has-text-grey">
                                    Selecione um chat ou inicie uma nova conversa
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Área de Input */}
                    <div className="p-4">
                        <div className="box">
                            <div className="field has-addons">
                                <div className="control is-expanded">
                                    <textarea 
                                        ref={textareaRef}
                                        className="textarea" 
                                        rows="2"
                                        placeholder="Digite sua pergunta..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        disabled={isStreaming}
                                    />
                                </div>
                                <div className="control">
                                    <button 
                                        className={`button is-primary is-medium ${isStreaming ? 'is-loading' : ''}`}
                                        onClick={handleSendMessage}
                                        disabled={!message.trim() || isStreaming}
                                        style={{ height: '100%' }}
                                    >
                                        <span className="icon">
                                            <i className={`fas ${isStreaming ? 'fa-pause' : 'fa-paper-plane'}`}></i>
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Modal para criar nova memória */}
            <QuestionModal
                isOpen={showCreateMemoryModal}
                onClose={() => setShowCreateMemoryModal(false)}
                onConfirm={handleCreateMemory}
                title="Nova Memória"
                label="Nome da Memória"
                placeholder="Digite o nome da memória..."
                value={newMemoryName}
                onChange={(e) => setNewMemoryName(e.target.value)}
                confirmText="Criar"
                cancelText="Cancelar"
                isLoading={isCreatingMemory}
                onKeyPress={handleCreateMemory}
            />

            {/* Modal de confirmação para excluir memória */}
            <ConfirmModal
                isOpen={showDeleteConfirmModal && memoryToDelete}
                onClose={() => setShowDeleteConfirmModal(false)}
                onConfirm={handleDeleteMemory}
                title="Excluir Memória"
                message={`Tem certeza que deseja excluir a memória "${memoryToDelete?.name}"? Esta ação não pode ser desfeita.`}
                confirmText="Excluir"
                cancelText="Cancelar"
                confirmClass="is-danger"
            />

            {/* Modal de confirmação para excluir chat */}
            <ConfirmModal
                isOpen={showDeleteConfirmModal && chatToDelete}
                onClose={() => setShowDeleteConfirmModal(false)}
                onConfirm={handleDeleteChat}
                title="Excluir Chat"
                message={`Tem certeza que deseja excluir o chat "${chatToDelete?.title}"? Esta ação não pode ser desfeita.`}
                confirmText="Excluir"
                cancelText="Cancelar"
                confirmClass="is-danger"
            />
        </div>
    );
};

export default Dashboard;
