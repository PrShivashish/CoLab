
import { Toaster } from 'react-hot-toast';
import './style.css';
import './styles/themes.css';
import { MouseTrail } from './components/ui/MouseTrail';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import EditorPage from './pages/EditorPage';
import Test from './pages/Test';
import LandingPage from './pages/LandingPage';
import JoinViaLink from './pages/JoinViaLink';

function App() {
  return (
    <>
      <MouseTrail />
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: '#18181b', // Zinc-900
            color: '#fff',
            border: '1px solid #27272a', // Zinc-800
          },
          success: {
            iconTheme: {
              primary: '#7c3aed', // Violet-600
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444', // Red-500
              secondary: '#fff',
            },
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/join" element={<JoinViaLink />} />
          <Route path="/editor/:roomId" element={<EditorPage />} />
          <Route path="/test" element={<Test />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
