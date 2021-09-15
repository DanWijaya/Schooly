import React from 'react';
import ReactMarkdown from 'react-markdown';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import RemarkMathPlugin from 'remark-math';

const _mapProps = (props) => 

{ console.log(props);
    return ({
    ...props,
    escapeHtml: false,
    plugins: [
      RemarkMathPlugin,
    ],
    renderers: {
      ...props.renderers,
      math: (opts) => <BlockMath math={opts.value} />,
      inlineMath: (opts) => <InlineMath math={opts.value} />,
    },
  })
};

const Markdown = (props) => {
  console.log(props);
  return (
  <ReactMarkdown {..._mapProps(props)} />
)
};

export default Markdown;
