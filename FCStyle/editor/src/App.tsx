import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import ButtonPage from './pages/components/ButtonPage'
import MenuPage from './pages/components/MenuPage'
import ColumnPage from './pages/grid/ColumnPage'
import RowPage from './pages/grid/RowPage'
import DivisorPage from './pages/grid/DivisorPage'
import InputPage from './pages/form/InputPage'
import InputFieldPage from './pages/form/InputFieldPage'
import PlacePage from './pages/grid/PlacePage'
import { TypographyPage } from './pages/TypographyPage'
import { EffectsPage } from './pages/EffectsPage'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/typography" element={<TypographyPage />} />
          <Route path="/components/button" element={<ButtonPage />} />
          <Route path="/components/menu" element={<MenuPage />} />
          <Route path="/grid/place" element={<PlacePage />} />
          <Route path="/grid/column" element={<ColumnPage />} />
          <Route path="/grid/row" element={<RowPage />} />
          <Route path="/grid/divisor" element={<DivisorPage />} />
          <Route path="/form/input" element={<InputPage />} />
          <Route path="/form/input-field" element={<InputFieldPage />} />
          <Route path="/effects" element={<EffectsPage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
