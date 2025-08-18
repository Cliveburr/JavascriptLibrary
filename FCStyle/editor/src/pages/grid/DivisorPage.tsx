import React, { useState, useRef, useEffect, useCallback } from 'react';

// Componente Divisor funcional para demonstração
interface DivisorProps {
  direction?: 'vertical' | 'horizontal';
  name?: string;
  onResize?: (size: number) => void;
  initialSize?: number;
  minSize?: number;
  maxSize?: number;
  thickness?: number;
  firstPanel?: React.ReactNode;
  secondPanel?: React.ReactNode;
}

const Divisor: React.FC<DivisorProps> = ({
  direction = 'vertical',
  name,
  onResize,
  initialSize = 200,
  minSize = 10,
  maxSize,
  thickness = 4,
  firstPanel,
  secondPanel
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startMousePos, setStartMousePos] = useState(0);
  const [startSize, setStartSize] = useState(0);
  const [currentSize, setCurrentSize] = useState<number>(() => {
    if (name) {
      const saved = localStorage.getItem(`divisor-${name}`);
      if (saved) {
        const parsedSize = parseInt(saved, 10);
        return !isNaN(parsedSize) ? parsedSize : initialSize;
      }
    }
    return initialSize;
  });

  useEffect(() => {
    if (name) {
      localStorage.setItem(`divisor-${name}`, currentSize.toString());
    }
  }, [currentSize, name]);

  useEffect(() => {
    onResize?.(currentSize);
  }, [currentSize, onResize]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const mousePos = direction === 'vertical' ? e.clientX : e.clientY;
    setStartMousePos(mousePos);
    setStartSize(currentSize);
    setIsDragging(true);
    
    document.body.style.cursor = direction === 'vertical' ? 'ew-resize' : 'ns-resize';
    document.body.style.userSelect = 'none';
  }, [direction, currentSize]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    const currentMousePos = direction === 'vertical' ? e.clientX : e.clientY;
    const deltaPos = currentMousePos - startMousePos;
    let newSize = startSize + deltaPos;

    if (newSize < minSize) newSize = minSize;
    if (maxSize && newSize > maxSize) newSize = maxSize;

    setCurrentSize(newSize);
  }, [isDragging, direction, startMousePos, startSize, minSize, maxSize]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: direction === 'vertical' ? 'row' : 'column',
    height: '100%',
    width: '100%',
  };

  const firstPanelStyle: React.CSSProperties = {
    overflow: 'auto',
    flexShrink: 0,
    ...(direction === 'vertical' 
      ? { width: `${currentSize}px`, height: '100%' }
      : { height: `${currentSize}px`, width: '100%' }
    ),
  };

  const secondPanelStyle: React.CSSProperties = {
    flex: 1,
    overflow: 'auto',
    minWidth: 0,
    minHeight: 0,
  };

  const divisorStyle: React.CSSProperties = {
    backgroundColor: isDragging ? '#007acc' : '#e0e0e0',
    cursor: direction === 'vertical' ? 'ew-resize' : 'ns-resize',
    userSelect: 'none',
    flexShrink: 0,
    transition: isDragging ? 'none' : 'background-color 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...(direction === 'vertical' 
      ? { width: `${thickness}px`, height: '100%' }
      : { height: `${thickness}px`, width: '100%' }
    ),
  };

  const indicatorStyle: React.CSSProperties = {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '1px',
    pointerEvents: 'none',
    ...(direction === 'vertical' 
      ? { width: '2px', height: '20px' }
      : { width: '20px', height: '2px' }
    ),
  };

  return (
    <div ref={containerRef} style={containerStyle}>
      <div style={firstPanelStyle}>{firstPanel}</div>
      <div
        style={divisorStyle}
        onMouseDown={handleMouseDown}
        onMouseEnter={(e) => {
          if (!isDragging) {
            (e.currentTarget as HTMLDivElement).style.backgroundColor = '#c0c0c0';
          }
        }}
        onMouseLeave={(e) => {
          if (!isDragging) {
            (e.currentTarget as HTMLDivElement).style.backgroundColor = '#e0e0e0';
          }
        }}
      >
        <div style={indicatorStyle} />
      </div>
      <div style={secondPanelStyle}>{secondPanel}</div>
    </div>
  );
};

export const DivisorPage: React.FC = () => {
  const verticalSize = 200;
  const horizontalSize = 150;
  const [demoVerticalSize, setDemoVerticalSize] = useState(250);
  const [demoHorizontalSize, setDemoHorizontalSize] = useState(180);

  return (
    <div className="page">
      <div className="showcase">
        <h1>Divisor Component</h1>
        <p>
          O componente Divisor é completamente autônomo e permite criar layouts redimensionáveis 
          com persistência no localStorage e callbacks de redimensionamento.
        </p>
      </div>

      <div className="showcase">
        <h2>🎯 Demo Interativo - Divisor Vertical</h2>
        <p>Tamanho atual: <strong>{demoVerticalSize}px</strong> (clique e arraste o divisor para redimensionar)</p>
        <div style={{ height: '350px', border: '2px solid #007acc', borderRadius: '8px', overflow: 'hidden' }}>
          <Divisor
            direction="vertical"
            name="demo-vertical-interactive"
            onResize={setDemoVerticalSize}
            initialSize={250}
            minSize={100}
            maxSize={400}
            thickness={6}
            firstPanel={
              <div style={{ 
                backgroundColor: '#f8f9fa', 
                padding: '20px', 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                <h3 style={{ margin: 0, color: '#007acc' }}>📁 Painel Esquerdo</h3>
                <p style={{ margin: 0, fontSize: '14px' }}>
                  <strong>Funcionalidade Real!</strong> 
                  Arraste o divisor azul ao lado para redimensionar este painel.
                </p>
                <div style={{ 
                  padding: '10px', 
                  backgroundColor: '#e3f2fd', 
                  borderRadius: '4px',
                  fontSize: '13px'
                }}>
                  💾 <strong>Persistência:</strong> O tamanho é salvo automaticamente no localStorage
                  com o nome "demo-vertical-interactive"
                </div>
                <div style={{ 
                  padding: '10px', 
                  backgroundColor: '#e8f5e8', 
                  borderRadius: '4px',
                  fontSize: '13px'
                }}>
                  📏 <strong>Largura atual:</strong> {demoVerticalSize}px<br/>
                  📐 <strong>Limites:</strong> 100px - 400px
                </div>
              </div>
            }
            secondPanel={
              <div style={{ 
                backgroundColor: '#fff3e0', 
                padding: '20px', 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                <h3 style={{ margin: 0, color: '#f57c00' }}>⚡ Painel Principal</h3>
                <p style={{ margin: 0, fontSize: '14px' }}>
                  Este painel se ajusta automaticamente (flex: 1) quando o divisor é movido.
                </p>
                <div style={{ 
                  padding: '10px', 
                  backgroundColor: '#fff8e1', 
                  borderRadius: '4px',
                  fontSize: '13px'
                }}>
                  🎨 <strong>Feedback Visual:</strong> O divisor muda de cor quando você passa o mouse
                  e fica azul durante o arraste.
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ 
                    padding: '20px', 
                    backgroundColor: 'white', 
                    borderRadius: '8px',
                    border: '2px dashed #f57c00',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '24px', marginBottom: '10px' }}>📊</div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold' }}>Área de Conteúdo</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      Espaço disponível se adapta automaticamente
                    </div>
                  </div>
                </div>
              </div>
            }
          />
        </div>
      </div>

      <div className="showcase">
        <h2>🎯 Demo Interativo - Divisor Horizontal</h2>
        <p>Tamanho atual: <strong>{demoHorizontalSize}px</strong> (clique e arraste o divisor para redimensionar)</p>
        <div style={{ height: '400px', border: '2px solid #4caf50', borderRadius: '8px', overflow: 'hidden' }}>
          <Divisor
            direction="horizontal"
            name="demo-horizontal-interactive"
            onResize={setDemoHorizontalSize}
            initialSize={180}
            minSize={80}
            maxSize={250}
            thickness={5}
            firstPanel={
              <div style={{ 
                backgroundColor: '#f1f8e9', 
                padding: '20px', 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                <h3 style={{ margin: 0, color: '#4caf50' }}>📋 Painel Superior</h3>
                <p style={{ margin: 0, fontSize: '14px' }}>
                  <strong>Divisor Horizontal Funcional!</strong> 
                  Arraste o divisor verde abaixo para ajustar a altura.
                </p>
                <div style={{ display: 'flex', gap: '10px', fontSize: '13px' }}>
                  <div style={{ 
                    flex: 1,
                    padding: '8px', 
                    backgroundColor: '#c8e6c9', 
                    borderRadius: '4px'
                  }}>
                    📏 <strong>Altura:</strong> {demoHorizontalSize}px
                  </div>
                  <div style={{ 
                    flex: 1,
                    padding: '8px', 
                    backgroundColor: '#c8e6c9', 
                    borderRadius: '4px'
                  }}>
                    📐 <strong>Limites:</strong> 80px - 250px
                  </div>
                </div>
              </div>
            }
            secondPanel={
              <div style={{ 
                backgroundColor: '#fff8e1', 
                padding: '20px', 
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{ 
                  maxWidth: '500px',
                  textAlign: 'center'
                }}>
                  <h3 style={{ margin: '0 0 15px 0', color: '#ff9800' }}>🎊 Painel Inferior Expansível</h3>
                  <p style={{ margin: '0 0 15px 0', fontSize: '14px' }}>
                    Este painel ocupa todo o espaço restante e demonstra como o componente
                    gerencia automaticamente o layout flexível.
                  </p>
                  <div style={{ 
                    display: 'inline-block',
                    padding: '15px 25px', 
                    backgroundColor: '#ff9800', 
                    color: 'white',
                    borderRadius: '25px',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}>
                    ✨ Totalmente Responsivo ✨
                  </div>
                </div>
              </div>
            }
          />
        </div>
      </div>

      <div className="showcase">
        <h2>Exemplo Básico - Divisor Vertical</h2>
        <p>Tamanho atual: {verticalSize}px</p>
        <div style={{ height: '300px', border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden' }}>
          {/* Simulação visual do componente */}
          <div style={{ display: 'flex', height: '100%' }}>
            <div style={{ 
              width: `${verticalSize}px`, 
              backgroundColor: '#f0f0f0', 
              padding: '15px',
              borderRight: '1px solid #ddd'
            }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>Painel Esquerdo</h3>
              <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>
                Este painel pode ser redimensionado arrastando o divisor ao lado.
              </p>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>
                Largura atual: {verticalSize}px
              </p>
            </div>
            
            <div style={{ 
              width: '4px', 
              backgroundColor: '#e0e0e0', 
              cursor: 'ew-resize',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ 
                width: '2px', 
                height: '20px', 
                backgroundColor: 'rgba(0,0,0,0.3)',
                borderRadius: '1px'
              }} />
            </div>
            
            <div style={{ 
              flex: 1, 
              backgroundColor: '#e8e8e8', 
              padding: '15px'
            }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>Painel Direito</h3>
              <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>
                Este painel se ajusta automaticamente quando o divisor é movido.
              </p>
              <p style={{ margin: 0, fontSize: '14px' }}>
                O tamanho é salvo no localStorage com o nome "demo-vertical".
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="showcase">
        <h2>Exemplo - Divisor Horizontal</h2>
        <p>Tamanho atual: {horizontalSize}px</p>
        <div style={{ height: '400px', border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden' }}>
          {/* Simulação visual do componente */}
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ 
              height: `${horizontalSize}px`, 
              backgroundColor: '#f0f0f0', 
              padding: '15px',
              borderBottom: '1px solid #ddd'
            }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>Painel Superior</h3>
              <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>
                Este painel pode ser redimensionado arrastando o divisor abaixo.
              </p>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>
                Altura atual: {horizontalSize}px
              </p>
            </div>
            
            <div style={{ 
              height: '4px', 
              backgroundColor: '#e0e0e0', 
              cursor: 'ns-resize',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ 
                width: '20px', 
                height: '2px', 
                backgroundColor: 'rgba(0,0,0,0.3)',
                borderRadius: '1px'
              }} />
            </div>
            
            <div style={{ 
              flex: 1, 
              backgroundColor: '#e8e8e8', 
              padding: '15px'
            }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>Painel Inferior</h3>
              <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>
                Este painel se ajusta automaticamente quando o divisor é movido.
              </p>
              <p style={{ margin: 0, fontSize: '14px' }}>
                O tamanho é salvo no localStorage com o nome "demo-horizontal".
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="showcase">
        <h2>Exemplo Complexo - Layout de Editor</h2>
        <div style={{ height: '500px', border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden' }}>
          {/* Simulação de layout complexo */}
          <div style={{ display: 'flex', height: '100%' }}>
            {/* Sidebar */}
            <div style={{ width: '200px', backgroundColor: '#2d2d30', color: 'white', padding: '15px' }}>
              <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#cccccc' }}>Explorer</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px' }}>
                <li style={{ margin: '5px 0' }}>📁 src</li>
                <li style={{ marginLeft: '20px', margin: '3px 0' }}>📄 App.tsx</li>
                <li style={{ marginLeft: '20px', margin: '3px 0' }}>📄 index.tsx</li>
                <li style={{ margin: '5px 0' }}>📁 components</li>
                <li style={{ marginLeft: '20px', margin: '3px 0' }}>📄 Divisor.tsx</li>
              </ul>
            </div>
            
            {/* Divisor vertical */}
            <div style={{ 
              width: '2px', 
              backgroundColor: '#3e3e42', 
              cursor: 'ew-resize'
            }} />
            
            {/* Área principal */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {/* Editor */}
              <div style={{ flex: 1, backgroundColor: '#1e1e1e', color: 'white', padding: '15px' }}>
                <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#cccccc' }}>Editor Principal</h4>
                <pre style={{ 
                  margin: 0, 
                  fontSize: '12px', 
                  fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                  color: '#d4d4d4',
                  lineHeight: '1.4'
                }}>
{`import React from 'react';
import { Divisor } from 'fcstyle';

export const App = () => {
  return (
    <Divisor
      direction="vertical"
      name="app-layout"
      firstPanel={<SidePanel />}
      secondPanel={<MainContent />}
    />
  );
};`}
                </pre>
              </div>
              
              {/* Divisor horizontal */}
              <div style={{ 
                height: '2px', 
                backgroundColor: '#3e3e42', 
                cursor: 'ns-resize'
              }} />
              
              {/* Terminal */}
              <div style={{ height: '150px', backgroundColor: '#0c0c0c', color: '#00ff00', padding: '15px' }}>
                <h4 style={{ color: 'white', fontSize: '14px', margin: '0 0 10px 0' }}>Terminal</h4>
                <div style={{ fontFamily: 'Consolas, Monaco, "Courier New", monospace', fontSize: '12px' }}>
                  <div>$ npm run dev</div>
                  <div>✓ Server running on http://localhost:3000</div>
                  <div>✓ Ready in 1.2s</div>
                  <div>$ <span style={{ animation: 'blink 1s infinite' }}>_</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="showcase">
        <h2>Como Usar</h2>
        <p>O componente Divisor é completamente autônomo. Você só precisa passar o conteúdo dos painéis:</p>
        
        <h3>Exemplo Básico</h3>
        <pre style={{ 
          backgroundColor: '#f8f8f8', 
          padding: '15px', 
          borderRadius: '4px', 
          overflow: 'auto',
          border: '1px solid #e0e0e0',
          fontSize: '14px'
        }}>
{`import { Divisor } from 'fcstyle';

// Uso mais simples possível
<Divisor
  firstPanel={<div>Conteúdo do primeiro painel</div>}
  secondPanel={<div>Conteúdo do segundo painel</div>}
/>`}
        </pre>

        <h3>Exemplo Completo</h3>
        <pre style={{ 
          backgroundColor: '#f8f8f8', 
          padding: '15px', 
          borderRadius: '4px', 
          overflow: 'auto',
          border: '1px solid #e0e0e0',
          fontSize: '14px'
        }}>
{`// Com todas as opções
<Divisor
  direction="horizontal"           // 'vertical' (padrão) ou 'horizontal'
  name="meu-layout"               // Para salvar no localStorage
  initialSize={300}               // Tamanho inicial em pixels
  minSize={100}                   // Tamanho mínimo
  maxSize={500}                   // Tamanho máximo
  thickness={6}                   // Espessura do divisor
  onResize={(size) => {           // Callback quando redimensiona
    console.log('Novo tamanho:', size);
  }}
  firstPanel={<SidePanel />}
  secondPanel={<MainContent />}
/>`}
        </pre>

        <h3>Usando Children (Alternativa)</h3>
        <pre style={{ 
          backgroundColor: '#f8f8f8', 
          padding: '15px', 
          borderRadius: '4px', 
          overflow: 'auto',
          border: '1px solid #e0e0e0',
          fontSize: '14px'
        }}>
{`// Passando como children
<Divisor direction="vertical" name="layout">
  {[
    <SidePanel key="side" />, 
    <MainContent key="main" />
  ]}
</Divisor>`}
        </pre>
      </div>

      <div className="showcase">
        <h2>Propriedades</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left', fontWeight: '600' }}>Propriedade</th>
                <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left', fontWeight: '600' }}>Tipo</th>
                <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left', fontWeight: '600' }}>Padrão</th>
                <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left', fontWeight: '600' }}>Descrição</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: '12px', fontFamily: 'monospace' }}>direction</td>
                <td style={{ border: '1px solid #ddd', padding: '12px', fontFamily: 'monospace' }}>'vertical' | 'horizontal'</td>
                <td style={{ border: '1px solid #ddd', padding: '12px', fontFamily: 'monospace' }}>'vertical'</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>Direção do divisor</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: '12px', fontFamily: 'monospace' }}>name</td>
                <td style={{ border: '1px solid #ddd', padding: '12px', fontFamily: 'monospace' }}>string</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>-</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>Nome para persistência no localStorage</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: '12px', fontFamily: 'monospace' }}>onResize</td>
                <td style={{ border: '1px solid #ddd', padding: '12px', fontFamily: 'monospace' }}>(size: number) =&gt; void</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>-</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>Callback quando o tamanho muda</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: '12px', fontFamily: 'monospace' }}>initialSize</td>
                <td style={{ border: '1px solid #ddd', padding: '12px', fontFamily: 'monospace' }}>number</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>200</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>Tamanho inicial em pixels</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: '12px', fontFamily: 'monospace' }}>minSize</td>
                <td style={{ border: '1px solid #ddd', padding: '12px', fontFamily: 'monospace' }}>number</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>10</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>Tamanho mínimo em pixels</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: '12px', fontFamily: 'monospace' }}>maxSize</td>
                <td style={{ border: '1px solid #ddd', padding: '12px', fontFamily: 'monospace' }}>number</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>-</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>Tamanho máximo em pixels</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: '12px', fontFamily: 'monospace' }}>thickness</td>
                <td style={{ border: '1px solid #ddd', padding: '12px', fontFamily: 'monospace' }}>number</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>4</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>Espessura do divisor em pixels</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: '12px', fontFamily: 'monospace' }}>firstPanel</td>
                <td style={{ border: '1px solid #ddd', padding: '12px', fontFamily: 'monospace' }}>ReactNode</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>-</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>Conteúdo do primeiro painel (esquerda/topo)</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: '12px', fontFamily: 'monospace' }}>secondPanel</td>
                <td style={{ border: '1px solid #ddd', padding: '12px', fontFamily: 'monospace' }}>ReactNode</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>-</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>Conteúdo do segundo painel (direita/baixo)</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: '12px', fontFamily: 'monospace' }}>children</td>
                <td style={{ border: '1px solid #ddd', padding: '12px', fontFamily: 'monospace' }}>[ReactNode, ReactNode]</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>-</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>Alternativa para firstPanel e secondPanel</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="showcase">
        <h2>Recursos</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div style={{ padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#2c5aa0' }}>🎯 Totalmente Autônomo</h3>
            <p style={{ margin: 0, fontSize: '14px' }}>
              Não precisa configurar layouts manualmente. O componente gerencia tudo internamente:
              containers, flexbox, tamanhos, etc.
            </p>
          </div>
          
          <div style={{ padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#2c5aa0' }}>💾 Persistência Automática</h3>
            <p style={{ margin: 0, fontSize: '14px' }}>
              Salva automaticamente o tamanho no localStorage quando você fornece um nome.
              Restaura o estado na próxima sessão.
            </p>
          </div>
          
          <div style={{ padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#2c5aa0' }}>🎨 Feedback Visual</h3>
            <p style={{ margin: 0, fontSize: '14px' }}>
              Cursors corretos, hover effects, indicadores visuais e mudanças de cor durante o drag.
            </p>
          </div>
          
          <div style={{ padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#2c5aa0' }}>⚡ Performance Otimizada</h3>
            <p style={{ margin: 0, fontSize: '14px' }}>
              Usando useCallback, event listeners otimizados e re-renders mínimos para máxima performance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DivisorPage;
