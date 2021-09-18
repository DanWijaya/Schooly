import React from 'react';
import PropTypes from 'prop-types';
import Markdown from './Markdown';

const _renderContent = (content) => {
  return (<Markdown source={content} />)
};

function Latex(props){
  const { content } = props;

  return (
    <div className="question" style={{fontSize: "1.3rem"}}>
      {_renderContent(content)}
    </div>
  )
}

Latex.propTypes = {
  content: PropTypes.string.isRequired,
};

export default Latex;
