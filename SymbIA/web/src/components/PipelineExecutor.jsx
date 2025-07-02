import React, { useState } from 'react';
import './PipelineExecutor.css';

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return '#4CAF50';
      case 'failed':
        return '#f44336';
      case 'completed':
        return '#2196F3';
      default:
        return '#757575';
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
    <div className="container">
      <section className="section">
        <h2 className="title is-3 pipeline-executor">🎯 Pipeline Executor - Etapa 5</h2>
        <div className="notification is-light">
          Execute o pipeline completo: decomposição, enriquecimento, planejamento e execução passo a passo.
        </div>

        <div className="box">
          <div className="field">
            <label className="label">Mensagem</label>
            <div className="control">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Digite sua mensagem aqui para executar o pipeline completo..."
                className="textarea message-input"
                rows={4}
                disabled={isExecuting}
              />
            </div>
          </div>
          
          <div className="field">
            <div className="control">
              <button 
                onClick={executePipeline}
                disabled={isExecuting || !message.trim()}
                className="button is-primary is-fullwidth execute-button"
              >
                {isExecuting ? '🔄 Executando Pipeline...' : '🚀 Executar Pipeline Completo'}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="message is-danger">
            <div className="message-header">
              <p>❌ Erro</p>
            </div>
            <div className="message-body">
              {error}
            </div>
          </div>
        )}

        {result && (
          <div className="box">
            <h3 className="title is-4 has-text-success">✅ Resultado da Execução</h3>
            
            {/* Resumo da Execução */}
            <div className="box has-background-light">
              <h4 className="title is-5">📊 Resumo da Execução</h4>
              <div className="summary-stats mb-4">
                <div className="stat box">
                  <span className="stat-label has-text-grey">Total de Passos:</span>
                  <span className="stat-value has-text-dark">{result.data.executionReport.summary.totalSteps}</span>
                </div>
                <div className="stat box">
                  <span className="stat-label has-text-grey">Sucessos:</span>
                  <span className="stat-value has-text-success">
                    {result.data.executionReport.summary.successfulSteps}
                  </span>
                </div>
                <div className="stat box">
                  <span className="stat-label has-text-grey">Falhas:</span>
                  <span className="stat-value has-text-danger">
                    {result.data.executionReport.summary.failedSteps}
                  </span>
                </div>
                <div className="stat box">
                  <span className="stat-label has-text-grey">Tempo Total:</span>
                  <span className="stat-value has-text-dark">
                    {formatExecutionTime(result.data.executionReport.summary.totalExecutionTime)}
                  </span>
                </div>
              </div>
              
              {result.data.executionReport.wasReplanned && (
                <div className="notification is-warning">
                  🔄 <strong>Replanejamento Executado:</strong> O plano foi ajustado durante a execução
                </div>
              )}
            </div>

            {/* Resposta Final */}
            <div className="box has-background-success-light">
              <h4 className="title is-5 has-text-success">💬 Resposta Final</h4>
              <div className="box content">
                {(() => {
                  const finalResponse = result.data?.executionReport?.finalResponse;
                if (!finalResponse || finalResponse.trim().length === 0) {
                  return (
                    <div className="has-text-grey" style={{ fontStyle: 'italic' }}>
                      Aguardando resposta final... Se esta mensagem persistir, pode ser que o serviço esteja processando ou tenha encontrado dificuldades.
                    </div>
                  );
                }
                return formatText(finalResponse);
              })()}
              </div>
            </div>

            {/* Detalhes dos Passos */}
            <div className="mb-5">
              <h4 className="title is-5">🔍 Detalhes da Execução</h4>
              <div>
                {result.data?.executionReport?.stepResults?.length > 0 ? (
                  result.data.executionReport.stepResults.map((step, index) => (
                    <div key={index} className="box has-background-light mb-3">
                      <div className="step-header">
                        <span 
                          className="step-status"
                          style={{ color: getStatusColor(step.status) }}
                        >
                          {step.status === 'success' ? '✅' : '❌'}
                        </span>
                        <span className="step-name has-text-weight-semibold">
                          {step.stepNumber}. {step.actionName}
                        </span>
                        <span className="step-time tag is-light">
                          {formatExecutionTime(step.executionTime || 0)}
                        </span>
                      </div>
                      
                      {/* Sempre mostrar a seção de resultado */}
                      <div className="box has-background-success-light mt-3">
                        <strong>Resultado:</strong>
                        <div className="result-content">
                          {step.result ? (
                            typeof step.result === 'string' 
                              ? (step.result.length > 0 
                                  ? formatText(step.result.substring(0, 500) + (step.result.length > 500 ? '...' : ''))
                                  : <em className="has-text-grey">Resultado vazio</em>
                                )
                              : <pre>{JSON.stringify(step.result, null, 2)}</pre>
                          ) : (
                            <em className="has-text-grey">
                              {step.status === 'success' 
                                ? 'Passo executado com sucesso, mas sem resultado detalhado'
                                : 'Nenhum resultado disponível'
                              }
                            </em>
                          )}
                        </div>
                      </div>
                      
                      {step.error && (
                        <div className="box has-background-danger-light mt-3">
                          <strong className="has-text-danger">Erro:</strong> <span className="has-text-danger">{step.error}</span>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="notification is-light has-text-centered">
                    <p className="has-text-grey" style={{ fontStyle: 'italic' }}>Nenhum passo de execução encontrado.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Principais Resultados */}
            {result.data?.executionReport?.summary?.keyResults?.length > 0 && (
              <div className="mb-5">
                <h4 className="title is-5 has-text-success">🎯 Principais Resultados</h4>
                <div className="box has-background-light">
                  <ul className="content">
                    {result.data.executionReport.summary.keyResults.map((keyResult, index) => (
                      <li key={index} className="pb-2">{keyResult}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Erros Encontrados */}
            {result.data?.executionReport?.summary?.errors?.length > 0 && (
              <div className="mb-5">
                <h4 className="title is-5 has-text-danger">⚠️ Erros Encontrados</h4>
                <div className="box has-background-light">
                  <ul className="content">
                    {result.data.executionReport.summary.errors.map((error, index) => (
                      <li key={index} className="has-text-danger pb-2">{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Contexto para Próxima Iteração */}
            <div className="box has-background-info-light mb-5">
              <h4 className="title is-5 has-text-info">🔄 Contexto para Próxima Iteração</h4>
              <p className="content">{result.data?.executionReport?.summary?.contextForNextIteration || 'Contexto não disponível'}</p>
            </div>

            {/* Dados Técnicos */}
            <details className="box">
              <summary className="title is-6 has-text-grey" style={{ cursor: 'pointer' }}>🔧 Dados Técnicos</summary>
              <div className="content mt-4">
                <h5 className="subtitle is-6 has-text-grey">Decomposição Original:</h5>
                <div className="box has-background-light">
                  <ul>
                    {result.data?.enrichedDecomposition?.decomposedItems?.length > 0 ? (
                      result.data.enrichedDecomposition.decomposedItems.map((item, index) => (
                        <li key={index} className="pb-2">{item}</li>
                      ))
                    ) : (
                      <li>Nenhum item de decomposição disponível</li>
                    )}
                  </ul>
                </div>
                
                <h5 className="subtitle is-6 has-text-grey">Plano de Execução:</h5>
                <div className="box has-background-light">
                  <ul>
                    {result.data?.executionPlan?.actions?.length > 0 ? (
                      result.data.executionPlan.actions.map((action, index) => (
                        <li key={index} className="pb-3">
                          <strong>{action.actionName}:</strong> {action.actionDescription}
                          <br />
                          <em className="has-text-grey is-size-7">Justificativa: {action.justification}</em>
                        </li>
                      ))
                    ) : (
                      <li>Nenhuma ação do plano disponível</li>
                    )}
                  </ul>
                </div>
              </div>
            </details>
          </div>
        )}
      </section>
    </div>
  );
};

export default PipelineExecutor;
