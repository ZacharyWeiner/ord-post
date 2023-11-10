// ContentComponent.jsx
import React from 'react';
import sanitizeHtml from 'sanitize-html';

const ContentComponent = ({ content }) => {
  // Sanitize the content to prevent XSS attacks
  const sanitizedContent = sanitizeHtml(content, {
    allowedTags: ['a'], // Allow only anchor tags
    allowedAttributes: {
      'a': ['href', 'target', 'rel'] // Allow only these attributes on anchor tags
    }
  });

  return (
    <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
  );
};

export default ContentComponent;