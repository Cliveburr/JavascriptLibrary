import React from 'react'
import { Button } from 'fcstyle'

const ButtonPage: React.FC = () => {
  return (
    <div className="editor-page">
      <h1>Button Component</h1>
      <p>Explore todas as possibilidades de configuração do componente Button.</p>
      
      <div className="editor-examples">
        <section className="editor-example">
          <h2>Botões Básicos</h2>
          <div className="editor-showcase">
            <Button>Default Button</Button>
            <Button primary>Primary Button</Button>
            <Button second>Secondary Button</Button>
          </div>
          <pre className="editor-code">
{`<Button>Default Button</Button>
<Button primary>Primary Button</Button>
<Button secondary>Secondary Button</Button>`}
          </pre>
        </section>

        <section className="editor-example">
          <h2>Tamanhos</h2>
          <div className="editor-showcase">
            {/* <Button size="small">Small Button</Button> */}
            <Button>Medium Button</Button>
            {/* <Button size="large">Large Button</Button> */}
          </div>
          <pre className="editor-code">
{`<Button size="small">Small Button</Button>
<Button>Medium Button</Button>
<Button size="large">Large Button</Button>`}
          </pre>
        </section>

        <section className="editor-example">
          <h2>Estados</h2>
          <div className="editor-showcase">
            <Button disabled>Disabled Button</Button>
            {/* <Button loading>Loading Button</Button> */}
          </div>
          <pre className="editor-code">
{`<Button disabled>Disabled Button</Button>
<Button loading>Loading Button</Button>`}
          </pre>
        </section>
      </div>
    </div>
  )
}

export default ButtonPage
