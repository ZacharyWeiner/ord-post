import React from 'react';

const ContentComponent = ({ content }) => {
  // Function to replace URLs with anchor tags, Base64 images with img tags, and YouTube links with embeds
  const replaceURLsImagesAndYoutube = (text) => {
    // Replace URLs with anchor tags
    const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%=~_|$?!:,.()]+)/ig;
    let replacedText = text.replace(urlRegex, (url) => {
      // Check if the URL is a YouTube link
      const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w\-]+)/;
      const youtubeMatch = url.match(youtubeRegex);
      if (youtubeMatch && youtubeMatch[1]) {
        // Replace with YouTube embed
        return `<iframe width="560" height="315" src="https://www.youtube.com/embed/${youtubeMatch[1]}" frameborder="0" allowfullscreen></iframe>`;
      }

      // Normal URL replacement
      return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });

    // Replace Base64 images with img tags
    const base64ImageRegex = /(\bdata:image\/[a-zA-Z]+;base64,[^\s"]+)/ig;
    replacedText = replacedText.replace(base64ImageRegex, (imageData) => {
      return `<img src="${imageData}" class="max-w-xl" alt="Embedded Image" />`;
    });

    return replacedText;
  };

  // Render the content with URLs, images, and YouTube videos replaced
  return (
    <div dangerouslySetInnerHTML={{ __html: replaceURLsImagesAndYoutube(content) }} />
  );
};

export default ContentComponent;
