import { useState } from 'react';

function ExecutionPlanner() {
  const [message, setMessage] = useState('');
  const [executionPlan, setExecutionPlan] = useState(null);
  const [enrichedDecomposition, setEnrichedDecomposition] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const createExecutionPlan = async () => {
    if (!message.trim()) {
      setError('Please enter a message to process');
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
      setError(`Error creating execution plan: ${err.message}`);
      console.error('Execution plan error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusInfo = {
      'pending': { class: 'is-warning', label: 'Pending' },
      'in_progress': { class: 'is-info', label: 'In Progress' },
      'completed': { class: 'is-success', label: 'Completed' },
      'failed': { class: 'is-danger', label: 'Failed' },
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
          SymbIA Execution Planner
        </h2>
        <div className="notification is-info is-light">
          <p className="has-text-dark">
            <strong>Step 4:</strong> Enter a message and see how AI creates an ordered execution plan 
            based on decomposed items and retrieved context.
          </p>
        </div>
      </div>

      {/* Input Section */}
      <div className="box has-background-grey-dark mb-6">
        <div className="field">
          <label className="label has-text-white">Message for Planning</label>
          <div className="control">
            <textarea
              className="textarea has-background-grey-darker has-text-white is-large"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message here... Ex: 'Create a sales report for the last 3 months and send to management' or 'Automate the backup and file retention process'"
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
              <span>{isLoading ? 'Planning...' : 'Create Execution Plan'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="notification is-danger mb-6">
          <button className="delete" onClick={() => setError('')}></button>
          <strong>Error:</strong> {error}
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
              Execution Plan
            </h3>
          </div>

          {/* Original Message */}
          <div className="card has-background-grey-darker mb-5">
            <div className="card-header">
              <p className="card-header-title has-text-white">
                <span className="icon mr-2">
                  <i className="fas fa-file-alt"></i>
                </span>                    Original Message
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
              Planned Actions ({executionPlan.actions.length})
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
                              Step {action.stepNumber}
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
                            Related Item
                          </h6>
                          <div className="tags has-addons">
                            <span className="tag is-dark">#{action.itemIndex + 1}</span>
                            <span className="tag is-info">
                              {enrichedDecomposition?.decomposedItems[action.itemIndex]?.substring(0, 50) || 'Item not found'}
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
                          Justification
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
                Structured Reasoning Pipeline
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
                      <small className="has-text-dark">Semantic analysis with embeddings, vector search and intelligent planning</small>
                    </div>
                  </div>
                </div>
              </div>

              <div className="content has-text-white">
                <ol className="is-size-6">
                  <li className="mb-3 has-text-success">
                    <strong>Decomposição Inteligente</strong> - 
                    <span className="tag is-success ml-2">
                      ✅ Analyzed and decomposed into {enrichedDecomposition?.enrichedItems?.length || 0} items
                    </span>
                  </li>
                  <li className="mb-3 has-text-success">
                    <strong>Generate embeddings</strong> - 
                    <span className="tag is-success ml-2">✅ Embeddings generated for all items</span>
                  </li>
                  <li className="mb-3 has-text-success">
                    <strong>Search context in Qdrant</strong> - 
                    <span className="tag is-success ml-2">✅ Context retrieved using vector similarity</span>
                  </li>
                  <li className="mb-3 has-text-success">
                    <strong>Create action plan</strong> - 
                    <span className="tag is-success ml-2">✅ Plan with {executionPlan.actions.length} actions created</span>
                  </li>
                  <li className="mb-3 has-text-grey-light">
                    <strong>Execute plan</strong> - 
                    <span className="tag is-warning ml-2">⏳ Step by step</span>
                  </li>
                  <li className="mb-3 has-text-grey-light">
                    <strong>Generate final response</strong> - 
                    <span className="tag is-warning ml-2">⏳ With summary for memory</span>
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
