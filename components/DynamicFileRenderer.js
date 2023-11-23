import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import FileType from 'file-type/browser';
// import { Canvas } from '@react-three/fiber';
// import { OrbitControls, Loader, useGLTF } from '@react-three/drei';

const Model = ({ url }) => {
  const { scene } = useGLTF(url);
  return <primitive object={scene} dispose={null} />;
};

const DynamicFileRenderer = ({ url, txid }) => {
  const [fileData, setFileData] = useState(null);
  const [mimeType, setMimeType] = useState(null);

  useEffect(() => {
    const fetchFile = async () => {
    console.log("fetching file");
      try {
        console.log({url})
        const response = await fetch(url);
        console.log(response.data);
        const buffer = await response.arrayBuffer();
        console.log({buffer})
        let type = await FileType.fromBuffer(buffer);
        console.log({type});
        if(!type){type = {}; type['mime'] = "text/plain"}
        if (type) {
          setMimeType(type.mime);
          setFileData(buffer);
        }
      } catch (error) {
        console.error('Error fetching file:', error);
      }
    };

    fetchFile();
  }, [url]);

  const renderFile = () => {
    if (!fileData || !mimeType) {
      return <div>Loading...</div>;
    }

    const blob = new Blob([fileData], { type: mimeType });
    const src = URL.createObjectURL(blob);
    console.log({mimeType})
    if (mimeType.startsWith('image/')) {
      return <img src={src} alt="" />;
    } else if (mimeType.startsWith('audio/')) {
      return <audio controls src={src}></audio>;
    } else if (mimeType.startsWith('video/')) {
      return <video controls src={src}></video>;
    } else if (mimeType.startsWith('text/')) {
      let height = src.length > 200 ? 400:50;
      let parsed;
      try{
        const decoder = new TextDecoder('utf-8');
        const string = decoder.decode(fileData);
        console.log("Buffer as string:", string);
        JSON.parse(string);
        height = 100;
      }catch(err){console.log("there was an error parsing the string")}
      return (
        <>
        <iframe
          title="text-preview"
          src={src}
          height={height}
        ></iframe>
        <Link target="_blank" href={`https://www.1satordinals.com/tx/${txid}`}> tx</Link>
        </>
      );
    } 
     else {
      return (
        <div>
          <p>Unsupported MIME type: {mimeType}</p>
          <a href={src} download>
            Download File
          </a>
        </div>
      );
    }
  };

  return (
    <div>
      {renderFile()}
    </div>
  );
};

export default DynamicFileRenderer;