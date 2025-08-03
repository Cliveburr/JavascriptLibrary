import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts';
import { Header, NotificationContainer } from './components';
import { HomePage, LoginPage, RegisterPage, DashboardPage } from './pages';
import { useTheme } from './hooks';
import { useAuthStore } from './stores';
import './styles/globals.scss';

// Componente para rotas privadas
const PrivateRoute: React.FC<{ children: React.ReactNode; }> = ({ children }) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Componente para rotas públicas (apenas para usuários NÃO autenticados)
const PublicRoute: React.FC<{ children: React.ReactNode; }> = ({ children }) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

function App() {
  const { theme } = useTheme();

  return (
    <div className="App" data-theme={theme} data-testid="app">
      <Router>
        <Routes>
          {/* Rotas públicas - sempre acessíveis */}
          <Route
            path="/"
            element={
              <MainLayout header={<Header />}>
                <HomePage />
              </MainLayout>
            }
          />

          {/* Rotas de autenticação - apenas para usuários não autenticados */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />

          {/* Rotas privadas - apenas para usuários autenticados */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />

          {/* Rota catch-all */}
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>

        {/* Container de notificações - sempre presente */}
        <NotificationContainer />
      </Router>
    </div>
  );
}

export default App;
