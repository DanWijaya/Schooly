import React from "react";
import PropTypes from "prop-types";
import Markdown from "./Markdown";

const _renderContent = (content) => {
  return (<Markdown source={content} />)
};

function Latex(props){
  const { content } = props;

  return (
    <div>
      {_renderContent(content)}
    </div>
  )
}

Latex.propTypes = {
  content: PropTypes.string.isRequired,
};

export default Latex;
