import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { OpticalButton } from './components/OpticalButton';

function ComponentMatrix() {
  return (
    <main className="matrix-page">
      <style>{`
        * { box-sizing: border-box; }
        html { min-width: 320px; }
        body { margin: 0; background: #e9e3da; color: #201d19; font: 14px/1.5 Arial, Helvetica, sans-serif; }
        .matrix-page { width: min(1360px, 100%); margin: 0 auto; padding: 28px 20px 56px; }
        .matrix-title { margin: 0 0 5px; font-size: 28px; letter-spacing: -.045em; }
        .matrix-description { margin: 0 0 24px; max-width: 620px; color: #655a4f; }
        .matrix-size-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; margin-bottom: 28px; }
        .matrix-panel { min-width: 0; padding: 16px; border: 1px solid #c9c0b5; background: #f1ece4; }
        .matrix-panel h2 { margin: 0 0 14px; font-size: 12px; text-transform: uppercase; letter-spacing: .1em; }
        .matrix-button-stage { position: relative; display: flex; align-items: center; justify-content: center; min-height: 184px; overflow: visible; }
        .matrix-panel .oa-button { display: flex; margin-inline: auto; }
        .matrix-width-grid { display: grid; grid-template-columns: minmax(0, 420px) minmax(0, 282px); align-items: start; gap: 18px; }
        .matrix-width-container { width: 100%; min-width: 0; margin-inline: auto; }
        .matrix-width-container--wide { max-width: 420px; }
        .matrix-width-container--narrow { max-width: 248px; }
        .matrix-width-container .oa-button--full-width { width: min(100%, 360px); }
        .matrix-note { color: #766b5f; font-size: 11px; margin: 12px 0 0; }
        @media (max-width: 540px) {
          .matrix-page { padding: 20px 16px 40px; }
          .matrix-size-grid { display: none; }
          .matrix-width-grid { grid-template-columns: minmax(0, 1fr); }
        }
      `}</style>
      <h1 className="matrix-title">Optical Anchor / Component Matrix</h1>
      <p className="matrix-description">QA surface for the public size and full-width variants. Use the main showcase for the design study; this page exists to exercise the underlying component across dimensions and pointer types.</p>

      <section className="matrix-size-grid" aria-label="Fixed button sizes">
        <div className="matrix-panel" data-testid="size-sm">
          <h2>Small · 236 × 64</h2>
          <div className="matrix-button-stage"><OpticalButton size="sm" aria-label="Small Optical Anchor" /></div>
        </div>
        <div className="matrix-panel" data-testid="size-md">
          <h2>Medium · 280 × 76</h2>
          <div className="matrix-button-stage"><OpticalButton size="md" aria-label="Medium Optical Anchor" /></div>
        </div>
        <div className="matrix-panel" data-testid="size-lg">
          <h2>Large · 324 × 88</h2>
          <div className="matrix-button-stage"><OpticalButton size="lg" aria-label="Large Optical Anchor" /></div>
        </div>
      </section>

      <section aria-labelledby="matrix-width-title">
        <h2 id="matrix-width-title" className="matrix-title" style={{ fontSize: 18 }}>Full-width contract</h2>
        <p className="matrix-description">The housing expands to its parent up to 360 px. The eye and bezel remain centered.</p>
        <div className="matrix-width-grid">
          <div className="matrix-panel" data-testid="fullwidth-wide">
            <h2>Wide parent · 420 px cap</h2>
            <div className="matrix-width-container matrix-width-container--wide">
              <div className="matrix-button-stage"><OpticalButton fullWidth aria-label="Wide full-width Optical Anchor" /></div>
            </div>
            <p className="matrix-note">Control must cap at 360 px when the parent is wider.</p>
          </div>
          <div className="matrix-panel" data-testid="fullwidth-narrow">
            <h2>Narrow parent · 248 px</h2>
            <div className="matrix-width-container matrix-width-container--narrow">
              <div className="matrix-button-stage"><OpticalButton fullWidth aria-label="Narrow full-width Optical Anchor" /></div>
            </div>
            <p className="matrix-note">Control must fill the available parent width.</p>
          </div>
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById('matrix-root')!).render(
  <StrictMode>
    <ComponentMatrix />
  </StrictMode>,
);
