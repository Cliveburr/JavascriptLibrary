import React, { useState } from 'react'
import { Input, ValidatorControl, ValidationStatus } from 'fcstyle'

const InputPage: React.FC = () => {
  const [inputValue, setInputValue] = useState('')
  
  // Exemplo de validador
  const validator = new ValidatorControl([
    {
      validator: (value: string) => value.length >= 3 ? ValidationStatus.Valid : ValidationStatus.Invalid,
      message: 'Deve ter pelo menos 3 caracteres'
    }
  ])

  return (
    <div className="editor-page">
      <h1>Input Component</h1>
      <p>Explore todas as possibilidades de configuração do componente Input.</p>
      
      <div className="editor-examples">
        <section className="editor-example">
          <h2>Input Básico</h2>
          <div className="editor-showcase">
            <Input 
              placeholder="Digite algo aqui..."
              value={inputValue}
              onChange={(value) => setInputValue(value)}
            />
          </div>
          <pre className="editor-code">
{`<Input 
  placeholder="Digite algo aqui..."
  value={inputValue}
  onChange={(value) => setInputValue(value)}
/>`}
          </pre>
        </section>

        <section className="editor-example">
          <h2>Input com Validação</h2>
          <div className="editor-showcase">
            <Input 
              placeholder="Digite pelo menos 3 caracteres..."
              validatorControl={validator}
            />
          </div>
          <pre className="editor-code">
{`const validator = new ValidatorControl([
  {
    validator: (value: string) => value.length >= 3 ? ValidationStatus.Valid : ValidationStatus.Invalid,
    message: 'Deve ter pelo menos 3 caracteres'
  }
])

<Input 
  placeholder="Digite pelo menos 3 caracteres..."
  validatorControl={validator}
/>`}
          </pre>
        </section>

        <section className="editor-example">
          <h2>Tipos de Input</h2>
          <div className="editor-showcase">
            <Input type="email" placeholder="email@exemplo.com" />
            <Input type="password" placeholder="Senha..." />
            <Input type="number" placeholder="123" />
          </div>
          <pre className="editor-code">
{`<Input type="email" placeholder="email@exemplo.com" />
<Input type="password" placeholder="Senha..." />
<Input type="number" placeholder="123" />`}
          </pre>
        </section>

        <section className="editor-example">
          <h2>Estados</h2>
          <div className="editor-showcase">
            <Input placeholder="Input normal" />
            <Input placeholder="Input desabilitado" disabled />
            <Input placeholder="Input readonly" readOnly />
          </div>
          <pre className="editor-code">
{`<Input placeholder="Input normal" />
<Input placeholder="Input desabilitado" disabled />
<Input placeholder="Input readonly" readOnly />`}
          </pre>
        </section>
      </div>
    </div>
  )
}

export default InputPage
