import React from 'react'
import { Button, Columns } from 'fcstyle'

const ButtonPage: React.FC = () => {
  return (
    <Columns gap m>
      <Button li="save" one>Cor One</Button>
      <Button one disabled>Disabled</Button>
      <Button two href="/">As link</Button>
      <Button li="star" ri="caret-down" four>Dropdown</Button>
    </Columns>
  )
}

export default ButtonPage
