import { useState } from 'react';
import './ExecutionPlanner.css';

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

  const getTypeColor = (index) => {
    const colors = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#607D8B', '#795548'];
    return colors[index % colors.length];
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'pending': { bg: '#FFB74D', text: '#212121', label: 'Pendente' },
      'in_progress': { bg: '#42A5F5', text: '#FFFFFF', label: 'Em Progresso' },
      'completed': { bg: '#66BB6A', text: '#FFFFFF', label: 'Concluído' },
      'failed': { bg: '#EF5350', text: '#FFFFFF', label: 'Falhou' },
    };
    
    const style = statusColors[status] || statusColors['pending'];
    
    return (
      <span 
        className="status-badge" 
        style={{ backgroundColor: style.bg, color: style.text }}
      >
        {style.label}
      </span>
    );
  };

  return (
    <div className="execution-planner">
      <div className="planner-header">
        <h2>🧩 Planejador de Execução SymbIA - Etapa 4</h2>
        <p>Digite uma mensagem e veja como a IA cria um plano de execução ordenado com base nos itens decompostos e no contexto recuperado.</p>
      </div>

      <div className="input-section">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Digite sua mensagem aqui... Ex: 'Crie um relatório de vendas dos últimos 3 meses e envie para a diretoria' ou 'Automatize o processo de backup e retenção de arquivos'"
          rows={4}
          className="message-input"
        />
        
        <div className="button-group">
          <button 
            onClick={createExecutionPlan}
            disabled={isLoading || !message.trim()}
            className="plan-button"
          >
            {isLoading ? '🧩 Planejando...' : '🧩 Criar Plano de Execução'}
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}

      {executionPlan && (
        <div className="execution-plan-results">
          <div className="results-header">
            <h3>📋 Plano de Execução</h3>
          </div>

          <div className="original-message">
            <h4>📝 Mensagem Original:</h4>
            <p>{executionPlan.originalMessage}</p>
          </div>

          <div className="plan-actions">
            <h4>🧩 Ações Planejadas:</h4>
            {executionPlan.actions.map((action, index) => (
              <div key={index} className="plan-action">
                <div className="action-header">
                  <span 
                    className="step-number"
                    style={{ backgroundColor: getTypeColor(action.stepNumber - 1) }}
                  >
                    Passo {action.stepNumber}
                  </span>
                  <span className="action-name">{action.actionName}</span>
                  {getStatusBadge(action.status)}
                </div>
                
                <div className="action-description">
                  <p>{action.actionDescription}</p>
                </div>

                <div className="action-details">
                  <div className="item-reference">
                    <strong>Relacionado ao item:</strong> #{action.itemIndex + 1} - {enrichedDecomposition?.decomposedItems[action.itemIndex] || 'Item não encontrado'}
                  </div>
                  
                  <div className="action-justification">
                    <strong>Justificativa:</strong> {action.justification}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="next-steps">
            <h4>🚀 Pipeline de Raciocínio Estruturado:</h4>
            <div className="llm-indicator">
              <span className="ai-badge">🧠 Powered by LLM + Qdrant</span>
              <small>Análise semântica com embeddings, busca vetorial e planejamento inteligente</small>
            </div>
            <ol>
              <li className="completed">
                <strong>Decomposição Inteligente</strong> - 
                {` ✅ Analisado e decomposto em ${enrichedDecomposition?.enrichedItems?.length || 0} itens`}
              </li>
              <li className="completed">
                <strong>Gerar embeddings</strong> - 
                {' ✅ Embeddings gerados para todos os itens'}
              </li>
              <li className="completed">
                <strong>Buscar contexto no Qdrant</strong> - 
                {' ✅ Contexto recuperado usando similaridade vetorial'}
              </li>
              <li className="completed">
                <strong>Criar plano de ações</strong> - 
                {` ✅ Plano com ${executionPlan.actions.length} ações criado`}
              </li>
              <li>⏳ <strong>Executar plano</strong> - Etapa por etapa</li>
              <li>⏳ <strong>Gerar resposta final</strong> - Com resumo para memória</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExecutionPlanner;
