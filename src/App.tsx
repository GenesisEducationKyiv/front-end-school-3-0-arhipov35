import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TrackList from './features/tracks/components/TrackList';
import { ToastProvider, useToast } from './contexts/ToastContext';
import { ToastContainer } from './shared/components/Toast';
import './App.css';

const ToastManager = () => {
  const { toasts, removeToast } = useToast();
  return <ToastContainer toasts={toasts} onClose={removeToast} />;
};

function App() {

  return (
    <ToastProvider>
      <Router>
        <div className="app-container">
          <header className="app-header">
            <div className="container">
              <h1 className="app-title">Music App</h1>
            </div>
          </header>
          
          <main className="container">
            <Routes>
              <Route path="/tracks" element={<TrackList />} />
              <Route path="/" element={<Navigate to="/tracks" replace />} />
            </Routes>
          </main>
          
          <footer className="app-footer">
            <div className="container">
              <p>&copy; {new Date().getFullYear()} Music App - Manage your tracks</p>
            </div>
          </footer>
          
          <ToastManager />
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;
