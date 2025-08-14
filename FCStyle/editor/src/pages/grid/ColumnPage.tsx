import React from 'react'
import { Columns, Button } from 'fcstyle'

const ColumnPage: React.FC = () => {
  return (
    <div className="editor-page">
      <h1>Column Component</h1>
      <p>Explore todas as possibilidades de configuração do componente Column para layouts flexíveis em colunas.</p>
      
      <div className="editor-examples">
        <section className="editor-example">
          <h2>Layout Básico em Colunas</h2>
          <div className="editor-showcase">
            <Columns>
              <Button primary>Item 1</Button>
              <Button second>Item 2</Button>
              <Button>Item 3</Button>
            </Columns>
          </div>
          <pre className="editor-code">
{`<Column>
  <Button primary>Item 1</Button>
  <Button secondary>Item 2</Button>
  <Button>Item 3</Button>
</Column>`}
          </pre>
        </section>

        <section className="editor-example">
          <h2>Column com Gap Customizado</h2>
          <div className="editor-showcase">
            <Columns /*gap="large"*/>
              <Button>Item com gap grande</Button>
              <Button>Item com gap grande</Button>
            </Columns>
          </div>
          <pre className="editor-code">
{`<Column gap="large">
  <Button>Item com gap grande</Button>
  <Button>Item com gap grande</Button>
</Column>`}
          </pre>
        </section>

        <section className="editor-example">
          <h2>Column Inversa</h2>
          <div className="editor-showcase">
            <Columns inverse>
              <Button>Primeiro (será exibido por último)</Button>
              <Button>Segundo</Button>
              <Button>Terceiro (será exibido primeiro)</Button>
            </Columns>
          </div>
          <pre className="editor-code">
{`<Column reverse>
  <Button>Primeiro (será exibido por último)</Button>
  <Button>Segundo</Button>
  <Button>Terceiro (será exibido primeiro)</Button>
</Column>`}
          </pre>
        </section>
      </div>
    </div>
  )
}

export default ColumnPage
