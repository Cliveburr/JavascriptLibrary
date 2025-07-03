import { useState, useRef, useEffect } from 'react'
import MessageDecomposer from './components/MessageDecomposer'
import ExecutionPlanner from './components/ExecutionPlanner'
import PipelineExecutor from './components/PipelineExecutor'
import ThoughtCycleTester from './components/ThoughtCycleTester'

function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentView, setCurrentView] = useState('chat') // 'chat', 'decomposer', 'planner', 'executor' or 'thoughtCycle'
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:3002/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          model: 'llama3:8b'
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      
      // Create assistant message with a unique reference
      const assistantMessage = { role: 'assistant', content: '' }
      setMessages(prev => [...prev, assistantMessage])
      
      // Keep track of the current message index to avoid race conditions
      let currentMessageIndex = -1
      setMessages(prev => {
        currentMessageIndex = prev.length - 1
        return prev
      })

      let buffer = ''
      let accumulatedContent = '' // Track accumulated content to avoid duplication
      
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        // Decode the chunk and add to buffer
        const chunk = decoder.decode(value, { stream: true })
        buffer += chunk
        
        // Process complete lines
        const lines = buffer.split('\n')
        // Keep the last potentially incomplete line in buffer
        buffer = lines.pop() || ''
        
        for (const line of lines) {
          if (line.trim() && line.startsWith('data: ')) {
            try {
              const jsonStr = line.slice(6).trim()
              console.log('Received SSE line:', jsonStr) // Debug log
              
              if (jsonStr === '[DONE]') break
              
              const data = JSON.parse(jsonStr)
              console.log('Parsed data:', data) // Debug log
              
              if (data.content) {
                console.log('Adding content:', data.content) // Debug log
                accumulatedContent += data.content
                
                // Update the message content with the accumulated content
                setMessages(prev => {
                  const newMessages = [...prev]
                  if (newMessages[currentMessageIndex]) {
                    newMessages[currentMessageIndex].content = accumulatedContent
                  }
                  return newMessages
                })
              }
            } catch (e) {
              // Ignore parsing errors for malformed JSON
              console.warn('Failed to parse SSE data:', line, 'Error:', e)
            }
          }
        }
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, there was an error processing your request.' }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const setView = (view) => {
    setCurrentView(view)
  }

  return (
    <div className="has-background-dark" style={{ minHeight: '100vh' }}>
      {/* Sidebar Navigation */}
      <div className="is-flex" style={{ minHeight: '100vh' }}>
        {/* Left Sidebar */}
        <div className="has-background-grey-darker" style={{ width: '280px', padding: '1.5rem 1rem' }}>
          {/* Logo/Brand */}
          <div className="mb-6">
            <h1 className="title is-4 has-text-white has-text-weight-bold">
              <span className="icon mr-2">
                <i className="fas fa-brain has-text-primary"></i>
              </span>
              SymbIA
            </h1>
            <p className="subtitle is-6 has-text-grey-light">AI Pipeline Assistant</p>
          </div>

          {/* Navigation Menu */}
          <aside className="menu">
            <p className="menu-label has-text-grey-light">Main</p>
            <ul className="menu-list">
              <li>
                <a 
                  className={`${currentView === 'chat' ? 'is-active has-background-primary has-text-white' : 'has-text-grey-light'} has-text-weight-medium`}
                  onClick={() => setView('chat')}
                  style={{ borderRadius: '8px', marginBottom: '4px' }}
                >
                  <span className="icon">
                    <i className="fas fa-comments"></i>
                  </span>
                  <span>Chat Assistant</span>
                </a>
              </li>
              <li>
                <a 
                  className={`${currentView === 'decomposer' ? 'is-active has-background-primary has-text-white' : 'has-text-grey-light'} has-text-weight-medium`}
                  onClick={() => setView('decomposer')}
                  style={{ borderRadius: '8px', marginBottom: '4px' }}
                >
                  <span className="icon">
                    <i className="fas fa-puzzle-piece"></i>
                  </span>
                  <span>Message Decomposer</span>
                </a>
              </li>
              <li>
                <a 
                  className={`${currentView === 'planner' ? 'is-active has-background-primary has-text-white' : 'has-text-grey-light'} has-text-weight-medium`}
                  onClick={() => setView('planner')}
                  style={{ borderRadius: '8px', marginBottom: '4px' }}
                >
                  <span className="icon">
                    <i className="fas fa-project-diagram"></i>
                  </span>
                  <span>Execution Planner</span>
                </a>
              </li>
              <li>
                <a 
                  className={`${currentView === 'executor' ? 'is-active has-background-primary has-text-white' : 'has-text-grey-light'} has-text-weight-medium`}
                  onClick={() => setView('executor')}
                  style={{ borderRadius: '8px', marginBottom: '4px' }}
                >
                  <span className="icon">
                    <i className="fas fa-rocket"></i>
                  </span>
                  <span>Pipeline Executor</span>
                </a>
              </li>
              <li>
                <a 
                  className={`${currentView === 'thoughtCycle' ? 'is-active has-background-primary has-text-white' : 'has-text-grey-light'} has-text-weight-medium`}
                  onClick={() => setView('thoughtCycle')}
                  style={{ borderRadius: '8px', marginBottom: '4px' }}
                >
                  <span className="icon">
                    <i className="fas fa-brain"></i>
                  </span>
                  <span>Thought Cycle</span>
                </a>
              </li>
            </ul>
          </aside>

          {/* Footer info */}
          <div className="mt-6 pt-6" style={{ borderTop: '1px solid hsl(0, 0%, 29%)' }}>
            <div className="has-text-grey-light is-size-7">
              <p className="mb-2">
                <span className="icon is-small">
                  <i className="fas fa-circle has-text-success"></i>
                </span>
                <span>Connected</span>
              </p>
              <p>AI Model: Llama 3 8B</p>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="is-flex-grow-1 is-flex is-flex-direction-column">
          {/* Top Header */}
          <div className="has-background-grey-dark px-6 py-4" style={{ borderBottom: '1px solid hsl(0, 0%, 29%)' }}>
            <div className="is-flex is-justify-content-space-between is-align-items-center">
              <div>
                <h2 className="title is-5 has-text-white mb-1">
                  {currentView === 'chat' ? 'Chat Assistant' : 
                   currentView === 'decomposer' ? 'Message Decomposer' :
                   currentView === 'planner' ? 'Execution Planner' : 
                   currentView === 'executor' ? 'Pipeline Executor' : 'Thought Cycle Tester'}
                </h2>
                <p className="subtitle is-6 has-text-grey-light mb-0">
                  {currentView === 'chat' ? 'Interact with AI assistant' : 
                   currentView === 'decomposer' ? 'Break down complex messages' :
                   currentView === 'planner' ? 'Plan execution strategies' : 
                   currentView === 'executor' ? 'Execute AI pipelines' : 'Test thought cycle with memory saving'}
                </p>
              </div>
              <div className="buttons">
                <button className="button is-dark is-small">
                  <span className="icon">
                    <i className="fas fa-cog"></i>
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="is-flex-grow-1 has-background-grey-darker p-6">
            <div className="container is-fluid">
              {currentView === 'chat' ? (
                <div className="is-flex is-flex-direction-column" style={{ height: 'calc(100vh - 200px)' }}>
                  {/* Messages Container */}
                  <div className="is-flex-grow-1 has-background-grey-dark p-4 mb-4" style={{ 
                    borderRadius: '12px', 
                    overflowY: 'auto',
                    border: '1px solid hsl(0, 0%, 29%)'
                  }}>
                    {messages.length === 0 ? (
                      <div className="has-text-centered py-6">
                        <div className="icon is-large has-text-grey mb-4">
                          <i className="fas fa-comments fa-3x"></i>
                        </div>
                        <h3 className="title is-4 has-text-grey-light">Start a conversation</h3>
                        <p className="subtitle is-6 has-text-grey">Ask me anything and I'll help you solve problems step by step.</p>
                      </div>
                    ) : (
                      <div className="chat-messages">
                        {messages.map((message, index) => (
                          <div key={index} className={`mb-4 ${message.role === 'user' ? 'has-text-right' : 'has-text-left'}`}>
                            <div className={`is-inline-block p-4 ${
                              message.role === 'user' 
                                ? 'has-background-primary has-text-white' 
                                : 'has-background-grey has-text-white'
                            }`} 
                            style={{ 
                              maxWidth: '75%', 
                              borderRadius: message.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                              wordWrap: 'break-word', 
                              whiteSpace: 'pre-wrap',
                              fontSize: '0.95rem',
                              lineHeight: '1.5'
                            }}>
                              {message.content}
                            </div>
                          </div>
                        ))}
                        {isLoading && (
                          <div className="has-text-left mb-4">
                            <div className="is-inline-block p-4 has-background-grey has-text-white" 
                            style={{ 
                              maxWidth: '75%', 
                              borderRadius: '18px 18px 18px 4px',
                              fontSize: '0.95rem'
                            }}>
                              <span className="icon is-small">
                                <i className="fas fa-circle-notch fa-spin"></i>
                              </span>
                              <span className="ml-2">AI is thinking...</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Area */}
                  <div className="has-background-grey-dark p-4" style={{ 
                    borderRadius: '12px',
                    border: '1px solid hsl(0, 0%, 29%)'
                  }}>
                    <div className="field has-addons">
                      <div className="control is-expanded">
                        <textarea
                          ref={textareaRef}
                          className="textarea has-background-grey-darker has-text-white"
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Message SymbIA... (Press Enter to send, Shift+Enter for new line)"
                          disabled={isLoading}
                          rows={3}
                          style={{ 
                            resize: 'none', 
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '0.95rem'
                          }}
                        />
                      </div>
                      <div className="control">
                        <button 
                          className={`button is-primary ${isLoading ? 'is-loading' : ''}`}
                          onClick={sendMessage} 
                          disabled={isLoading || !input.trim()}
                          style={{ 
                            height: '100%', 
                            minHeight: '76px',
                            borderRadius: '8px',
                            marginLeft: '8px'
                          }}
                        >
                          <span className="icon">
                            <i className="fas fa-paper-plane"></i>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="box has-background-grey-dark" style={{ 
                  border: '1px solid hsl(0, 0%, 29%)',
                  borderRadius: '12px',
                  minHeight: 'calc(100vh - 200px)'
                }}>
                  {currentView === 'decomposer' ? (
                    <MessageDecomposer />
                  ) : currentView === 'planner' ? (
                    <ExecutionPlanner />
                  ) : currentView === 'thoughtCycle' ? (
                    <ThoughtCycleTester />
                  ) : (
                    <PipelineExecutor />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
