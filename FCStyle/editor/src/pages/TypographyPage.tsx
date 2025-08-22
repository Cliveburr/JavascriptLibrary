import { classBuilder } from 'fcstyle';

export function TypographyPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Typography System</h1>
        <p>Sistema de tipografia centralizado com variáveis CSS.</p>
      </div>

      <div className="page-content">
        {/* Font Sizes */}
        <section className="showcase">
          <h2>Font Sizes</h2>
          <div className="showcase-grid">
            <div className="showcase-item">
              <div className="text-size1">Font Size 1 (0.75rem)</div>
              <code>.text-size1</code>
            </div>
            <div className="showcase-item">
              <div className="text-size2">Font Size 2 (0.875rem)</div>
              <code>.text-size2</code>
            </div>
            <div className="showcase-item">
              <div className="text-size3">Font Size 3 (1rem)</div>
              <code>.text-size3</code>
            </div>
            <div className="showcase-item">
              <div className="text-size4">Font Size 4 (1.125rem)</div>
              <code>.text-size4</code>
            </div>
            <div className="showcase-item">
              <div className="text-size5">Font Size 5 (1.25rem)</div>
              <code>.text-size5</code>
            </div>
          </div>
        </section>

        {/* Font Families */}
        <section className="showcase">
          <h2>Font Families</h2>
          <div className="showcase-grid">
            <div className="showcase-item">
              <div className="font-one">Font Family One (System)</div>
              <code>.font-one</code>
            </div>
            <div className="showcase-item">
              <div className="font-two">Font Family Two (Inter)</div>
              <code>.font-two</code>
            </div>
            <div className="showcase-item">
              <div className="font-three">Font Family Three (Monospace)</div>
              <code>.font-three</code>
            </div>
            <div className="showcase-item">
              <div className="font-four">Font Family Four (Serif)</div>
              <code>.font-four</code>
            </div>
            <div className="showcase-item">
              <div className="font-five">Font Family Five (Display)</div>
              <code>.font-five</code>
            </div>
          </div>
        </section>

        {/* Font Weights */}
        <section className="showcase">
          <h2>Font Weights</h2>
          <div className="showcase-grid">
            <div className="showcase-item">
              <div className="weight1">Weight 1 (100)</div>
              <code>.weight1</code>
            </div>
            <div className="showcase-item">
              <div className="weight2">Weight 2 (300)</div>
              <code>.weight2</code>
            </div>
            <div className="showcase-item">
              <div className="weight3">Weight 3 (400)</div>
              <code>.weight3</code>
            </div>
            <div className="showcase-item">
              <div className="weight4">Weight 4 (500)</div>
              <code>.weight4</code>
            </div>
            <div className="showcase-item">
              <div className="weight5">Weight 5 (600)</div>
              <code>.weight5</code>
            </div>
            <div className="showcase-item">
              <div className="weight6">Weight 6 (700)</div>
              <code>.weight6</code>
            </div>
            <div className="showcase-item">
              <div className="weight7">Weight 7 (900)</div>
              <code>.weight7</code>
            </div>
          </div>
        </section>

        {/* Text Transformations */}
        <section className="showcase">
          <h2>Text Transformations</h2>
          <div className="showcase-grid">
            <div className="showcase-item">
              <div className="text-none">Normal Text</div>
              <code>.text-none</code>
            </div>
            <div className="showcase-item">
              <div className="text-uppercase">uppercase text</div>
              <code>.text-uppercase</code>
            </div>
            <div className="showcase-item">
              <div className="text-lowercase">LOWERCASE TEXT</div>
              <code>.text-lowercase</code>
            </div>
            <div className="showcase-item">
              <div className="text-capitalize">capitalize each word</div>
              <code>.text-capitalize</code>
            </div>
          </div>
        </section>

        {/* Line Heights */}
        <section className="showcase">
          <h2>Line Heights</h2>
          <div className="showcase-grid">
            <div className="showcase-item">
              <div className="leading1">
                Leading 1 (1.2)<br />
                Multiple lines to see<br />
                the spacing effect
              </div>
              <code>.leading1</code>
            </div>
            <div className="showcase-item">
              <div className="leading2">
                Leading 2 (1.4)<br />
                Multiple lines to see<br />
                the spacing effect
              </div>
              <code>.leading2</code>
            </div>
            <div className="showcase-item">
              <div className="leading3">
                Leading 3 (1.6)<br />
                Multiple lines to see<br />
                the spacing effect
              </div>
              <code>.leading3</code>
            </div>
            <div className="showcase-item">
              <div className="leading4">
                Leading 4 (1.8)<br />
                Multiple lines to see<br />
                the spacing effect
              </div>
              <code>.leading4</code>
            </div>
          </div>
        </section>

        {/* Letter Spacing */}
        <section className="showcase">
          <h2>Letter Spacing</h2>
          <div className="showcase-grid">
            <div className="showcase-item">
              <div className="spacing1">Spacing 1 (tight)</div>
              <code>.spacing1</code>
            </div>
            <div className="showcase-item">
              <div className="spacing2">Spacing 2 (normal)</div>
              <code>.spacing2</code>
            </div>
            <div className="showcase-item">
              <div className="spacing3">Spacing 3 (wide)</div>
              <code>.spacing3</code>
            </div>
            <div className="showcase-item">
              <div className="spacing4">Spacing 4 (wider)</div>
              <code>.spacing4</code>
            </div>
            <div className="showcase-item">
              <div className="spacing5">Spacing 5 (widest)</div>
              <code>.spacing5</code>
            </div>
          </div>
        </section>

        {/* Typography Presets */}
        <section className="showcase">
          <h2>Typography Presets</h2>
          <div className="showcase-grid">
            <div className="showcase-item">
              <h1 className="text-heading">Heading Style</h1>
              <code>.text-heading</code>
            </div>
            <div className="showcase-item">
              <p className="text-body">Body text style for regular content</p>
              <code>.text-body</code>
            </div>
            <div className="showcase-item">
              <small className="text-caption">Caption text style</small>
              <code>.text-caption</code>
            </div>
            <div className="showcase-item">
              <span className="text-label">Label Style</span>
              <code>.text-label</code>
            </div>
            <div className="showcase-item">
              <code className="text-code">Code style text</code>
              <code>.text-code</code>
            </div>
          </div>
        </section>

        {/* Usage Examples */}
        <section className="showcase">
          <h2>Usage Examples</h2>
          <div className="showcase-grid">
            <div className="showcase-item">
              <h3>Combining Classes</h3>
              <div className="font-five weight6 text-size4 text-uppercase spacing3">
                Display Title
              </div>
              <code>.font-five .weight6 .text-size4 .text-uppercase .spacing3</code>
            </div>
            <div className="showcase-item">
              <h3>With Helper Functions</h3>
              <div className={classBuilder()
                .add('font-two')
                .add('weight4')
                .add('text-size3')
                .add('leading3')
                .build({}).classNames}>
                Text with helpers
              </div>
              <code>classBuilder().add('font-two').add('weight4')...</code>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
