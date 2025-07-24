import React, { useState } from 'react'
import { applyTheme } from 'fcstyle'

const ThemeCustomizer: React.FC = () => {
  const [colors, setColors] = useState({
    primary: '#007bff',
    secondary: '#6c757d',
    success: '#28a745',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8'
  })

  const [sizes, setSizes] = useState({
    small: '0.75rem',
    medium: '1rem',
    large: '1.25rem'
  })

  const handleColorChange = (colorName: string, value: string) => {
    const newColors = { ...colors, [colorName]: value }
    setColors(newColors)
    
    // Apply theme variables
    applyTheme({
      [`--fcstyle-color-${colorName}`]: value
    })
  }

  const handleSizeChange = (sizeName: string, value: string) => {
    const newSizes = { ...sizes, [sizeName]: value }
    setSizes(newSizes)
    
    // Apply theme variables
    applyTheme({
      [`--fcstyle-size-${sizeName}`]: value
    })
  }

  const exportTheme = () => {
    const theme = {
      colors,
      sizes
    }
    
    const dataStr = JSON.stringify(theme, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = 'fcstyle-theme.json'
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  return (
    <div className="theme-customizer">
      <h3>Customizador de Tema</h3>
      
      <div className="theme-section">
        <h4>Cores</h4>
        <div className="theme-controls">
          {Object.entries(colors).map(([colorName, colorValue]) => (
            <div key={colorName} className="theme-control">
              <label htmlFor={`color-${colorName}`}>
                {colorName.charAt(0).toUpperCase() + colorName.slice(1)}:
              </label>
              <input
                id={`color-${colorName}`}
                type="color"
                value={colorValue}
                onChange={(e) => handleColorChange(colorName, e.target.value)}
              />
              <span className="color-value">{colorValue}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="theme-section">
        <h4>Tamanhos</h4>
        <div className="theme-controls">
          {Object.entries(sizes).map(([sizeName, sizeValue]) => (
            <div key={sizeName} className="theme-control">
              <label htmlFor={`size-${sizeName}`}>
                {sizeName.charAt(0).toUpperCase() + sizeName.slice(1)}:
              </label>
              <input
                id={`size-${sizeName}`}
                type="text"
                value={sizeValue}
                onChange={(e) => handleSizeChange(sizeName, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="theme-actions">
        <button className="export-button" onClick={exportTheme}>
          Exportar Tema
        </button>
      </div>
    </div>
  )
}

export default ThemeCustomizer
