import { useState } from 'react';

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

  return (
    <div className="has-text-white">
      {/* Header Section */}
      <div className="mb-6">
        <h2 className="title is-3 has-text-white mb-3">
          <span className="icon is-large mr-3">
            <i className="fas fa-brain has-text-primary"></i>
          </span>
          Decompositor Inteligente SymbIA
        </h2>
        <div className="notification is-info is-light">
          <p className="has-text-dark">
            <strong>Etapa 2:</strong> Digite uma mensagem e veja como a IA a decompõe em componentes isolados e específicos, 
            agora com embeddings e busca de contexto vetorial.
          </p>
        </div>
      </div>

      {/* Input Section */}
      <div className="box has-background-grey-dark mb-6">
        <div className="field">
          <label className="label has-text-white">Mensagem para Decomposição</label>
          <div className="control">
            <textarea
              className="textarea has-background-grey-darker has-text-white is-large"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Digite sua mensagem aqui... Ex: 'agende para desligar as luzes daqui 10min' ou 'crie um sistema de busca com embeddings'"
              rows={4}
              style={{ border: '1px solid hsl(0, 0%, 48%)', borderRadius: '8px' }}
            />
          </div>
        </div>
        
        <div className="field is-grouped is-grouped-centered">
          <div className="control">
            <button 
              className={`button is-primary is-medium ${isLoading ? 'is-loading' : ''}`}
              onClick={decomposeMessage}
              disabled={isLoading || isEnriching || !message.trim()}
            >
              <span className="icon">
                <i className="fas fa-brain"></i>
              </span>
              <span>{isLoading ? 'Decompondo...' : 'Decomposição Simples'}</span>
            </button>
          </div>
          
          <div className="control">
            <button 
              className={`button is-danger is-medium ${isEnriching ? 'is-loading' : ''}`}
              onClick={decomposeEnrichedMessage}
              disabled={isLoading || isEnriching || !message.trim()}
            >
              <span className="icon">
                <i className="fas fa-magic"></i>
              </span>
              <span>{isEnriching ? 'Enriquecendo...' : 'Decomposição + Embeddings'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="notification is-danger mb-6">
          <button className="delete" onClick={() => setError('')}></button>
          <strong>Erro:</strong> {error}
        </div>
      )}

      {/* Results Section */}
      {(decomposition || enrichedDecomposition) && (
        <div className="box has-background-grey-dark">
          {/* Tab Navigation */}
          <div className="tabs is-centered is-boxed mb-5">
            <ul>
              {decomposition && (
                <li className={activeTab === 'simple' ? 'is-active' : ''}>
                  <a onClick={() => setActiveTab('simple')}>
                    <span className="icon is-small">
                      <i className="fas fa-brain"></i>
                    </span>
                    <span>Decomposição Simples</span>
                  </a>
                </li>
              )}
              {enrichedDecomposition && (
                <li className={activeTab === 'enriched' ? 'is-active' : ''}>
                  <a onClick={() => setActiveTab('enriched')}>
                    <span className="icon is-small">
                      <i className="fas fa-magic"></i>
                    </span>
                    <span>Decomposição Enriquecida</span>
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Simple Results */}
          {activeTab === 'simple' && decomposition && (
            <div>
              {/* Results Info */}
              <div className="level mb-5">
                <div className="level-left">
                  <div className="level-item">
                    <div className="tags has-addons">
                      <span className="tag is-dark">Total de itens</span>
                      <span className="tag is-primary">{decomposition.totalItems}</span>
                    </div>
                  </div>
                </div>
                <div className="level-right">
                  <div className="level-item">
                    <div className="tags has-addons">
                      <span className="tag is-dark">Processado em</span>
                      <span className="tag is-info">{new Date(decomposition.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Original Message */}
              <div className="card has-background-grey-darker mb-5">
                <div className="card-header">
                  <p className="card-header-title has-text-white">
                    <span className="icon mr-2">
                      <i className="fas fa-file-alt"></i>
                    </span>
                    Mensagem Original
                  </p>
                </div>
                <div className="card-content">
                  <div className="content has-text-white">
                    <p className="is-size-5">{decomposition.originalMessage}</p>
                  </div>
                </div>
              </div>

              {/* Decomposed Items */}
              <div className="mb-5">
                <h4 className="title is-4 has-text-white mb-4">
                  <span className="icon mr-2">
                    <i className="fas fa-puzzle-piece"></i>
                  </span>
                  Componentes Decompostos
                </h4>
                
                <div className="columns is-multiline">
                  {decomposition.decomposedItems.map((item, index) => (
                    <div key={index} className="column is-6">
                      <div className="card has-background-grey-darker">
                        <div className="card-header">
                          <div className="card-header-title">
                            <span className={`tag is-rounded mr-3 ${
                              index % 6 === 0 ? 'is-success' :
                              index % 6 === 1 ? 'is-info' :
                              index % 6 === 2 ? 'is-warning' :
                              index % 6 === 3 ? 'is-danger' :
                              index % 6 === 4 ? 'is-primary' : 'is-link'
                            }`}>
                              #{index + 1}
                            </span>
                            <span className="has-text-grey-light">item_{index}</span>
                          </div>
                        </div>
                        <div className="card-content">
                          <div className="content has-text-white">
                            <p>{item}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Enriched Results */}
          {activeTab === 'enriched' && enrichedDecomposition && (
            <div>
              {/* Results Info */}
              <div className="level mb-5">
                <div className="level-left">
                  <div className="level-item">
                    <div className="tags has-addons">
                      <span className="tag is-dark">Itens enriquecidos</span>
                      <span className="tag is-danger">{enrichedDecomposition.enrichedItems?.length || 0}</span>
                    </div>
                  </div>
                </div>
                <div className="level-right">
                  <div className="level-item">
                    <div className="tags has-addons">
                      <span className="tag is-dark">Processado em</span>
                      <span className="tag is-info">{new Date(enrichedDecomposition.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Original Message */}
              <div className="card has-background-grey-darker mb-5">
                <div className="card-header">
                  <p className="card-header-title has-text-white">
                    <span className="icon mr-2">
                      <i className="fas fa-file-alt"></i>
                    </span>
                    Mensagem Original
                  </p>
                </div>
                <div className="card-content">
                  <div className="content has-text-white">
                    <p className="is-size-5">{enrichedDecomposition.originalMessage}</p>
                  </div>
                </div>
              </div>

              {/* Enriched Items */}
              <div className="mb-5">
                <h4 className="title is-4 has-text-white mb-4">
                  <span className="icon mr-2">
                    <i className="fas fa-magic"></i>
                  </span>
                  Componentes Enriquecidos com Contexto
                </h4>
                
                {enrichedDecomposition.enrichedItems?.map((enrichedItem, index) => (
                  <div key={index} className="card has-background-grey-darker mb-4">
                    <div className="card-header">
                      <div className="card-header-title">
                        <span className={`tag is-rounded mr-3 ${
                          index % 6 === 0 ? 'is-success' :
                          index % 6 === 1 ? 'is-info' :
                          index % 6 === 2 ? 'is-warning' :
                          index % 6 === 3 ? 'is-danger' :
                          index % 6 === 4 ? 'is-primary' : 'is-link'
                        }`}>
                          #{index + 1}
                        </span>
                        <span className="has-text-grey-light">item_{index}</span>
                        <div className="tags ml-auto">
                          <span className="tag is-dark">
                            <span className="icon is-small mr-1">
                              <i className="fas fa-code"></i>
                            </span>
                            {enrichedItem.embedding?.length || 0} dims
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="card-content">
                      <div className="content has-text-white mb-4">
                        <strong className="has-text-primary">Conteúdo:</strong>
                        <p className="mt-2">{enrichedItem.item}</p>
                      </div>

                      {/* Related Context */}
                      {enrichedItem.relatedContext && enrichedItem.relatedContext.length > 0 && (
                        <div className="box has-background-grey">
                          <h5 className="title is-6 has-text-white mb-3">
                            <span className="icon mr-2">
                              <i className="fas fa-book"></i>
                            </span>
                            Contexto Relacionado ({enrichedItem.relatedContext.length})
                          </h5>
                          
                          {enrichedItem.relatedContext.map((context, ctxIndex) => (
                            <div key={context.id} className="notification is-dark mb-3">
                              <div className="level is-mobile mb-2">
                                <div className="level-left">
                                  <div className="level-item">
                                    <span className="tag is-success">
                                      Score: {(context.score * 100).toFixed(1)}%
                                    </span>
                                  </div>
                                </div>
                                {context.metadata?.fallback && (
                                  <div className="level-right">
                                    <div className="level-item">
                                      <span className="tag is-warning">
                                        <span className="icon is-small mr-1">
                                          <i className="fas fa-sync-alt"></i>
                                        </span>
                                        Busca local
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="content has-text-white-ter is-size-7">
                                {context.content.substring(0, 200)}
                                {context.content.length > 200 ? '...' : ''}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pipeline Steps */}
          <div className="card has-background-primary-dark">
            <div className="card-header">
              <p className="card-header-title has-text-white">
                <span className="icon mr-2">
                  <i className="fas fa-rocket"></i>
                </span>
                Pipeline de Raciocínio Estruturado
              </p>
            </div>
            <div className="card-content">
              <div className="notification is-primary is-light mb-4">
                <div className="level is-mobile">
                  <div className="level-left">
                    <div className="level-item">
                      <span className="tag is-primary">
                        <span className="icon is-small mr-1">
                          <i className="fas fa-brain"></i>
                        </span>
                        Powered by LLM + Qdrant
                      </span>
                    </div>
                  </div>
                  <div className="level-right">
                    <div className="level-item">
                      <small className="has-text-dark">Análise semântica com embeddings e busca vetorial</small>
                    </div>
                  </div>
                </div>
              </div>

              <div className="content has-text-white">
                <ol className="is-size-6">
                  <li className={`mb-3 ${decomposition || enrichedDecomposition ? 'has-text-success' : 'has-text-grey-light'}`}>
                    <strong>Decomposição Inteligente</strong> - 
                    {decomposition || enrichedDecomposition ? (
                      <span className="tag is-success ml-2">
                        ✅ Analisado e decomposto em {(decomposition?.totalItems || enrichedDecomposition?.enrichedItems?.length || 0)} itens
                      </span>
                    ) : (
                      <span className="tag is-warning ml-2">⏳ Aguardando análise</span>
                    )}
                  </li>
                  <li className={`mb-3 ${enrichedDecomposition ? 'has-text-success' : 'has-text-grey-light'}`}>
                    <strong>Gerar embeddings</strong> - 
                    {enrichedDecomposition ? (
                      <span className="tag is-success ml-2">✅ Embeddings gerados para todos os itens</span>
                    ) : (
                      <span className="tag is-warning ml-2">⏳ Para cada item decomposto</span>
                    )}
                  </li>
                  <li className={`mb-3 ${enrichedDecomposition ? 'has-text-success' : 'has-text-grey-light'}`}>
                    <strong>Buscar contexto no Qdrant</strong> - 
                    {enrichedDecomposition ? (
                      <span className="tag is-success ml-2">✅ Contexto recuperado usando similaridade vetorial</span>
                    ) : (
                      <span className="tag is-warning ml-2">⏳ Usando similaridade vetorial</span>
                    )}
                  </li>
                  <li className="mb-3 has-text-grey-light">
                    <strong>Criar plano de ações</strong> - 
                    <span className="tag is-warning ml-2">⏳ Baseado no contexto encontrado</span>
                  </li>
                  <li className="mb-3 has-text-grey-light">
                    <strong>Executar plano</strong> - 
                    <span className="tag is-warning ml-2">⏳ Etapa por etapa</span>
                  </li>
                  <li className="mb-3 has-text-grey-light">
                    <strong>Gerar resposta final</strong> - 
                    <span className="tag is-warning ml-2">⏳ Com resumo para memória</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MessageDecomposer;
