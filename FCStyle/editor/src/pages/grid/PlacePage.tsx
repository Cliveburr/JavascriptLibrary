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
  corSuccess: SimpleTest[];
  corWarning: SimpleTest[];
  corDanger: SimpleTest[];
}

const PlacePage: React.FC = () => {
  const [state, setState] = useState<State>({
    corOne: Array.from({ length: 4 }, (_, i) => ({ i, text: `Cor one ${i}` })),
    corTwo: Array.from({ length: 4 }, (_, i) => ({ i, text: `Cor two ${i}` })),
    corThree: Array.from({ length: 4 }, (_, i) => ({ i, text: `Cor three ${i}` })),
    corFour: Array.from({ length: 4 }, (_, i) => ({ i, text: `Cor four ${i}` })),
    corFive: Array.from({ length: 4 }, (_, i) => ({ i, text: `Cor five ${i}` })),
    corSix: Array.from({ length: 4 }, (_, i) => ({ i, text: `Cor six ${i}` })),
    corSeven: Array.from({ length: 4 }, (_, i) => ({ i, text: `Cor seven ${i}` })),
    corSuccess: Array.from({ length: 4 }, (_, i) => ({ i, text: `Cor success ${i}` })),
    corWarning: Array.from({ length: 4 }, (_, i) => ({ i, text: `Cor warning ${i}` })),
    corDanger: Array.from({ length: 4 }, (_, i) => ({ i, text: `Cor danger ${i}` }))
  });

  return (
    <Rows gap m>
      <Rows gap p b>
        <h1>Place Color "one"</h1>
        <Columns gap>
          {state.corOne.map(p => (<Place one p w4 key={p.i}>{p.text}</Place>))}
        </Columns>
      </Rows>
      <Rows gap p b>
        <h1>Place Color "two"</h1>
        <Columns gap>
          {state.corTwo.map(p => (<Place two p w4 key={p.i}>{p.text}</Place>))}
        </Columns>
      </Rows>
      <Rows gap p b>
        <h1>Place Color "three"</h1>
        <Columns gap>
          {state.corThree.map(p => (<Place three p w4 key={p.i}>{p.text}</Place>))}
        </Columns>
      </Rows>
      <Rows gap p b>
        <h1>Place Color "four"</h1>
        <Columns gap>
          {state.corFour.map(p => (<Place four p w4 key={p.i}>{p.text}</Place>))}
        </Columns>
      </Rows>
      <Rows gap p b>
        <h1>Place Color "five"</h1>
        <Columns gap>
          {state.corFive.map(p => (<Place five p w4 key={p.i}>{p.text}</Place>))}
        </Columns>
      </Rows>
      <Rows gap p b>
        <h1>Place Color "six"</h1>
        <Columns gap>
          {state.corSix.map(p => (<Place six p w4 key={p.i}>{p.text}</Place>))}
        </Columns>
      </Rows>
      <Rows gap p b>
        <h1>Place Color "seven"</h1>
        <Columns gap>
          {state.corSeven.map(p => (<Place seven p w4 key={p.i}>{p.text}</Place>))}
        </Columns>
      </Rows>
      <Rows gap p b>
        <h1>Place Color "success"</h1>
        <Columns gap>
          {state.corSuccess.map(p => (<Place success p w4 key={p.i}>{p.text}</Place>))}
        </Columns>
      </Rows>
      <Rows gap p b>
        <h1>Place Color "warning"</h1>
        <Columns gap>
          {state.corWarning.map(p => (<Place warning p w4 key={p.i}>{p.text}</Place>))}
        </Columns>
      </Rows>
      <Rows gap p b>
        <h1>Place Color "danger"</h1>
        <Columns gap>
          {state.corDanger.map(p => (<Place danger p w4 key={p.i}>{p.text}</Place>))}
        </Columns>
      </Rows>
    </Rows>
  )
}

export default PlacePage;