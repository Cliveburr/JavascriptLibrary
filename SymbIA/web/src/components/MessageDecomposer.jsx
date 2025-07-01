import { useState } from 'react';
import './MessageDecomposer.css';

function MessageDecomposer() {
  const [message, setMessage] = useState('');
  const [decomposition, setDecomposition] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const decomposeMessage = async () => {
    if (!message.trim()) {
      setError('Por favor, digite uma mensagem para decompor');
      return;
    }

    setIsLoading(true);
    setError('');
    setDecomposition(null);

    try {
      const response = await fetch('http://localhost:3002/api/decompose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setDecomposition(data.data);
    } catch (err) {
      setError(`Erro ao decompor mensagem: ${err.message}`);
      console.error('Decompose error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeColor = (index) => {
    const colors = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#607D8B', '#795548'];
    return colors[index % colors.length];
  };

  return (
    <div className="message-decomposer">
      <div className="decomposer-header">
        <h2>🧠 Decompositor Inteligente SymbIA</h2>
        <p>Digite uma mensagem e veja como a IA a decompõe em componentes isolados e específicos, separando ações, objetos e contextos temporais.</p>
      </div>

      <div className="input-section">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Digite sua mensagem aqui... Ex: 'agende para desligar as luzes daqui 10min' ou 'crie um sistema de busca com embeddings'"
          rows={4}
          className="message-input"
        />
        
        <button 
          onClick={decomposeMessage}
          disabled={isLoading || !message.trim()}
          className="decompose-button"
        >
          {isLoading ? '🧠 Decomponddo com IA...' : '🧠 Decompor com IA'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}

      {decomposition && (
        <div className="decomposition-results">
          <div className="results-header">
            <h3>📋 Resultado da Decomposição</h3>
            <div className="results-info">
              <span>Total de itens: {decomposition.totalItems}</span>
              <span>Processado em: {new Date(decomposition.timestamp).toLocaleString()}</span>
            </div>
          </div>

          <div className="original-message">
            <h4>📝 Mensagem Original:</h4>
            <p>{decomposition.originalMessage}</p>
          </div>

          <div className="decomposed-items">
            <h4>🔍 Componentes Decompostos:</h4>
            {decomposition.decomposedItems.map((item, index) => (
              <div key={item.id} className="decomposed-item">
                <div className="item-header">
                  <span 
                    className="item-number"
                    style={{ backgroundColor: getTypeColor(index) }}
                  >
                    #{index + 1}
                  </span>
                </div>
                
                <div className="item-content">
                  {item.content}
                </div>

                <div className="item-id">
                  ID: {item.id}
                </div>
              </div>
            ))}
          </div>

          <div className="next-steps">
            <h4>🚀 Próximos Passos do Pipeline:</h4>
            <div className="llm-indicator">
              <span className="ai-badge">🧠 Powered by LLM</span>
              <small>Análise semântica avançada com fallback para regras</small>
            </div>
            <ol>
              <li>✅ <strong>Decomposição Inteligente</strong> - IA analisou e decompôs em {decomposition.totalItems} itens</li>
              <li>⏳ <strong>Gerar embeddings</strong> - Para cada item decomposto</li>
              <li>⏳ <strong>Buscar contexto no Qdrant</strong> - Usando similaridade vetorial</li>
              <li>⏳ <strong>Criar plano de ações</strong> - Baseado no contexto encontrado</li>
              <li>⏳ <strong>Executar plano</strong> - Etapa por etapa</li>
              <li>⏳ <strong>Gerar resposta final</strong> - Com resumo para memória</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}

export default MessageDecomposer;
