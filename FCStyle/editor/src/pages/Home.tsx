import React from 'react'
import ThemeCustomizer from '../components/ThemeCustomizer'

const Home: React.FC = () => {
  return (
    <div className="editor-page">
      <h1>FCStyle Editor</h1>
      <p>Bem-vindo ao editor do framework FCStyle!</p>
      <p>Use o menu de navegação para explorar os diferentes componentes e suas configurações.</p>
      
      <div className="editor-overview">
        <section>
          <h2>Componentes Disponíveis</h2>
          <ul>
            <li><strong>Button:</strong> Botões customizáveis com diferentes estilos</li>
            <li><strong>Column:</strong> Layout flexível para colunas</li>
            <li><strong>Row:</strong> Layout flexível para linhas</li>
            <li><strong>Input:</strong> Campos de entrada com validação</li>
            <li><strong>InputField:</strong> Campo completo com label e mensagens de validação</li>
          </ul>
        </section>
        
        <ThemeCustomizer />
      </div>
    </div>
  )
}

export default Home
