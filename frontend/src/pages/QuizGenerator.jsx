import { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

const QuizGenerator = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [settings, setSettings] = useState({
    numberOfQuestions: 10,
    difficulty: 'medium'
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 
                           'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                           'text/plain'];
      
      if (!allowedTypes.includes(selectedFile.type)) {
        toast.error('Chỉ chấp nhận file PDF, DOC, DOCX, TXT');
        return;
      }

      // Validate file size (10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error('File không được vượt quá 10MB');
        return;
      }

      setFile(selectedFile);
      toast.success(`Đã chọn file: ${selectedFile.name}`);
    }
  };

  const handleGenerateQuiz = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error('Vui lòng chọn file tài liệu');
      return;
    }

    setLoading(true);
    setQuestions([]);

    try {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('numberOfQuestions', settings.numberOfQuestions);
      formData.append('difficulty', settings.difficulty);

      const response = await api.post('/quiz/generate-from-document', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setQuestions(response.data.data.questions);
        toast.success(`✅ Đã tạo ${response.data.data.totalQuestions} câu hỏi!`);
        
        if (response.data.data.note) {
          toast.info(response.data.data.note);
        }
      }
    } catch (error) {
      console.error('Error generating quiz:', error);
      toast.error(error.response?.data?.message || 'Lỗi khi tạo câu hỏi');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveQuiz = async () => {
    if (questions.length === 0) {
      toast.error('Chưa có câu hỏi để lưu');
      return;
    }

    try {
      const quizTitle = prompt('Nhập tên bài quiz:');
      if (!quizTitle) return;

      const quizData = {
        title: quizTitle,
        description: `Quiz được tạo từ file: ${file.name}`,
        questions: questions.map((q, index) => ({
          questionNumber: index + 1,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          points: 1
        })),
        passingScore: Math.ceil(questions.length * 0.6), // 60% pass
        timeLimit: questions.length * 2 // 2 minutes per question
      };

      const response = await api.post('/quiz/create', quizData);

      if (response.data.success) {
        toast.success('✅ Đã lưu quiz thành công!');
        // Reset form
        setFile(null);
        setQuestions([]);
      }
    } catch (error) {
      console.error('Error saving quiz:', error);
      toast.error(error.response?.data?.message || 'Lỗi khi lưu quiz');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🤖 Tạo Quiz Tự Động từ Tài Liệu</h1>

        {/* Upload Section */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">📄 Upload Tài Liệu</h2>
          
          <form onSubmit={handleGenerateQuiz} className="space-y-4">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Chọn file tài liệu (PDF, DOC, DOCX, TXT)
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100
                  cursor-pointer"
              />
              {file && (
                <p className="mt-2 text-sm text-gray-600">
                  ✅ {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </p>
              )}
            </div>

            {/* Settings */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Số lượng câu hỏi
                </label>
                <input
                  type="number"
                  min="5"
                  max="50"
                  value={settings.numberOfQuestions}
                  onChange={(e) => setSettings({ ...settings, numberOfQuestions: e.target.value })}
                  className="input w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Độ khó
                </label>
                <select
                  value={settings.difficulty}
                  onChange={(e) => setSettings({ ...settings, difficulty: e.target.value })}
                  className="input w-full"
                >
                  <option value="easy">Dễ</option>
                  <option value="medium">Trung bình</option>
                  <option value="hard">Khó</option>
                </select>
              </div>
            </div>

            {/* Generate Button */}
            <button
              type="submit"
              disabled={!file || loading}
              className="btn-primary w-full"
            >
              {loading ? (
                <>
                  <span className="inline-block animate-spin mr-2">⏳</span>
                  Đang tạo câu hỏi...
                </>
              ) : (
                '🤖 Tạo Câu Hỏi Tự Động'
              )}
            </button>
          </form>
        </div>

        {/* Questions Display */}
        {questions.length > 0 && (
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                ✅ Đã tạo {questions.length} câu hỏi
              </h2>
              <button
                onClick={handleSaveQuiz}
                className="btn-primary"
              >
                💾 Lưu Quiz
              </button>
            </div>

            <div className="space-y-6">
              {questions.map((q, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50">
                  <h3 className="font-semibold mb-3">
                    Câu {index + 1}: {q.question}
                  </h3>
                  
                  <div className="space-y-2 mb-3">
                    {Object.entries(q.options).map(([key, value]) => (
                      <div
                        key={key}
                        className={`p-2 rounded ${
                          key === q.correctAnswer
                            ? 'bg-green-100 border-2 border-green-500 font-semibold'
                            : 'bg-white border border-gray-300'
                        }`}
                      >
                        {key}. {value}
                        {key === q.correctAnswer && ' ✅'}
                      </div>
                    ))}
                  </div>

                  <div className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
                    <strong>💡 Giải thích:</strong> {q.explanation}
                  </div>

                  <div className="text-xs text-gray-500 mt-2">
                    Độ khó: {q.difficulty === 'easy' ? 'Dễ' : q.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        {questions.length === 0 && !loading && (
          <div className="card bg-blue-50">
            <h3 className="font-semibold mb-2">📝 Hướng dẫn sử dụng:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Upload file tài liệu (PDF, Word, hoặc TXT)</li>
              <li>Chọn số lượng câu hỏi muốn tạo (5-50)</li>
              <li>Chọn độ khó (Dễ, Trung bình, Khó)</li>
              <li>Click "Tạo Câu Hỏi Tự Động"</li>
              <li>AI sẽ phân tích tài liệu và sinh câu hỏi trắc nghiệm</li>
              <li>Xem lại câu hỏi và click "Lưu Quiz"</li>
            </ol>

            <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400">
              <p className="text-sm">
                ⚡ <strong>Powered by Google Gemini AI</strong> - Tự động phân tích nội dung và tạo câu hỏi chất lượng cao
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizGenerator;
