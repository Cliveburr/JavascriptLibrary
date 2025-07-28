import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts';
import { Header } from './components';
import { HomePage, LoginPage, DashboardPage } from './pages';
import { useTheme } from './hooks';
import { useAuthStore } from './stores';
import './styles/globals.scss';

function App() {
  const { theme } = useTheme();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return (
    <div className="App" data-theme={theme} data-testid="app">
      <Router>
        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <LoginPage />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? (
                <DashboardPage />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <MainLayout header={<Header />}>
                  <HomePage />
                </MainLayout>
              )
            }
          />
          <Route
            path="*"
            element={
              <Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
