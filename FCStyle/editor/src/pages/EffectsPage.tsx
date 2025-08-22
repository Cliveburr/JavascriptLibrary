import { classBuilder, EffectsBuilder } from 'fcstyle';

export function EffectsPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Effects System</h1>
        <p>Sistema centralizado de transitions, shadows e filters do FCStyle</p>
      </div>

      <div className="page-content">
        {/* Transitions */}
        <section className="showcase">
          <h2>Transitions</h2>
          <div className="showcase-grid">
            <div className="showcase-item">
              <div className="transition1" style={{background: '#f0f0f0', padding: '1rem', borderRadius: '4px'}}>
                Transition 1 (0.1s)
              </div>
              <code>.transition1</code>
            </div>
            <div className="showcase-item">
              <div className="transition2" style={{background: '#f0f0f0', padding: '1rem', borderRadius: '4px'}}>
                Transition 2 (0.15s)
              </div>
              <code>.transition2</code>
            </div>
            <div className="showcase-item">
              <div className="transition3" style={{background: '#f0f0f0', padding: '1rem', borderRadius: '4px'}}>
                Transition 3 (0.2s)
              </div>
              <code>.transition3</code>
            </div>
            <div className="showcase-item">
              <div className="transition4" style={{background: '#f0f0f0', padding: '1rem', borderRadius: '4px'}}>
                Transition 4 (0.3s)
              </div>
              <code>.transition4</code>
            </div>
            <div className="showcase-item">
              <div className="transition5" style={{background: '#f0f0f0', padding: '1rem', borderRadius: '4px'}}>
                Transition 5 (0.5s)
              </div>
              <code>.transition5</code>
            </div>
          </div>
        </section>

        {/* Shadows */}
        <section className="showcase">
          <h2>Box Shadows</h2>
          <div className="showcase-grid">
            <div className="showcase-item">
              <div className="shadow1" style={{background: 'white', padding: '1rem', borderRadius: '4px'}}>
                Shadow 1 (subtle)
              </div>
              <code>.shadow1</code>
            </div>
            <div className="showcase-item">
              <div className="shadow2" style={{background: 'white', padding: '1rem', borderRadius: '4px'}}>
                Shadow 2 (small)
              </div>
              <code>.shadow2</code>
            </div>
            <div className="showcase-item">
              <div className="shadow3" style={{background: 'white', padding: '1rem', borderRadius: '4px'}}>
                Shadow 3 (medium)
              </div>
              <code>.shadow3</code>
            </div>
            <div className="showcase-item">
              <div className="shadow4" style={{background: 'white', padding: '1rem', borderRadius: '4px'}}>
                Shadow 4 (large)
              </div>
              <code>.shadow4</code>
            </div>
            <div className="showcase-item">
              <div className="shadow5" style={{background: 'white', padding: '1rem', borderRadius: '4px'}}>
                Shadow 5 (xlarge)
              </div>
              <code>.shadow5</code>
            </div>
          </div>
        </section>

        {/* Focus Shadows */}
        <section className="showcase">
          <h2>Focus Shadows</h2>
          <div className="showcase-grid">
            <div className="showcase-item">
              <input 
                type="text" 
                className="focus-shadow1" 
                placeholder="Focus Shadow 1"
                style={{padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc'}}
              />
              <code>.focus-shadow1</code>
            </div>
            <div className="showcase-item">
              <input 
                type="text" 
                className="focus-shadow2" 
                placeholder="Focus Shadow 2"
                style={{padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc'}}
              />
              <code>.focus-shadow2</code>
            </div>
            <div className="showcase-item">
              <input 
                type="text" 
                className="focus-shadow3" 
                placeholder="Focus Shadow 3"
                style={{padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc'}}
              />
              <code>.focus-shadow3</code>
            </div>
          </div>
        </section>

        {/* State Shadows */}
        <section className="showcase">
          <h2>State Shadows</h2>
          <div className="showcase-grid">
            <div className="showcase-item">
              <div className="shadow-success" style={{background: 'white', padding: '1rem', borderRadius: '4px'}}>
                Success Shadow
              </div>
              <code>.shadow-success</code>
            </div>
            <div className="showcase-item">
              <div className="shadow-error" style={{background: 'white', padding: '1rem', borderRadius: '4px'}}>
                Error Shadow
              </div>
              <code>.shadow-error</code>
            </div>
            <div className="showcase-item">
              <div className="shadow-warning" style={{background: 'white', padding: '1rem', borderRadius: '4px'}}>
                Warning Shadow
              </div>
              <code>.shadow-warning</code>
            </div>
          </div>
        </section>

        {/* Hover Effects */}
        <section className="showcase">
          <h2>Hover Effects</h2>
          <div className="showcase-grid">
            <div className="showcase-item">
              <div className="hover-shadow transition3" style={{background: 'white', padding: '1rem', borderRadius: '4px', cursor: 'pointer'}}>
                Hover for Shadow
              </div>
              <code>.hover-shadow</code>
            </div>
            <div className="showcase-item">
              <div className="hover-brightness transition3" style={{background: '#f0f0f0', padding: '1rem', borderRadius: '4px', cursor: 'pointer'}}>
                Hover for Brightness
              </div>
              <code>.hover-brightness</code>
            </div>
            <div className="showcase-item">
              <div className="hover-lift transition3" style={{background: 'white', padding: '1rem', borderRadius: '4px', cursor: 'pointer'}}>
                Hover for Lift
              </div>
              <code>.hover-lift</code>
            </div>
          </div>
        </section>

        {/* Effect Presets */}
        <section className="showcase">
          <h2>Effect Presets</h2>
          <div className="showcase-grid">
            <div className="showcase-item">
              <div className="effect-card" style={{background: 'white', padding: '1rem', borderRadius: '4px', cursor: 'pointer'}}>
                Card Effect
                <p style={{margin: '0.5rem 0 0', fontSize: '0.875rem', color: '#666'}}>
                  Hover to see effect
                </p>
              </div>
              <code>.effect-card</code>
            </div>
            <div className="showcase-item">
              <button className="effect-button" style={{padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', background: '#007bff', color: 'white', cursor: 'pointer'}}>
                Button Effect
              </button>
              <code>.effect-button</code>
            </div>
            <div className="showcase-item">
              <input 
                type="text" 
                className="effect-input" 
                placeholder="Input Effect"
                style={{padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', width: '100%'}}
              />
              <code>.effect-input</code>
            </div>
          </div>
        </section>

        {/* Usage Examples */}
        <section className="showcase">
          <h2>Usage Examples</h2>
          <div className="showcase-grid">
            <div className="showcase-item">
              <h3>Combining Classes</h3>
              <div className="shadow2 transition3 hover-brightness" style={{background: '#f8f9fa', padding: '1rem', borderRadius: '4px', cursor: 'pointer'}}>
                Combined Effects
              </div>
              <code>.shadow2 .transition3 .hover-brightness</code>
            </div>
            <div className="showcase-item">
              <h3>With Helper Functions</h3>
              <div className={classBuilder()
                .addBuilder(EffectsBuilder)
                .build({ 
                  shadow3: true, 
                  transition4: true, 
                  hoverLift: true 
                }).classNames}
                style={{background: 'white', padding: '1rem', borderRadius: '4px', cursor: 'pointer'}}>
                Helper Example
              </div>
              <code>effectsClass.build(&#123; shadow3: true, transition4: true, hoverLift: true &#125;)</code>
            </div>
          </div>
        </section>

        {/* CSS Variables */}
        <section className="showcase">
          <h2>CSS Variables</h2>
          <div className="showcase-grid">
            <div className="showcase-item">
              <h3>Transitions</h3>
              <code>
                --transition1: all 0.1s ease-in-out;<br/>
                --transition2: all 0.15s ease-in-out;<br/>
                --transition3: all 0.2s ease-in-out;<br/>
                --transition4: all 0.3s ease-in-out;<br/>
                --transition5: all 0.5s ease-in-out;
              </code>
            </div>
            <div className="showcase-item">
              <h3>Shadows</h3>
              <code>
                --shadow1: 0 1px 3px rgba(0, 0, 0, 0.1);<br/>
                --shadow2: 0 2px 8px rgba(0, 0, 0, 0.1);<br/>
                --shadow3: 0 4px 12px rgba(0, 0, 0, 0.15);<br/>
                --shadow4: 0 8px 24px rgba(0, 0, 0, 0.2);<br/>
                --shadow5: 0 16px 48px rgba(0, 0, 0, 0.25);
              </code>
            </div>
            <div className="showcase-item">
              <h3>Custom Usage</h3>
              <div style={{
                background: 'white', 
                padding: '1rem', 
                borderRadius: '4px',
                boxShadow: 'var(--shadow3)',
                transition: 'var(--transition4)'
              }}>
                Custom CSS Variables
              </div>
              <code>
                box-shadow: var(--shadow3);<br/>
                transition: var(--transition4);
              </code>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
