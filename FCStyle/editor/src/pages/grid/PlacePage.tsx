import { Columns, Place, Rows } from 'fcstyle'
import React, { useState } from 'react'

interface SimpleTest {
  i: number;
  text: string;
  isHoverable?: boolean;
  isSelectable?: boolean;
  isSelected?: boolean;
}

interface State {
  corOne: SimpleTest[];
  corTwo: SimpleTest[];
  corThree: SimpleTest[];
  corFour: SimpleTest[];
  corFive: SimpleTest[];
  corSix: SimpleTest[];
  corSeven: SimpleTest[];
}

const PlacePage: React.FC = () => {
  const [state, setState] = useState<State>({
    corOne: Array.from({ length: 4 }, (_, i) => ({ i, text: `Cor one ${i}` })),
    corTwo: Array.from({ length: 4 }, (_, i) => ({ i, text: `Cor two ${i}` })),
    corThree: Array.from({ length: 4 }, (_, i) => ({ i, text: `Cor three ${i}` })),
    corFour: Array.from({ length: 4 }, (_, i) => ({ i, text: `Cor four ${i}` })),
    corFive: Array.from({ length: 4 }, (_, i) => ({ i, text: `Cor five ${i}` })),
    corSix: Array.from({ length: 4 }, (_, i) => ({ i, text: `Cor six ${i}` })),
    corSeven: Array.from({ length: 4 }, (_, i) => ({ i, text: `Cor seven ${i}` }))
  });

  return (
    <Rows gap m>
      <Rows gap border>
        <h1>Place Color "one"</h1>
        <Columns gap>
          {state.corOne.map(p => (<Place one p key={p.i}>{p.text}</Place>))}
        </Columns>
      </Rows>
      <Rows gap border>
        <h1>Place Color "two"</h1>
        <Columns gap>
          {state.corTwo.map(p => (<Place two p key={p.i}>{p.text}</Place>))}
        </Columns>
      </Rows>
    </Rows>
  )
}

export default PlacePage;