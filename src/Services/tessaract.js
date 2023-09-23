import Tesseract from 'tesseract.js';

export const performOCR = async (imageData) => {
  const { data } = await Tesseract.recognize(imageData, 'eng', {
    logger: (info) => console.log(info), // Optional: For logging progress
  });
  return data.text;
};
