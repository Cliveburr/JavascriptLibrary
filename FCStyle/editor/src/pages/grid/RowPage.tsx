import React from 'react'
import { Rows, Button } from 'fcstyle'

const RowPage: React.FC = () => {
  return (
    <div className="editor-page">
      <h1>Rows Component</h1>
      <p>Explore todas as possibilidades de configuração do componente Rows para layouts flexíveis em linhas.</p>
      
      <div className="editor-examples">
        <section className="editor-example">
          <h2>Layout Básico em Linhas</h2>
          <div className="editor-showcase">
            <Rows>
              <Button primary>Item 1</Button>
              <Button second>Item 2</Button>
              <Button>Item 3</Button>
            </Rows>
          </div>
          <pre className="editor-code">
{`<Rows>
  <Button primary>Item 1</Button>
  <Button secondary>Item 2</Button>
  <Button>Item 3</Button>
</Rows>`}
          </pre>
        </section>

        <section className="editor-example">
          <h2>Rows com Gap Customizado</h2>
          <div className="editor-showcase">
            <Rows /*gap="large"*/>
              <Button>Item com gap grande</Button>
              <Button>Item com gap grande</Button>
            </Rows>
          </div>
          <pre className="editor-code">
{`<Rows gap="large">
  <Button>Item com gap grande</Button>
  <Button>Item com gap grande</Button>
</Rows>`}
          </pre>
        </section>

        <section className="editor-example">
          <h2>Rows Inversa</h2>
          <div className="editor-showcase">
            <Rows inverse>
              <Button>Primeiro (será exibido por último)</Button>
              <Button>Segundo</Button>
              <Button>Terceiro (será exibido primeiro)</Button>
            </Rows>
          </div>
          <pre className="editor-code">
{`<Rows reverse>
  <Button>Primeiro (será exibido por último)</Button>
  <Button>Segundo</Button>
  <Button>Terceiro (será exibido primeiro)</Button>
</Rows>`}
          </pre>
        </section>
      </div>
    </div>
  )
}

export default RowPage
