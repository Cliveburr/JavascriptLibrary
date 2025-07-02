import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import MessageDecomposer from './components/MessageDecomposer'
import ExecutionPlanner from './components/ExecutionPlanner'
import PipelineExecutor from './components/PipelineExecutor'
import './App.css'
import './utilities.css'

function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentView, setCurrentView] = useState('chat') // 'chat', 'decomposer', 'planner' ou 'executor'
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
    <div className="hero is-fullheight">
      <div className="hero-head">
        <nav className="navbar is-transparent glass">
          <div className="navbar-brand">
            <div className="navbar-item">
              <h1 className="title is-4 has-text-primary">
                <span className="icon is-medium mr-2">
                  <i className="fas fa-brain"></i>
                </span>
                SymbIA Intelligence Platform
              </h1>
            </div>
          </div>
          <div className="navbar-menu">
            <div className="navbar-end">
              <div className="navbar-item">
                <div className="buttons">
                  <button 
                    className={`button ${currentView === 'chat' ? 'is-primary' : 'is-light'} fade-in`} 
                    onClick={() => setView('chat')}
                  >
                    <span className="icon">
                      <i className="fas fa-comments"></i>
                    </span>
                    <span>Chat</span>
                  </button>
                  <button 
                    className={`button ${currentView === 'decomposer' ? 'is-primary' : 'is-light'} fade-in`} 
                    onClick={() => setView('decomposer')}
                  >
                    <span className="icon">
                      <i className="fas fa-puzzle-piece"></i>
                    </span>
                    <span>Decomposer</span>
                  </button>
                  <button 
                    className={`button ${currentView === 'planner' ? 'is-primary' : 'is-light'} fade-in`} 
                    onClick={() => setView('planner')}
                  >
                    <span className="icon">
                      <i className="fas fa-project-diagram"></i>
                    </span>
                    <span>Planner</span>
                  </button>
                  <button 
                    className={`button ${currentView === 'executor' ? 'is-primary' : 'is-light'} fade-in`} 
                    onClick={() => setView('executor')}
                  >
                    <span className="icon">
                      <i className="fas fa-rocket"></i>
                    </span>
                    <span>Executor</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
      
      <div className="hero-body">
        <div className="container is-fluid">
          <div className="columns is-centered">
            <div className="column is-10-desktop is-12-tablet">
              <div className="box glass" style={{ height: '70vh', overflowY: 'auto' }}>
                {currentView === 'chat' ? (
                  <div className="chat-container">
                    {messages.map((message, index) => (
                      <div key={index} className={`mb-4 ${message.role === 'user' ? 'has-text-right' : 'has-text-left'} slide-up`}>
                        <div className={`notification ${message.role === 'user' ? 'is-primary' : 'is-light'} is-inline-block`} 
                             style={{ maxWidth: '75%', wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
                          <div className="media">
                            <div className="media-left">
                              <figure className="image is-32x32">
                                <span className="icon is-medium">
                                  <i className={`fas ${message.role === 'user' ? 'fa-user' : 'fa-robot'}`}></i>
                                </span>
                              </figure>
                            </div>
                            <div className="media-content">
                              {message.content}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="has-text-left mb-4">
                        <div className="notification is-light is-inline-block pulse" style={{ maxWidth: '75%' }}>
                          <div className="media">
                            <div className="media-left">
                              <figure className="image is-32x32">
                                <span className="icon is-medium">
                                  <i className="fas fa-robot"></i>
                                </span>
                              </figure>
                            </div>
                            <div className="media-content">
                              <span className="icon is-small">
                                <i className="fas fa-spinner fa-pulse"></i>
                              </span>
                              <span className="has-text-weight-semibold ml-2">Thinking...</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : currentView === 'decomposer' ? (
                  <MessageDecomposer />
                ) : currentView === 'planner' ? (
                  <ExecutionPlanner />
                ) : (
                  <PipelineExecutor />
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {currentView === 'chat' && (
        <div className="hero-foot">
          <div className="container is-fluid">
            <div className="columns is-centered">
              <div className="column is-10-desktop is-12-tablet">
                <div className="box glass">
                  <div className="field has-addons">
                    <div className="control is-expanded">
                      <textarea
                        ref={textareaRef}
                        className="textarea"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
                        disabled={isLoading}
                        rows={3}
                        style={{ resize: 'vertical', minHeight: '80px' }}
                      />
                    </div>
                    <div className="control">
                      <button 
                        className={`button is-primary is-large ${isLoading ? 'is-loading' : ''}`}
                        onClick={sendMessage} 
                        disabled={isLoading || !input.trim()}
                        style={{ height: '100%', minHeight: '80px' }}
                      >
                        <span className="icon">
                          <i className="fas fa-paper-plane"></i>
                        </span>
                        <span>Send</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
