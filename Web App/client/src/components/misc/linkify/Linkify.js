import React from "react";
import Linkify from "react-linkify";

function CustomLinkify(props) {
  return (
    <Linkify
      componentDecorator={(decoratedHref, decoratedText, key) => (
        <a target="blank" href={decoratedHref} key={key}>
          {decoratedText}
        </a>
      )}
    >
      {props.text}
    </Linkify>
  );
}

export default CustomLinkify;
