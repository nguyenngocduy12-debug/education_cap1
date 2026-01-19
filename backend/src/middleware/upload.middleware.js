const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.pdf', '.doc', '.docx', '.txt'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận file PDF, DOC, DOCX, TXT'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

/**
 * Extract text from PDF file
 */
const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    throw new Error(`Lỗi đọc file PDF: ${error.message}`);
  }
};

/**
 * Extract text from Word file (.doc, .docx)
 */
const extractTextFromWord = async (filePath) => {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch (error) {
    throw new Error(`Lỗi đọc file Word: ${error.message}`);
  }
};

/**
 * Extract text from TXT file
 */
const extractTextFromTxt = async (filePath) => {
  try {
    const text = await fs.readFile(filePath, 'utf-8');
    return text;
  } catch (error) {
    throw new Error(`Lỗi đọc file TXT: ${error.message}`);
  }
};

/**
 * Extract text from uploaded file based on file type
 */
const extractTextFromFile = async (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  
  switch (ext) {
    case '.pdf':
      return await extractTextFromPDF(filePath);
    case '.doc':
    case '.docx':
      return await extractTextFromWord(filePath);
    case '.txt':
      return await extractTextFromTxt(filePath);
    default:
      throw new Error('Định dạng file không được hỗ trợ');
  }
};

/**
 * Delete uploaded file after processing
 */
const deleteFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.error('Error deleting file:', error);
  }
};

module.exports = {
  upload,
  extractTextFromFile,
  deleteFile
};
