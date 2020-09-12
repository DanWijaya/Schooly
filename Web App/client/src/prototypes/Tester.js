import React from 'react';
import { Fraction, toTex } from 'algebra.js';
import { Node, Context } from 'react-mathjax2';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { List, ListItem, ListItemText } from "@material-ui/core";

function Formula(props) {
  return (
    <Context input="tex">
      <Node inline>{props.tex}</Node>
    </Context>
  );
}

export default function Tester() {
  //Latex
  const a = new Fraction(1, 5);
  const b = new Fraction(2, 7);
  const answer = a.multiply(b);

  const question = <Formula tex={`${toTex(a)} × ${toTex(b)} = ${toTex(answer)}`} />;

  document.getElementById('math')

  return (
    <div>
      {question}
      <InlineMath math="\\int_0^\\infty x^2 dx"/>
      <BlockMath math="\\int_0^\\infty x^2 dx"/>
      <List>
        <ListItem>
          <ListItemText
            primary="Test"
            secondary="adjsnadnjsadnjsand"
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Test"
          />
        </ListItem>
      </List>
    </div>
  );
}
