import { useDropzone } from 'react-dropzone';
import { useState } from 'react';
function OrbinalUploader() {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop: async (acceptedFiles) => {
        console.log('Fetching Decode Respons...');
        const file = acceptedFiles[0];
        const formData = new FormData();
        formData.append('image', file);
        console.log('packaged file up...');
        // Handle file upload and decoding
        const response = await fetch('/api/decode-orbinal', {
          method: 'POST',
          body: formData,
        });
        console.log("fetched response");
        const data = await response.json();
        console.log('Decoded data:', data);
        console.log('Decoded txid:', data.decodedTxid);
  
        // Here, you can also handle encoding if you need to
        // ...
      },
    });

  const [image, setImage] = useState(null);
  const [base64Image, setBase64Image] = useState("");
  const [mimeType, setMimeType] = useState("");
  const [decodedMessage, setDecodedMessage] = useState("")
  const [decodedTxid, setDecodedTxid] = useState("")

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setMimeType(e.target.files[0].type);
    const reader = new FileReader();
    reader.onloadend = () => {
      setBase64Image(reader.result);
    };
    reader.readAsDataURL(e.target.files[0]);
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result.split(',')[1]; // Remove the data URL prefix
      const response = await fetch('/api/decode-orbinal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ file: base64String }),
      });
      const data = await response.json();
      console.log({data})
      setDecodedMessage(data.message)
      setDecodedTxid(data.decodedTxid)
    };
    reader.readAsDataURL(image);
  };
    return (
      <div {...getRootProps()}>
       <form onSubmit={handleSubmit}> 
          <div className="mb-5">
          <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="image">
            Image:
          </label>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-indigo-500 focus:border-indigo-500"
            type="file"
            id="image"
            onChange={handleImageChange}
          />
        </div>
        <button> Submit</button>
        <br /> 
        {decodedMessage}
        <br />
        {decodedTxid}
       </form>
      </div>
    );
  };
export default OrbinalUploader;