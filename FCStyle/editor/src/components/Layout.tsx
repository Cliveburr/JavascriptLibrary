import React from 'react'
import Navigation from './Navigation'
import { Divisor } from 'fcstyle'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Divisor
            name="home"
            initialSize={250}
            minSize={100}
            maxSize={400}
            thickness={4}
            firstPanel={
              <Navigation />
            }
            secondPanel={
              <main>
                {children}
              </main>
            }
    />
  )
}

export default Layout
