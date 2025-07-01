import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import MessageDecomposer from './components/MessageDecomposer'
import ExecutionPlanner from './components/ExecutionPlanner'
import './App.css'

function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentView, setCurrentView] = useState('chat') // 'chat', 'decomposer' ou 'planner'
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
    <div className="hero is-fullheight is-dark">
      <div className="hero-head">
        <nav className="navbar is-dark">
          <div className="navbar-brand">
            <div className="navbar-item">
              <h1 className="title is-4 has-text-white">SymbIA Chat</h1>
            </div>
            <div className="navbar-item">
              <div className="buttons">
                <button 
                  className={`button ${currentView === 'chat' ? 'is-primary' : 'is-light'}`} 
                  onClick={() => setView('chat')}
                >
                  Chat
                </button>
                <button 
                  className={`button ${currentView === 'decomposer' ? 'is-primary' : 'is-light'}`} 
                  onClick={() => setView('decomposer')}
                >
                  Decomposer
                </button>
                <button 
                  className={`button ${currentView === 'planner' ? 'is-primary' : 'is-light'}`} 
                  onClick={() => setView('planner')}
                >
                  Planner
                </button>
              </div>
            </div>
          </div>
        </nav>
      </div>
      
      <div className="hero-body">
        <div className="container is-fluid">
          <div className="columns is-centered">
            <div className="column is-8">
              <div className="box has-background-dark has-text-white" style={{ height: '60vh', overflowY: 'auto' }}>
                {currentView === 'chat' ? (
                  <>
                    {messages.map((message, index) => (
                      <div key={index} className={`mb-4 ${message.role === 'user' ? 'has-text-right' : 'has-text-left'}`}>
                        <div className={`notification ${message.role === 'user' ? 'is-primary' : 'is-grey-dark'} is-inline-block`} 
                             style={{ maxWidth: '70%', wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
                          {message.content}
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="has-text-left mb-4">
                        <div className="notification is-grey-dark is-inline-block" style={{ maxWidth: '70%' }}>
                          <span className="has-text-weight-semibold">Thinking...</span>
                        </div>
                      </div>
                    )}
                  </>
                ) : currentView === 'decomposer' ? (
                  <MessageDecomposer />
                ) : (
                  <ExecutionPlanner />
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
              <div className="column is-8">
                <div className="field has-addons">
                  <div className="control is-expanded">
                    <textarea
                      ref={textareaRef}
                      className="textarea has-background-grey-darker has-text-white"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message here..."
                      disabled={isLoading}
                      rows={2}
                      style={{ resize: 'none' }}
                    />
                  </div>
                  <div className="control">
                    <button 
                      className={`button is-primary ${isLoading ? 'is-loading' : ''}`}
                      onClick={sendMessage} 
                      disabled={isLoading || !input.trim()}
                      style={{ height: '100%' }}
                    >
                      Send
                    </button>
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
