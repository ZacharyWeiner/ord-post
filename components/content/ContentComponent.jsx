import React from 'react';

const ContentComponent = ({ content }) => {
  // Function to replace URLs with anchor tags and Base64 images with img tags
  const replaceURLsAndImages = (text) => {
    // Replace URLs with anchor tags
    const urlRegex = /(\bhttps?:\/\/[-A-Z0-9+&@#/%=~_|$?!:,.()]+[-A-Z0-9+&@#/%=~_|])/ig;
    let replacedText = text.replace(urlRegex, (url) => {
      return `<a href="${url}" class="text-blue-500" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });

    // Replace Base64 images with img tags
    const base64ImageRegex = /(\bdata:image\/[a-zA-Z]+;base64,[^\s"]+)/ig;
    replacedText = replacedText.replace(base64ImageRegex, (imageData) => {
      return `<img src="${imageData}" alt="Embedded Image" />`;
    });

    return replacedText;
  };

  // Render the content with URLs and images replaced
  return (
    <div dangerouslySetInnerHTML={{ __html: replaceURLsAndImages(content) }} />
  );
};

export default ContentComponent;
