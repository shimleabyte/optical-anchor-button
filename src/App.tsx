import { useState } from 'react';
import { OpticalButton } from './components/OpticalButton';
import './styles/app.css';

type PreviewState = 'default' | 'hover' | 'tired' | 'pressed' | 'focus' | 'disabled' | 'loading';

const previewStates: { id: PreviewState; label: string; index: string }[] = [
  { id: 'default', label: 'Idle', index: '00' },
  { id: 'hover', label: 'Hover / Excited', index: '01' },
  { id: 'tired', label: 'Tired', index: '02' },
  { id: 'pressed', label: 'Pressed', index: '03' },
  { id: 'focus', label: 'Focus', index: '04' },
  { id: 'disabled', label: 'Disabled', index: '05' },
  { id: 'loading', label: 'Loading', index: '06' },
];

export default function App() {
  const [previewState, setPreviewState] = useState<PreviewState>('default');
  const [isPointerHovering, setIsPointerHovering] = useState(false);
  const [demoClicks, setDemoClicks] = useState(0);
  const classForState = previewState === 'hover'
    ? 'demo-force-hover'
    : previewState === 'tired'
      ? 'demo-force-tired'
      : previewState === 'pressed'
        ? 'demo-force-pressed'
        : previewState === 'focus'
          ? 'demo-force-focus'
          : '';
  const isDisabled = previewState === 'disabled';
  const isLoading = previewState === 'loading';
  const displayedState = isPointerHovering && !isDisabled && !isLoading ? 'HOVER' : previewState;

  return (
    <main className="studio-shell">
      <header className="studio-header">
        <a className="studio-mark" href="#top" aria-label="Optical Anchor study home">
          <span className="studio-mark__symbol" aria-hidden="true"><span /></span>
          <span>O/A <span className="studio-mark__divider">/</span> COMPONENTS</span>
        </a>
        <div className="header-meta">
          <span>DESIGN STUDY</span>
          <span className="header-meta__index">NO. 001</span>
        </div>
      </header>

      <section id="top" className="intro-grid">
        <div className="intro-copy">
          <p className="eyebrow"><span className="eyebrow__line" /> A SINGLE-COMPONENT EXPERIMENT</p>
          <h1>Optical<br /><span>Anchor.</span></h1>
          <p className="intro-description">
            A single oversized eye in a machined orange housing. Warm iris detail, quiet depth, and a gaze that follows the pointer.
          </p>
          <div className="intent-note">
            <span className="intent-note__number">01</span>
            <p>Interaction is the signature.<br />Decoration has to earn its place.</p>
          </div>
          <div className="palette-block">
            <p className="micro-label">MATERIAL REGISTER</p>
            <div className="swatch-row">
              <div className="swatch-item"><span className="swatch swatch--orange" /><span>Burnt orange<small>#B34D26</small></span></div>
              <div className="swatch-item"><span className="swatch swatch--graphite" /><span>Graphite<small>#191816</small></span></div>
              <div className="swatch-item"><span className="swatch swatch--ivory" /><span>Ivory<small>#F3EEE6</small></span></div>
            </div>
          </div>
        </div>

        <section className="object-stage" aria-labelledby="stage-title">
          <div className="stage-header">
            <div>
              <p className="micro-label">LIVE OBJECT / 001</p>
              <h2 id="stage-title">Optical Anchor <span>— Primary</span></h2>
            </div>
            <div className="stage-status"><span className="stage-status__dot" /> INTERACTIVE</div>
          </div>

          <div className="stage-center">
            <div className="object-index" aria-hidden="true"><span>OA</span><span>001</span></div>
            <div className="button-wrap">
              <OpticalButton
                className={classForState}
                disabled={isDisabled}
                loading={isLoading}
                onClick={() => setDemoClicks((count) => count + 1)}
                aria-label="Optical Anchor eye button"
                aria-describedby="button-hint"
                onPointerEnter={(event) => {
                  if (event.pointerType !== 'touch' && !isDisabled && !isLoading) setIsPointerHovering(true);
                }}
                onPointerLeave={(event) => {
                  if (event.pointerType !== 'touch') setIsPointerHovering(false);
                }}
              />
              <p id="button-hint" className="button-hint">Hover to wake the eye. The brow lifts and the collab bubble appears; move away to return to neutral.</p>
            </div>
            <div className="object-measure" aria-hidden="true"><span>132 PX</span><span>01 / OPTICAL</span></div>
          </div>

          <div className="stage-footer">
            <div className="state-readout"><span className="readout-key">STATE</span><span className="readout-value">{displayedState.toUpperCase()}</span></div>
            <div className="state-readout"><span className="readout-key">ACTIVATIONS</span><span className="readout-value">{String(demoClicks).padStart(2, '0')}</span></div>
            <div className="state-readout"><span className="readout-key">INPUT</span><span className="readout-value">POINTER / KEYBOARD</span></div>
          </div>
        </section>
      </section>

      <section className="state-section" aria-labelledby="state-title">
        <div className="section-heading">
          <div>
            <p className="micro-label">BEHAVIOUR MATRIX / 7 STATES</p>
            <h2 id="state-title">Inspect the response.</h2>
          </div>
          <p className="section-aside">Choose a visual state, hover the button once, then move the pointer anywhere in the page to test its gaze.</p>
        </div>
        <div className="state-selector" role="group" aria-label="Preview button state">
          {previewStates.map((state) => (
            <button
              key={state.id}
              type="button"
              className={`state-option ${previewState === state.id ? 'state-option--active' : ''}`}
              aria-pressed={previewState === state.id}
              onClick={() => setPreviewState(state.id)}
            >
              <span className="state-option__index">{state.index}</span>
              <span>{state.label}</span>
            </button>
          ))}
        </div>
        <div className="state-explanation" aria-live="polite">
          <span className="state-explanation__mark" aria-hidden="true" />
          <p>{stateExplanation(previewState)}</p>
          <button type="button" className="reset-button" onClick={() => { setPreviewState('default'); setDemoClicks(0); }}>RESET STUDY</button>
        </div>
      </section>

      <footer className="studio-footer">
        <span>OPTICAL ANCHOR / PROTOTYPE 0.1.0</span>
        <span>REACT · TYPESCRIPT · CSS</span>
        <span>NO THIRD-PARTY ICONS OR FONTS</span>
      </footer>
    </main>
  );
}

function stateExplanation(state: PreviewState) {
  const explanations: Record<PreviewState, string> = {
    default: 'The eye starts asleep. Hover the button to wake it; it follows the pointer across the page, grows tired after a pause, then sleeps.',
    hover: 'The eyelid opens and the iris responds to pointer direction. The housing stays restrained and tactile.',
    tired: 'The aperture settles halfway closed; the iris remains present but the upper lid softens its expression.',
    pressed: 'The entire enamel face presses by one pixel. The eye remains the only focal point.',
    focus: 'A clear external focus ring identifies keyboard focus without relying on color alone.',
    disabled: 'The housing is muted, the eye sleeps, and pointer motion is disabled.',
    loading: 'The eye sleeps while a small mechanical indicator communicates ongoing work.',
  };
  return explanations[state];
}
