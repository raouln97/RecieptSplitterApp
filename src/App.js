// import React, { useRef, useState } from 'react';
// import Webcam from 'react-webcam';
// import { createWorker } from 'tesseract.js';
// // import Dropzone from 'react-dropzone';

// const ReceiptScanner = () => {
//   const webcamRef = useRef(null);
//   const [capturedImage, setCapturedImage] = useState(null);
//   const [pdfData, setPdfData] = useState(null);
//   const [scanState, setScanState] = useState(false);
//   const [selectedFile, setSelectedFile] = useState(null);

//   const captureImage = () => {
//     const video = webcamRef.current.video;
//     const canvas = document.createElement('canvas');
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
//     const ctx = canvas.getContext('2d');
//     ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

//     const imageSrc = canvas.toDataURL('image/jpeg');
//     setCapturedImage(imageSrc);
//   };

//   const convertToPdf = async () => {
//     if (capturedImage) {
//       const worker = await createWorker({
//         langPath: '...',
//         logger: m => console.log(m),
//       });
//       await worker.load();
//       await worker.loadLanguage('eng+chi_tra');
//       await worker.initialize('eng+chi_tra');

//       const { data: { text } } = await worker.recognize(capturedImage);
//       setPdfData(text);

//       await worker.terminate();
//     }
//   };

//   // const handleDrop = (acceptedFiles) => {
//   //   const reader = new FileReader();
//   //   reader.onload = () => {
//   //     setCapturedImage(reader.result);
//   //   };
//   //   reader.readAsDataURL(acceptedFiles[0]);
//   // };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setSelectedFile(file);
//   };

//   return (
//     <div>
//       <h1>Receipt Scanner</h1>
//       <button onClick={()=>setScanState(!scanState)}>Scan</button>
//       {scanState && (
//               <div>
//               <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
//               <br />
//               <button onClick={captureImage}>Capture</button>
//               <button onClick={convertToPdf}>Convert to PDF</button>
//               <br />
//               </div>

//       )
//       }
//       {capturedImage && (
//         <div>
//           <h2>Captured Image</h2>
//           <img src={capturedImage} alt="Captured" style={{ maxWidth: '100%' }} />
//         </div>
//       )}
//       <br />
//       {/* <Dropzone onDrop={handleDrop}>
//         {({ getRootProps, getInputProps }) => (
//           <div {...getRootProps()} style={{ border: '1px dashed black', padding: '1rem' }}>
//           <input  type="file"
//           id="pdfUpload"
//           accept=".pdf"
//           onChange={handleFileChange}
//           style={{ display: 'none' }}{...getInputProps()} />
//             <p>Drag and drop an image file here, or click to select an image file.</p>
//           </div>
//         )}
//       </Dropzone> */}
//     <div>
//       <label htmlFor="pdfUpload" className="custom-file-upload">
//         <input
//           type="file"
//           id="pdfUpload"
//           accept=".pdf"
//           onChange={handleFileChange}
//           style={{ display: 'none' }}
//         />
//         <span>Select PDF</span>
//       </label>
//       {selectedFile && <p>Selected File: {selectedFile.name}</p>}
//     </div>
//       <br />
//       {pdfData && (
//         <div>
//           <h2>Extracted PDF Data</h2>
//           <p>{pdfData}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ReceiptScanner;


import React, { useState } from 'react';
import { performOCR } from './Services/tessaract';
import { mockReciept } from './Mock/mockReciept';

function ReceiptScanner() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [pdfText, setPdfText] = useState('');
  const [userCount, setUserCount] = useState(0);


  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    // Read PDF text content
    const reader = new FileReader();
    reader.onload = async (event) => {
      const imageBlob = event.target.result;
      try {
        const ocrText = await performOCR(imageBlob);
        setPdfText(ocrText);
      } catch (error) {
        console.error('Error during OCR:', error);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // const readPdfText = async (fileData) => {
  //   const pdf = await pdfjs.getDocument({ data: fileData }).promise;
  //   let text = '';

  //   for (let i = 1; i <= pdf.numPages; i++) {
  //     const page = await pdf.getPage(i);
  //     const pageText = await page.getTextContent();
  //     text += pageText.items.map((item) => item.str).join(' ');
  //   }

  //   return text;
  // };


  return (
    <div>
      <label htmlFor="pdfUpload" className="custom-file-upload">
        <input
          type="file"
          id="pdfUpload"
          accept=".jpg, .jpeg, .png"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <span>Select PDF</span>
      </label>
      <br />
      <input type="number" onChange={(e)=> setUserCount(e.target.value)} placeholder={userCount}/>
      {
        Array.from({ length:  userCount}).map((_, index) => (
         <div>
          <input key={`${index}-user`} type="text" placeholder='Name'/>
          </div>
        ))
      }
      {/* <button onClick={()=>setUserCount(userCount+1)}>+</button> */}
      {selectedFile && <p>Selected File: {selectedFile.name}</p>}
      {pdfText && (
        <div>
          <h2>PDF Text Content:</h2>
          <pre>{pdfText}</pre>
        </div>
      )}
      <div>
        <h2>Breakdown</h2>
        {mockReciept.Receipt.Items.map((item, index)=>(
             Array.from({ length: item.Qty }).map((_, subIndex) => (
              <div >
                <text key={`${index}-${subIndex} - 2`}>
                {item.Item}: ${item.Rate}
                </text> 
                <div style={{ display: 'inline-block', paddingLeft: '10px' }}>
                  {Array.from({ length:  userCount}).map((_, index) => (
                        <input key={`${index}-user`} type="checkbox"/>
                    ))
                  }   
                </div> 
              </div> 
            ))
        ))}
      </div>
    </div>
  );
}

export default ReceiptScanner;
