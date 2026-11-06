import { OpticalButton } from './components/OpticalButton';
import './styles/app.css';

export default function App() {
  return (
    <main className="art-only-page">
      <OpticalButton
        className="oa-button--art-only"
        aria-label="Optical Anchor"
        children={null}
      />
    </main>
  );
}
