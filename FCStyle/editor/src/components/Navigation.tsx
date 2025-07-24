import React from 'react'
import { Link } from 'react-router-dom'

const Navigation: React.FC = () => {
  return (
    <nav className="editor-nav">
      <div className="editor-nav__brand">
        <h1>FCStyle Editor</h1>
      </div>
      <ul className="editor-nav__menu">
        <li><Link to="/">Home</Link></li>
        <li className="editor-nav__group">
          <span>Components</span>
          <ul>
            <li><Link to="/components/button">Button</Link></li>
          </ul>
        </li>
        <li className="editor-nav__group">
          <span>Grid</span>
          <ul>
            <li><Link to="/grid/column">Column</Link></li>
            <li><Link to="/grid/row">Row</Link></li>
          </ul>
        </li>
        <li className="editor-nav__group">
          <span>Form</span>
          <ul>
            <li><Link to="/form/input">Input</Link></li>
            <li><Link to="/form/input-field">InputField</Link></li>
          </ul>
        </li>
      </ul>
    </nav>
  )
}

export default Navigation
