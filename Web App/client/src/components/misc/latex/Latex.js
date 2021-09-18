import React from 'react';
import PropTypes from 'prop-types';
import Markdown from './Markdown';

const _renderContent = (content) => {
    console.log(content);
    return (<Markdown source={content} />)
};

function Latex(props){
    const { content } = props;
    console.log(content);
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