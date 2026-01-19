const axios = require('axios');

/**
 * Generate slide content using AI API (OpenAI or Gemini)
 */
const generateSlideWithAI = async ({ topic, level, numberSlide, language }) => {
  try {
    const prompt = createSlidePrompt(topic, level, numberSlide, language);

    // Check which AI service to use
    const apiUrl = process.env.AI_API_URL || 'https://api.openai.com/v1';
    const apiKey = process.env.AI_API_KEY;

    if (!apiKey) {
      throw new Error('AI API Key not configured');
    }

    // OpenAI API call
    if (apiUrl.includes('openai')) {
      const response = await axios.post(
        `${apiUrl}/chat/completions`,
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are an expert educational content creator. Generate well-structured, engaging educational slides in JSON format.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const content = response.data.choices[0].message.content;
      const parsedContent = parseAIResponse(content);

      return {
        title: parsedContent.title || topic,
        slides: parsedContent.slides,
        model: 'gpt-3.5-turbo',
        tokensUsed: response.data.usage?.total_tokens || 0
      };
    }
    
    // Gemini API call
    else if (apiUrl.includes('gemini') || apiUrl.includes('google')) {
      const response = await axios.post(
        `${apiUrl}/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const content = response.data.candidates[0].content.parts[0].text;
      const parsedContent = parseAIResponse(content);

      return {
        title: parsedContent.title || topic,
        slides: parsedContent.slides,
        model: 'gemini-pro',
        tokensUsed: 0
      };
    }
    
    // Fallback: mock slides for testing
    else {
      console.warn('No valid AI API configured, returning mock slides');
      return generateMockSlides(topic, numberSlide);
    }

  } catch (error) {
    console.error('AI API Error:', error.response?.data || error.message);
    
    // Return mock slides on error
    return generateMockSlides(topic, numberSlide);
  }
};

/**
 * Create prompt for AI
 */
const createSlidePrompt = (topic, level, numberSlide, language) => {
  const levelMap = {
    easy: 'cơ bản, dễ hiểu',
    medium: 'trung bình',
    hard: 'nâng cao, chuyên sâu'
  };

  return `Hãy tạo ${numberSlide} slide bài giảng về chủ đề "${topic}" với mức độ ${levelMap[level]} bằng ${language === 'vi' ? 'tiếng Việt' : 'tiếng Anh'}.

Trả về kết quả dạng JSON với format:
{
  "title": "Tiêu đề bài giảng",
  "slides": [
    {
      "order": 1,
      "title": "Tiêu đề slide",
      "content": "Nội dung chính của slide",
      "bulletPoints": ["Điểm 1", "Điểm 2", "Điểm 3"]
    }
  ]
}

Yêu cầu:
- Nội dung rõ ràng, dễ hiểu
- Mỗi slide tập trung vào 1 ý chính
- Có ví dụ minh họa nếu phù hợp
- Bullet points ngắn gọn, súc tích`;
};

/**
 * Parse AI response to extract JSON
 */
const parseAIResponse = (content) => {
  try {
    // Try to find JSON in the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // If no JSON found, return empty structure
    throw new Error('No valid JSON found in AI response');
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    throw error;
  }
};

/**
 * Generate mock slides for testing
 */
const generateMockSlides = (topic, numberSlide) => {
  const slides = [];
  
  for (let i = 1; i <= numberSlide; i++) {
    slides.push({
      order: i,
      title: `${topic} - Phần ${i}`,
      content: `Nội dung chi tiết về ${topic} ở phần ${i}. Đây là nội dung mẫu được tạo tự động.`,
      bulletPoints: [
        `Điểm quan trọng ${i}.1`,
        `Điểm quan trọng ${i}.2`,
        `Điểm quan trọng ${i}.3`
      ]
    });
  }

  return {
    title: `Bài giảng: ${topic}`,
    slides,
    model: 'mock',
    tokensUsed: 0
  };
};

/**
 * Generate quiz questions from document content using Gemini AI
 */
const generateQuizFromDocument = async ({ documentText, numberOfQuestions = 10, difficulty = 'medium' }) => {
  try {
    const prompt = `
Bạn là giáo viên chuyên nghiệp. Phân tích tài liệu dưới đây và tạo ${numberOfQuestions} câu hỏi trắc nghiệm (A, B, C, D).

Yêu cầu:
- Mức độ: ${difficulty === 'easy' ? 'Dễ' : difficulty === 'medium' ? 'Trung bình' : 'Khó'}
- Mỗi câu hỏi có 4 đáp án (A, B, C, D)
- Chỉ có 1 đáp án đúng
- Câu hỏi phải liên quan trực tiếp đến nội dung tài liệu
- Đa dạng các dạng câu hỏi: nhận biết, hiểu, vận dụng

Trả về JSON với format:
{
  "questions": [
    {
      "question": "Câu hỏi số 1?",
      "options": {
        "A": "Đáp án A",
        "B": "Đáp án B", 
        "C": "Đáp án C",
        "D": "Đáp án D"
      },
      "correctAnswer": "A",
      "explanation": "Giải thích tại sao A đúng",
      "difficulty": "medium",
      "type": "multiple_choice"
    }
  ]
}

NỘI DUNG TÀI LIỆU:
${documentText}
`;

    const apiKey = process.env.AI_API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API Key not configured');
    }

    // Call Gemini API
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const generatedText = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      throw new Error('No response from Gemini API');
    }

    // Parse JSON from response
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from AI');
    }

    const quizData = JSON.parse(jsonMatch[0]);
    
    return {
      success: true,
      questions: quizData.questions,
      totalQuestions: quizData.questions.length,
      difficulty: difficulty
    };

  } catch (error) {
    console.error('❌ Error generating quiz from document:', error.message);
    
    // Fallback: Return sample questions
    return {
      success: false,
      error: error.message,
      questions: generateSampleQuestions(numberOfQuestions),
      totalQuestions: numberOfQuestions,
      difficulty: difficulty,
      note: 'Using sample questions due to API error'
    };
  }
};

/**
 * Generate sample questions as fallback
 */
const generateSampleQuestions = (count = 5) => {
  const samples = [];
  for (let i = 1; i <= count; i++) {
    samples.push({
      question: `Câu hỏi mẫu số ${i} (AI API không khả dụng)`,
      options: {
        A: 'Đáp án A',
        B: 'Đáp án B',
        C: 'Đáp án C',
        D: 'Đáp án D'
      },
      correctAnswer: 'A',
      explanation: 'Đây là câu hỏi mẫu. Vui lòng cấu hình Gemini API Key.',
      difficulty: 'medium',
      type: 'multiple_choice'
    });
  }
  return samples;
};

module.exports = {
  generateSlideWithAI,
  generateQuizFromDocument
};
