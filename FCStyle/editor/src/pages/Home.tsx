import React, { useState } from 'react'
import { Columns, Divisor, Place } from 'fcstyle'

interface SimpleTest {
  i: number;
  text: string;
  isSelected: boolean;
}

const Home: React.FC = () => {
  const [test, setTest] = useState<SimpleTest[]>(Array.from({ length: 100 }, (_, i) => (
            { i, text: `Place ${i}`, isSelected: false })
        ));

  const swapSelected = (t: SimpleTest) => {
    setTest(prevTest => 
      prevTest.map(item => 
        item.i === t.i 
          ? { ...item, isSelected: !item.isSelected }
          : item
      )
    );
  }

  const createShowArea = (t: SimpleTest) => {
    return <Place success p rounded hoverable pointer selected={t.isSelected} key={t.i}
      onClick={() => swapSelected(t)}>{t.text}</Place>
  }

  return (
    // <div>
    //   <Columns m gap wrap flex={{  }} >
    //     {test.map(t => createShowArea(t))}
    //   </Columns>
    // </div>

    <Place>
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
      </div>
    </Place>
           

    // <div className="editor-page">
    //   <h1>FCStyle Editor</h1>
    //   <p>Bem-vindo ao editor do framework FCStyle!</p>
    //   <p>Use o menu de navegação para explorar os diferentes componentes e suas configurações.</p>
      
    //   <div className="editor-overview">
    //     <section>
    //       <h2>Componentes Disponíveis</h2>
    //       <ul>
    //         <li><strong>Button:</strong> Botões customizáveis com diferentes estilos</li>
    //         <li><strong>Column:</strong> Layout flexível para colunas</li>
    //         <li><strong>Row:</strong> Layout flexível para linhas</li>
    //         <li><strong>Input:</strong> Campos de entrada com validação</li>
    //         <li><strong>InputField:</strong> Campo completo com label e mensagens de validação</li>
    //       </ul>
    //     </section>
        
    //     <ThemeCustomizer />
    //   </div>
    // </div>
  )
}

export default Home
