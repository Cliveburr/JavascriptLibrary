import React, { useState } from 'react'
import { InputField, ValidatorControl, ValidationStatus } from 'fcstyle'

const InputFieldPage: React.FC = () => {
  const [inputValue, setInputValue] = useState('')
  
  // Exemplo de validador
  const validator = new ValidatorControl([
    {
      validator: (value: string) => value.length >= 3 ? ValidationStatus.Valid : ValidationStatus.Invalid,
      message: 'Deve ter pelo menos 3 caracteres'
    },
    {
      validator: (value: string) => /^[a-zA-Z]+$/.test(value) ? ValidationStatus.Valid : ValidationStatus.Invalid,
      message: 'Deve conter apenas letras'
    }
  ])

  return (
    <div className="editor-page">
      <h1>InputField Component</h1>
      <p>Explore todas as possibilidades de configuração do componente InputField que combina label e mensagens de validação.</p>
      
      <div className="editor-examples">
        <section className="editor-example">
          <h2>InputField Básico</h2>
          <div className="editor-showcase">
            <InputField 
              label="Nome"
              placeholder="Digite seu nome..."
              value={inputValue}
              onChange={(value) => setInputValue(value)}
            />
          </div>
          <pre className="editor-code">
{`<InputField 
  label="Nome"
  placeholder="Digite seu nome..."
  value={inputValue}
  onChange={(value) => setInputValue(value)}
/>`}
          </pre>
        </section>

        <section className="editor-example">
          <h2>InputField com Validação</h2>
          <div className="editor-showcase">
            <InputField 
              label="Nome (validado)"
              placeholder="Digite apenas letras com pelo menos 3 caracteres..."
              validatorControl={validator}
            />
          </div>
          <pre className="editor-code">
{`const validator = new ValidatorControl([
  {
    validator: (value: string) => value.length >= 3 ? ValidationStatus.Valid : ValidationStatus.Invalid,
    message: 'Deve ter pelo menos 3 caracteres'
  },
  {
    validator: (value: string) => /^[a-zA-Z]+$/.test(value) ? ValidationStatus.Valid : ValidationStatus.Invalid,
    message: 'Deve conter apenas letras'
  }
])

<InputField 
  label="Nome (validado)"
  placeholder="Digite apenas letras com pelo menos 3 caracteres..."
  validatorControl={validator}
/>`}
          </pre>
        </section>

        <section className="editor-example">
          <h2>InputField com Diferentes Tipos</h2>
          <div className="editor-showcase">
            <InputField 
              label="Email"
              type="email" 
              placeholder="email@exemplo.com" 
            />
            <InputField 
              label="Senha"
              type="password" 
              placeholder="Digite sua senha..." 
            />
            <InputField 
              label="Idade"
              type="number" 
              placeholder="25" 
            />
          </div>
          <pre className="editor-code">
{`<InputField 
  label="Email"
  type="email" 
  placeholder="email@exemplo.com" 
/>
<InputField 
  label="Senha"
  type="password" 
  placeholder="Digite sua senha..." 
/>
<InputField 
  label="Idade"
  type="number" 
  placeholder="25" 
/>`}
          </pre>
        </section>

        <section className="editor-example">
          <h2>Estados</h2>
          <div className="editor-showcase">
            <InputField 
              label="Campo Normal"
              placeholder="Input normal" 
            />
            <InputField 
              label="Campo Desabilitado"
              placeholder="Input desabilitado" 
              disabled 
            />
            <InputField 
              label="Campo Obrigatório"
              placeholder="Input obrigatório" 
              required 
            />
          </div>
          <pre className="editor-code">
{`<InputField 
  label="Campo Normal"
  placeholder="Input normal" 
/>
<InputField 
  label="Campo Desabilitado"
  placeholder="Input desabilitado" 
  disabled 
/>
<InputField 
  label="Campo Obrigatório"
  placeholder="Input obrigatório" 
  required 
/>`}
          </pre>
        </section>
      </div>
    </div>
  )
}

export default InputFieldPage
