import React from "react";
import ReactMarkdown from "react-markdown";
import RemarkMathPlugin from "remark-math";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

const _mapProps = (props) => {
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
  return (
    <ReactMarkdown {..._mapProps(props)} />
  )
};

export default Markdown;
