import React, { useState } from 'react';

const PipelineExecutor = () => {
  const [message, setMessage] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const executePipeline = async () => {
    if (!message.trim()) {
      setError('Por favor, digite uma mensagem para executar o pipeline');
      return;
    }

    setIsExecuting(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('http://localhost:3002/api/pipeline/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received pipeline result:', data); // Debug log
      console.log('Final response:', data.data?.executionReport?.finalResponse); // Debug final response
      console.log('Step results:', data.data?.executionReport?.stepResults); // Debug step results
      setResult(data);
    } catch (err) {
      setError(err.message || 'Erro ao executar o pipeline');
      console.error('Pipeline execution error:', err);
    } finally {
      setIsExecuting(false);
    }
  };

  const formatExecutionTime = (ms) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'success':
        return <span className="tag is-success">✅ Sucesso</span>;
      case 'failed':
        return <span className="tag is-danger">❌ Falha</span>;
      case 'completed':
        return <span className="tag is-info">✅ Concluído</span>;
      default:
        return <span className="tag is-light">⏳ Processando</span>;
    }
  };

  const formatText = (text) => {
    if (!text) return '';
    return text.split('\n').map((line, index) => (
      <div key={index}>
        {line.replace(/\*\*(.*?)\*\*/g, '$1')} {/* Remove ** bold markers */}
      </div>
    ));
  };

  return (
    <div className="has-text-white">
      {/* Header Section */}
      <div className="mb-6">
        <h2 className="title is-3 has-text-white mb-3">
          <span className="icon is-large mr-3">
            <i className="fas fa-rocket has-text-success"></i>
          </span>
          Pipeline Executor SymbIA
        </h2>
        <div className="notification is-success is-light">
          <p className="has-text-dark">
            <strong>Etapa 5:</strong> Execute o pipeline completo: decomposição, enriquecimento, 
            planejamento e execução passo a passo.
          </p>
        </div>
      </div>

      {/* Input Section */}
      <div className="box has-background-grey-dark mb-6">
        <div className="field">
          <label className="label has-text-white">Mensagem para Execução Completa</label>
          <div className="control">
            <textarea
              className="textarea has-background-grey-darker has-text-white is-large"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Digite sua mensagem aqui para executar o pipeline completo..."
              rows={4}
              disabled={isExecuting}
              style={{ border: '1px solid hsl(0, 0%, 48%)', borderRadius: '8px' }}
            />
          </div>
        </div>
        
        <div className="field has-text-centered">
          <div className="control">
            <button 
              className={`button is-success is-medium is-fullwidth ${isExecuting ? 'is-loading' : ''}`}
              onClick={executePipeline}
              disabled={isExecuting || !message.trim()}
            >
              <span className="icon">
                <i className="fas fa-rocket"></i>
              </span>
              <span>{isExecuting ? 'Executando Pipeline...' : 'Executar Pipeline Completo'}</span>
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
      {result && (
        <div className="box has-background-grey-dark">
          <div className="mb-6">
            <h3 className="title is-3 has-text-success">
              <span className="icon mr-2">
                <i className="fas fa-check-circle"></i>
              </span>
              Resultado da Execução
            </h3>
          </div>
          
          {/* Execution Summary */}
          <div className="card has-background-grey-darker mb-6">
            <div className="card-header">
              <p className="card-header-title has-text-white">
                <span className="icon mr-2">
                  <i className="fas fa-chart-bar"></i>
                </span>
                Resumo da Execução
              </p>
            </div>
            <div className="card-content">
              <div className="columns is-multiline">
                <div className="column is-3">
                  <div className="has-text-centered">
                    <div className="title is-4 has-text-info">{result.data.executionReport.summary.totalSteps}</div>
                    <div className="subtitle is-6 has-text-grey-light">Total de Passos</div>
                  </div>
                </div>
                <div className="column is-3">
                  <div className="has-text-centered">
                    <div className="title is-4 has-text-success">{result.data.executionReport.summary.successfulSteps}</div>
                    <div className="subtitle is-6 has-text-grey-light">Sucessos</div>
                  </div>
                </div>
                <div className="column is-3">
                  <div className="has-text-centered">
                    <div className="title is-4 has-text-danger">{result.data.executionReport.summary.failedSteps}</div>
                    <div className="subtitle is-6 has-text-grey-light">Falhas</div>
                  </div>
                </div>
                <div className="column is-3">
                  <div className="has-text-centered">
                    <div className="title is-4 has-text-warning">{formatExecutionTime(result.data.executionReport.summary.totalExecutionTime)}</div>
                    <div className="subtitle is-6 has-text-grey-light">Tempo Total</div>
                  </div>
                </div>
              </div>
              
              {result.data.executionReport.wasReplanned && (
                <div className="notification is-warning">
                  <span className="icon mr-2">
                    <i className="fas fa-sync-alt"></i>
                  </span>
                  <strong>Replanejamento Executado:</strong> O plano foi ajustado durante a execução
                </div>
              )}
            </div>
          </div>

          {/* Final Response */}
          <div className="card has-background-success-dark mb-6">
            <div className="card-header">
              <p className="card-header-title has-text-white">
                <span className="icon mr-2">
                  <i className="fas fa-comment-dots"></i>
                </span>
                Resposta Final
              </p>
            </div>
            <div className="card-content">
              <div className="box has-background-white">
                <div className="content has-text-dark">
                  {(() => {
                    const finalResponse = result.data?.executionReport?.finalResponse;
                    if (!finalResponse || finalResponse.trim().length === 0) {
                      return (
                        <div className="has-text-grey has-text-centered" style={{ fontStyle: 'italic' }}>
                          <span className="icon mr-2">
                            <i className="fas fa-hourglass-half"></i>
                          </span>
                          Aguardando resposta final...
                        </div>
                      );
                    }
                    return formatText(finalResponse);
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* Step Details */}
          <div className="mb-6">
            <h4 className="title is-4 has-text-white mb-4">
              <span className="icon mr-2">
                <i className="fas fa-list-ol"></i>
              </span>
              Detalhes da Execução
            </h4>
            
            {result.data?.executionReport?.stepResults?.length > 0 ? (
              result.data.executionReport.stepResults.map((step, index) => (
                <div key={index} className="card has-background-grey-darker mb-4">
                  <div className="card-header">
                    <div className="card-header-title">
                      <div className="level is-mobile" style={{ width: '100%' }}>
                        <div className="level-left">
                          <div className="level-item">
                            {getStatusBadge(step.status)}
                            <span className="title is-6 has-text-white ml-3">
                              {step.stepNumber}. {step.actionName}
                            </span>
                          </div>
                        </div>
                        <div className="level-right">
                          <div className="level-item">
                            <span className="tag is-info">
                              <span className="icon is-small mr-1">
                                <i className="fas fa-clock"></i>
                              </span>
                              {formatExecutionTime(step.executionTime || 0)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-content">
                    {/* Result */}
                    <div className="notification is-success is-light mb-3">
                      <h6 className="title is-6 has-text-dark mb-2">
                        <span className="icon is-small mr-1">
                          <i className="fas fa-check-circle"></i>
                        </span>
                        Resultado
                      </h6>
                      <div className="content has-text-dark">
                        {step.result ? (
                          typeof step.result === 'string' 
                            ? (step.result.length > 0 
                                ? formatText(step.result.substring(0, 500) + (step.result.length > 500 ? '...' : ''))
                                : <em>Resultado vazio</em>
                              )
                            : <pre className="has-background-grey-lighter p-3" style={{ borderRadius: '4px' }}>
                                {JSON.stringify(step.result, null, 2)}
                              </pre>
                        ) : (
                          <em>
                            {step.status === 'success' 
                              ? 'Passo executado com sucesso, mas sem resultado detalhado'
                              : 'Nenhum resultado disponível'
                            }
                          </em>
                        )}
                      </div>
                    </div>
                    
                    {/* Error */}
                    {step.error && (
                      <div className="notification is-danger is-light">
                        <h6 className="title is-6 has-text-dark mb-2">
                          <span className="icon is-small mr-1">
                            <i className="fas fa-exclamation-triangle"></i>
                          </span>
                          Erro
                        </h6>
                        <p className="has-text-dark">{step.error}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="notification is-light has-text-centered">
                <p className="has-text-grey" style={{ fontStyle: 'italic' }}>
                  <span className="icon mr-2">
                    <i className="fas fa-info-circle"></i>
                  </span>
                  Nenhum passo de execução encontrado.
                </p>
              </div>
            )}
          </div>

          {/* Key Results */}
          {result.data?.executionReport?.summary?.keyResults?.length > 0 && (
            <div className="card has-background-success-dark mb-6">
              <div className="card-header">
                <p className="card-header-title has-text-white">
                  <span className="icon mr-2">
                    <i className="fas fa-trophy"></i>
                  </span>
                  Principais Resultados
                </p>
              </div>
              <div className="card-content">
                <div className="content has-text-white">
                  <ul>
                    {result.data.executionReport.summary.keyResults.map((keyResult, index) => (
                      <li key={index} className="mb-2">{keyResult}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Errors Found */}
          {result.data?.executionReport?.summary?.errors?.length > 0 && (
            <div className="card has-background-danger-dark mb-6">
              <div className="card-header">
                <p className="card-header-title has-text-white">
                  <span className="icon mr-2">
                    <i className="fas fa-exclamation-triangle"></i>
                  </span>
                  Erros Encontrados
                </p>
              </div>
              <div className="card-content">
                <div className="content has-text-white">
                  <ul>
                    {result.data.executionReport.summary.errors.map((error, index) => (
                      <li key={index} className="mb-2">{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Context for Next Iteration */}
          <div className="card has-background-info-dark mb-6">
            <div className="card-header">
              <p className="card-header-title has-text-white">
                <span className="icon mr-2">
                  <i className="fas fa-sync-alt"></i>
                </span>
                Contexto para Próxima Iteração
              </p>
            </div>
            <div className="card-content">
              <div className="content has-text-white">
                <p>{result.data?.executionReport?.summary?.contextForNextIteration || 'Contexto não disponível'}</p>
              </div>
            </div>
          </div>

          {/* Technical Data */}
          <details className="card has-background-grey-darker">
            <summary className="card-header" style={{ cursor: 'pointer' }}>
              <p className="card-header-title has-text-white">
                <span className="icon mr-2">
                  <i className="fas fa-cogs"></i>
                </span>
                Dados Técnicos
              </p>
            </summary>
            <div className="card-content">
              <div className="content has-text-white">
                {/* Original Decomposition */}
                <div className="mb-5">
                  <h5 className="title is-5 has-text-white">Decomposição Original</h5>
                  <div className="box has-background-grey">
                    <ul className="has-text-white">
                      {result.data?.enrichedDecomposition?.decomposedItems?.length > 0 ? (
                        result.data.enrichedDecomposition.decomposedItems.map((item, index) => (
                          <li key={index} className="mb-2">{item}</li>
                        ))
                      ) : (
                        <li>Nenhum item de decomposição disponível</li>
                      )}
                    </ul>
                  </div>
                </div>
                
                {/* Execution Plan */}
                <div>
                  <h5 className="title is-5 has-text-white">Plano de Execução</h5>
                  <div className="box has-background-grey">
                    <ul className="has-text-white">
                      {result.data?.executionPlan?.actions?.length > 0 ? (
                        result.data.executionPlan.actions.map((action, index) => (
                          <li key={index} className="mb-4">
                            <strong>{action.actionName}:</strong> {action.actionDescription}
                            <br />
                            <em className="has-text-grey-light is-size-7">
                              Justificativa: {action.justification}
                            </em>
                          </li>
                        ))
                      ) : (
                        <li>Nenhuma ação do plano disponível</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </details>
        </div>
      )}
    </div>
  );
};

export default PipelineExecutor;
