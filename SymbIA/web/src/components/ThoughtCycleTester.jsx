import { useState } from 'react'

function ThoughtCycleTester() {
  const [message, setMessage] = useState('')
  const [previousMessages, setPreviousMessages] = useState('')
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const executeThoughtCycle = async () => {
    if (!message.trim()) {
      setError('Please enter a message')
      return
    }

    setIsLoading(true)
    setError('')
    setResult(null)

    try {
      const requestBody = {
        originalMessage: message,
        previousMessages: previousMessages ? previousMessages.split('\n').filter(msg => msg.trim()) : [],
        executedActions: []
      }

      const response = await fetch('http://localhost:3002/api/thought/cycle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to execute thought cycle')
      }

      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const clearResults = () => {
    setResult(null)
    setError('')
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="columns">
        <div className="column is-8 is-offset-2">
          <div className="card">
            <div className="card-header">
              <p className="card-header-title">
                🧠 Thought Cycle Tester
              </p>
            </div>
            <div className="card-content">
              <div className="content">
                <p className="subtitle is-6">
                  Test the thought cycle execution with memory saving functionality.
                </p>

                <div className="field">
                  <label className="label">Original Message</label>
                  <div className="control">
                    <textarea
                      className="textarea"
                      placeholder="Enter your message here (e.g., 'Remember that I prefer React over Vue for frontend development')"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows="3"
                    />
                  </div>
                  <p className="help">
                    Try messages that contain information to save, like preferences, facts, or instructions.
                  </p>
                </div>

                <div className="field">
                  <label className="label">Previous Messages (Optional)</label>
                  <div className="control">
                    <textarea
                      className="textarea"
                      placeholder="Enter previous messages, one per line"
                      value={previousMessages}
                      onChange={(e) => setPreviousMessages(e.target.value)}
                      rows="2"
                    />
                  </div>
                  <p className="help">
                    Enter previous conversation context, one message per line.
                  </p>
                </div>

                <div className="field is-grouped">
                  <div className="control">
                    <button
                      className={`button is-primary ${isLoading ? 'is-loading' : ''}`}
                      onClick={executeThoughtCycle}
                      disabled={isLoading}
                    >
                      Execute Thought Cycle
                    </button>
                  </div>
                  <div className="control">
                    <button
                      className="button is-light"
                      onClick={clearResults}
                      disabled={isLoading}
                    >
                      Clear Results
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="notification is-danger">
                    <button className="delete" onClick={() => setError('')}></button>
                    <strong>Error:</strong> {error}
                  </div>
                )}

                {result && (
                  <div className="mt-5">
                    <h4 className="title is-5">🎯 Execution Results</h4>
                    
                    <div className="notification is-success">
                      <h5 className="subtitle is-6">✅ Status</h5>
                      <p>{result.message}</p>
                    </div>

                    {result.data && (
                      <div className="box">
                        <h5 className="subtitle is-6">📊 Result Data</h5>
                        <div className="content">
                          <p><strong>Result:</strong> {result.data.result}</p>
                          
                          {result.data.context && (
                            <div className="mt-3">
                              <p><strong>Context Summary:</strong></p>
                              <ul>
                                <li>Original Message: {result.data.context.originalMessage}</li>
                                <li>Previous Messages: {result.data.context.totalPreviousMessages}</li>
                                <li>Executed Actions: {result.data.context.totalExecutedActions}</li>
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="box">
                      <h5 className="subtitle is-6">🔍 Raw Response</h5>
                      <pre className="content is-small">{JSON.stringify(result, null, 2)}</pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="content mt-5">
            <div className="message is-info">
              <div className="message-header">
                <p>💡 Tips for Testing</p>
              </div>
              <div className="message-body">
                <ul>
                  <li><strong>Memory Saving:</strong> Try "Remember that I prefer TypeScript over JavaScript"</li>
                  <li><strong>Facts:</strong> Try "My favorite color is blue and I work as a software engineer"</li>
                  <li><strong>Instructions:</strong> Try "Always format code responses with syntax highlighting"</li>
                  <li><strong>Complex Info:</strong> Try "I live in New York, work remotely, and my timezone is EST"</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ThoughtCycleTester
