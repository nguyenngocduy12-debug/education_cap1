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

module.exports = {
  generateSlideWithAI
};
