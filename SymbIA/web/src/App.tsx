import { MainLayout } from './layouts';
import { Header } from './components';
import { HomePage } from './pages';
import { useTheme } from './hooks';
import './styles/globals.scss';

function App() {
  const { theme } = useTheme();

  return (
    <div className="App" data-theme={theme}>
      <MainLayout
        header={<Header />}
      >
        <HomePage />
      </MainLayout>
    </div>
  );
}

export default App;
