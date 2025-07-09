import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider, useToast } from '@/contexts/ToastContext';
import { ToastContainer } from '@/shared/components/Toast';
import './App.css';
import { lazy, Suspense } from 'react';

const TrackList = lazy(() => import('@/features/tracks/components/TrackList'));
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
            <Suspense fallback={<div className="loading">Loading...</div>}>
              <Routes>
                <Route path="/tracks" element={<TrackList />} />
                <Route path="/" element={<Navigate to="/tracks" replace />} />
              </Routes>
            </Suspense>
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
