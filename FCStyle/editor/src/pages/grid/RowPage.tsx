import React from 'react'
import { Row, Button } from 'fcstyle'

const RowPage: React.FC = () => {
  return (
    <div className="editor-page">
      <h1>Row Component</h1>
      <p>Explore todas as possibilidades de configuração do componente Row para layouts flexíveis em linhas.</p>
      
      <div className="editor-examples">
        <section className="editor-example">
          <h2>Layout Básico em Linhas</h2>
          <div className="editor-showcase">
            <Row>
              <Button primary>Item 1</Button>
              <Button second>Item 2</Button>
              <Button>Item 3</Button>
            </Row>
          </div>
          <pre className="editor-code">
{`<Row>
  <Button primary>Item 1</Button>
  <Button secondary>Item 2</Button>
  <Button>Item 3</Button>
</Row>`}
          </pre>
        </section>

        <section className="editor-example">
          <h2>Row com Gap Customizado</h2>
          <div className="editor-showcase">
            <Row /*gap="large"*/>
              <Button>Item com gap grande</Button>
              <Button>Item com gap grande</Button>
            </Row>
          </div>
          <pre className="editor-code">
{`<Row gap="large">
  <Button>Item com gap grande</Button>
  <Button>Item com gap grande</Button>
</Row>`}
          </pre>
        </section>

        <section className="editor-example">
          <h2>Row Inversa</h2>
          <div className="editor-showcase">
            <Row inverse>
              <Button>Primeiro (será exibido por último)</Button>
              <Button>Segundo</Button>
              <Button>Terceiro (será exibido primeiro)</Button>
            </Row>
          </div>
          <pre className="editor-code">
{`<Row reverse>
  <Button>Primeiro (será exibido por último)</Button>
  <Button>Segundo</Button>
  <Button>Terceiro (será exibido primeiro)</Button>
</Row>`}
          </pre>
        </section>
      </div>
    </div>
  )
}

export default RowPage
