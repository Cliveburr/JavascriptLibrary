import { useState } from 'react';
import './MessageDecomposer.css';

function MessageDecomposer() {
  const [message, setMessage] = useState('');
  const [decomposition, setDecomposition] = useState(null);
  const [enrichedDecomposition, setEnrichedDecomposition] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEnriching, setIsEnriching] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('simple'); // 'simple' ou 'enriched'

  const decomposeMessage = async () => {
    if (!message.trim()) {
      setError('Por favor, digite uma mensagem para decompor');
      return;
    }

    setIsLoading(true);
    setError('');
    setDecomposition(null);
    setEnrichedDecomposition(null);

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
      setActiveTab('simple');
    } catch (err) {
      setError(`Erro ao decompor mensagem: ${err.message}`);
      console.error('Decompose error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const decomposeEnrichedMessage = async () => {
    if (!message.trim()) {
      setError('Por favor, digite uma mensagem para decompor');
      return;
    }

    setIsEnriching(true);
    setError('');
    setDecomposition(null);
    setEnrichedDecomposition(null);

    try {
      const response = await fetch('http://localhost:3002/api/decompose/enriched', {
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
      setEnrichedDecomposition(data.data);
      setActiveTab('enriched');
    } catch (err) {
      setError(`Erro ao decompor mensagem enriquecida: ${err.message}`);
      console.error('Enriched decompose error:', err);
    } finally {
      setIsEnriching(false);
    }
  };

  const getTypeColor = (index) => {
    const colors = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#607D8B', '#795548'];
    return colors[index % colors.length];
  };

  return (
    <div className="message-decomposer">
      <div className="decomposer-header">
        <h2>🧠 Decompositor Inteligente SymbIA - Etapa 2</h2>
        <p>Digite uma mensagem e veja como a IA a decompõe em componentes isolados e específicos, agora com embeddings e busca de contexto vetorial.</p>
      </div>

      <div className="input-section">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Digite sua mensagem aqui... Ex: 'agende para desligar as luzes daqui 10min' ou 'crie um sistema de busca com embeddings'"
          rows={4}
          className="message-input"
        />
        
        <div className="button-group">
          <button 
            onClick={decomposeMessage}
            disabled={isLoading || isEnriching || !message.trim()}
            className="decompose-button simple"
          >
            {isLoading ? '🧠 Decompondo...' : '🧠 Decomposição Simples'}
          </button>
          
          <button 
            onClick={decomposeEnrichedMessage}
            disabled={isLoading || isEnriching || !message.trim()}
            className="decompose-button enriched"
          >
            {isEnriching ? '🔮 Enriquecendo...' : '🔮 Decomposição + Embeddings'}
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}

      {(decomposition || enrichedDecomposition) && (
        <div className="decomposition-results">
          <div className="results-header">
            <h3>📋 Resultado da Decomposição</h3>
            <div className="tab-buttons">
              {decomposition && (
                <button 
                  className={`tab-button ${activeTab === 'simple' ? 'active' : ''}`}
                  onClick={() => setActiveTab('simple')}
                >
                  🧠 Simples
                </button>
              )}
              {enrichedDecomposition && (
                <button 
                  className={`tab-button ${activeTab === 'enriched' ? 'active' : ''}`}
                  onClick={() => setActiveTab('enriched')}
                >
                  🔮 Enriquecida
                </button>
              )}
            </div>
          </div>

          {activeTab === 'simple' && decomposition && (
            <div className="simple-results">
              <div className="results-info">
                <span>Total de itens: {decomposition.totalItems}</span>
                <span>Processado em: {new Date(decomposition.timestamp).toLocaleString()}</span>
              </div>

              <div className="original-message">
                <h4>📝 Mensagem Original:</h4>
                <p>{decomposition.originalMessage}</p>
              </div>

              <div className="decomposed-items">
                <h4>🔍 Componentes Decompostos:</h4>
                {decomposition.decomposedItems.map((item, index) => (
                  <div key={index} className="decomposed-item">
                    <div className="item-header">
                      <span 
                        className="item-number"
                        style={{ backgroundColor: getTypeColor(index) }}
                      >
                        #{index + 1}
                      </span>
                    </div>
                    
                    <div className="item-content">
                      {item}
                    </div>

                    <div className="item-id">
                      ID: item_{index}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'enriched' && enrichedDecomposition && (
            <div className="enriched-results">
              <div className="results-info">
                <span>Total de itens enriquecidos: {enrichedDecomposition.enrichedItems?.length || 0}</span>
                <span>Processado em: {new Date(enrichedDecomposition.timestamp).toLocaleString()}</span>
              </div>

              <div className="original-message">
                <h4>📝 Mensagem Original:</h4>
                <p>{enrichedDecomposition.originalMessage}</p>
              </div>

              <div className="enriched-items">
                <h4>� Componentes Enriquecidos com Contexto:</h4>
                {enrichedDecomposition.enrichedItems?.map((enrichedItem, index) => (
                  <div key={index} className="enriched-item">
                    <div className="item-header">
                      <span 
                        className="item-number"
                        style={{ backgroundColor: getTypeColor(index) }}
                      >
                        #{index + 1}
                      </span>
                      <div className="embedding-info">
                        🔢 {enrichedItem.embedding?.length || 0} dims
                      </div>
                    </div>
                    
                    <div className="item-content">
                      <strong>Content:</strong> {enrichedItem.item}
                    </div>


                    {enrichedItem.relatedContext && enrichedItem.relatedContext.length > 0 && (
                      <div className="context-sources">
                        <h5>📚 Contexto Relacionado ({enrichedItem.relatedContext.length}):</h5>
                        {enrichedItem.relatedContext.map((context, ctxIndex) => (
                          <div key={context.id} className="context-item">
                            <div className="context-score">
                              Score: {(context.score * 100).toFixed(1)}%
                            </div>
                            <div className="context-content">
                              {context.content.substring(0, 200)}
                              {context.content.length > 200 ? '...' : ''}
                            </div>
                            {context.metadata?.fallback && (
                              <div className="fallback-indicator">
                                🔄 Busca local (Qdrant indisponível)
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="item-id">
                      ID: item_{index}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="next-steps">
            <h4>🚀 Pipeline de Raciocínio Estruturado:</h4>
            <div className="llm-indicator">
              <span className="ai-badge">🧠 Powered by LLM + Qdrant</span>
              <small>Análise semântica com embeddings e busca vetorial</small>
            </div>
            <ol>
              <li className={decomposition || enrichedDecomposition ? 'completed' : ''}>
                <strong>Decomposição Inteligente</strong> - 
                {decomposition || enrichedDecomposition ? 
                  ` ✅ Analisado e decomposto em ${(decomposition?.totalItems || enrichedDecomposition?.enrichedItems?.length || 0)} itens` : 
                  ' ⏳ Aguardando análise'
                }
              </li>
              <li className={enrichedDecomposition ? 'completed' : ''}>
                <strong>Gerar embeddings</strong> - 
                {enrichedDecomposition ? 
                  ' ✅ Embeddings gerados para todos os itens' : 
                  ' ⏳ Para cada item decomposto'
                }
              </li>
              <li className={enrichedDecomposition ? 'completed' : ''}>
                <strong>Buscar contexto no Qdrant</strong> - 
                {enrichedDecomposition ? 
                  ' ✅ Contexto recuperado usando similaridade vetorial' : 
                  ' ⏳ Usando similaridade vetorial'
                }
              </li>
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
