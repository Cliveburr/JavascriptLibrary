import React from 'react'
import Navigation from './Navigation'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="editor-layout">
      <Navigation />
      <main className="editor-main">
        {children}
      </main>
    </div>
  )
}

export default Layout
