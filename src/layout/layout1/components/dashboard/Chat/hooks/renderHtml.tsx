import React, { useMemo } from 'react';

interface Props {
  html: string;
}

const HtmlRenderer: React.FC<Props> = ({ html }) => {
  const sanitizedHtml = useMemo(() => {
    const div = document.createElement('div');
    div.innerHTML = html;
    const sanitized = [];
    while (div.firstChild) {
      sanitized.push(div.firstChild);
    }
    return sanitized;
  }, [html]);

  return <div>{sanitizedHtml}</div>;
};


export default HtmlRenderer;