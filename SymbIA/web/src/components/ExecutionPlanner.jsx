import { useState } from 'react';

function ExecutionPlanner() {
  const [message, setMessage] = useState('');
  const [executionPlan, setExecutionPlan] = useState(null);
  const [enrichedDecomposition, setEnrichedDecomposition] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const createExecutionPlan = async () => {
    if (!message.trim()) {
      setError('Por favor, digite uma mensagem para processar');
      return;
    }

    setIsLoading(true);
    setError('');
    setExecutionPlan(null);
    setEnrichedDecomposition(null);

    try {
      const response = await fetch('http://localhost:3002/api/decompose/plan', {
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
      setEnrichedDecomposition(data.data.enrichedDecomposition);
      setExecutionPlan(data.data.executionPlan);
    } catch (err) {
      setError(`Erro ao criar plano de execução: ${err.message}`);
      console.error('Execution plan error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusInfo = {
      'pending': { class: 'is-warning', label: 'Pendente' },
      'in_progress': { class: 'is-info', label: 'Em Progresso' },
      'completed': { class: 'is-success', label: 'Concluído' },
      'failed': { class: 'is-danger', label: 'Falhou' },
    };
    
    const info = statusInfo[status] || statusInfo['pending'];
    
    return (
      <span className={`tag ${info.class}`}>
        {info.label}
      </span>
    );
  };

  return (
    <div className="has-text-white">
      {/* Header Section */}
      <div className="mb-6">
        <h2 className="title is-3 has-text-white mb-3">
          <span className="icon is-large mr-3">
            <i className="fas fa-project-diagram has-text-info"></i>
          </span>
          Planejador de Execução SymbIA
        </h2>
        <div className="notification is-info is-light">
          <p className="has-text-dark">
            <strong>Etapa 4:</strong> Digite uma mensagem e veja como a IA cria um plano de execução ordenado 
            com base nos itens decompostos e no contexto recuperado.
          </p>
        </div>
      </div>

      {/* Input Section */}
      <div className="box has-background-grey-dark mb-6">
        <div className="field">
          <label className="label has-text-white">Mensagem para Planejamento</label>
          <div className="control">
            <textarea
              className="textarea has-background-grey-darker has-text-white is-large"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Digite sua mensagem aqui... Ex: 'Crie um relatório de vendas dos últimos 3 meses e envie para a diretoria' ou 'Automatize o processo de backup e retenção de arquivos'"
              rows={4}
              style={{ border: '1px solid hsl(0, 0%, 48%)', borderRadius: '8px' }}
            />
          </div>
        </div>
        
        <div className="field has-text-centered">
          <div className="control">
            <button 
              className={`button is-info is-medium ${isLoading ? 'is-loading' : ''}`}
              onClick={createExecutionPlan}
              disabled={isLoading || !message.trim()}
            >
              <span className="icon">
                <i className="fas fa-project-diagram"></i>
              </span>
              <span>{isLoading ? 'Planejando...' : 'Criar Plano de Execução'}</span>
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

      {/* Execution Plan Results */}
      {executionPlan && (
        <div className="box has-background-grey-dark">
          <div className="mb-5">
            <h3 className="title is-4 has-text-white">
              <span className="icon mr-2">
                <i className="fas fa-clipboard-list"></i>
              </span>
              Plano de Execução
            </h3>
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
                <p className="is-size-5">{executionPlan.originalMessage}</p>
              </div>
            </div>
          </div>

          {/* Plan Actions */}
          <div className="mb-5">
            <h4 className="title is-4 has-text-white mb-4">
              <span className="icon mr-2">
                <i className="fas fa-tasks"></i>
              </span>
              Ações Planejadas ({executionPlan.actions.length})
            </h4>
            
            <div className="timeline">
              {executionPlan.actions.map((action, index) => (
                <div key={index} className="card has-background-grey-darker mb-4">
                  <div className="card-header">
                    <div className="card-header-title">
                      <div className="level is-mobile" style={{ width: '100%' }}>
                        <div className="level-left">
                          <div className="level-item">
                            <span className={`tag is-large mr-3 ${
                              (action.stepNumber - 1) % 6 === 0 ? 'is-success' :
                              (action.stepNumber - 1) % 6 === 1 ? 'is-info' :
                              (action.stepNumber - 1) % 6 === 2 ? 'is-warning' :
                              (action.stepNumber - 1) % 6 === 3 ? 'is-danger' :
                              (action.stepNumber - 1) % 6 === 4 ? 'is-primary' : 'is-link'
                            }`}>
                              Passo {action.stepNumber}
                            </span>
                            <span className="title is-6 has-text-white">{action.actionName}</span>
                          </div>
                        </div>
                        <div className="level-right">
                          <div className="level-item">
                            {getStatusBadge(action.status)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-content">
                    <div className="content has-text-white mb-4">
                      <p className="is-size-6">{action.actionDescription}</p>
                    </div>

                    <div className="notification is-dark">
                      <div className="columns">
                        <div className="column">
                          <h6 className="title is-6 has-text-white mb-2">
                            <span className="icon is-small mr-1">
                              <i className="fas fa-link"></i>
                            </span>
                            Item Relacionado
                          </h6>
                          <div className="tags has-addons">
                            <span className="tag is-dark">#{action.itemIndex + 1}</span>
                            <span className="tag is-info">
                              {enrichedDecomposition?.decomposedItems[action.itemIndex]?.substring(0, 50) || 'Item não encontrado'}
                              {(enrichedDecomposition?.decomposedItems[action.itemIndex]?.length || 0) > 50 ? '...' : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <h6 className="title is-6 has-text-white mb-2">
                          <span className="icon is-small mr-1">
                            <i className="fas fa-lightbulb"></i>
                          </span>
                          Justificativa
                        </h6>
                        <p className="has-text-white-ter is-size-6">{action.justification}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pipeline Steps */}
          <div className="card has-background-info-dark">
            <div className="card-header">
              <p className="card-header-title has-text-white">
                <span className="icon mr-2">
                  <i className="fas fa-rocket"></i>
                </span>
                Pipeline de Raciocínio Estruturado
              </p>
            </div>
            <div className="card-content">
              <div className="notification is-info is-light mb-4">
                <div className="level is-mobile">
                  <div className="level-left">
                    <div className="level-item">
                      <span className="tag is-info">
                        <span className="icon is-small mr-1">
                          <i className="fas fa-brain"></i>
                        </span>
                        Powered by LLM + Qdrant
                      </span>
                    </div>
                  </div>
                  <div className="level-right">
                    <div className="level-item">
                      <small className="has-text-dark">Análise semântica com embeddings, busca vetorial e planejamento inteligente</small>
                    </div>
                  </div>
                </div>
              </div>

              <div className="content has-text-white">
                <ol className="is-size-6">
                  <li className="mb-3 has-text-success">
                    <strong>Decomposição Inteligente</strong> - 
                    <span className="tag is-success ml-2">
                      ✅ Analisado e decomposto em {enrichedDecomposition?.enrichedItems?.length || 0} itens
                    </span>
                  </li>
                  <li className="mb-3 has-text-success">
                    <strong>Gerar embeddings</strong> - 
                    <span className="tag is-success ml-2">✅ Embeddings gerados para todos os itens</span>
                  </li>
                  <li className="mb-3 has-text-success">
                    <strong>Buscar contexto no Qdrant</strong> - 
                    <span className="tag is-success ml-2">✅ Contexto recuperado usando similaridade vetorial</span>
                  </li>
                  <li className="mb-3 has-text-success">
                    <strong>Criar plano de ações</strong> - 
                    <span className="tag is-success ml-2">✅ Plano com {executionPlan.actions.length} ações criado</span>
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

export default ExecutionPlanner;
