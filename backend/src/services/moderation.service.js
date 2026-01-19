/**
 * List of bad words for content moderation (Vietnamese)
 * Add more words as needed
 */
const BAD_WORDS = [
  // Vietnamese bad words
  'đồ ngu',
  'ngu ngốc',
  'đần độn',
  'chết tiệt',
  'đm',
  'dm',
  'đéo',
  'vãi',
  'vcl',
  'vkl',
  'cc',
  'cức',
  'đụ',
  'địt',
  'lồn',
  'buồi',
  'cặc',
  'fuck',
  'shit',
  'damn',
  'bitch',
  'ass',
  'hell',
  
  // Add more as needed
];

/**
 * Check if message contains bad words
 * @param {string} message - Message to check
 * @returns {object} - { hasBadWord: boolean, detectedWords: array }
 */
const checkBadWords = (message) => {
  const lowerMessage = message.toLowerCase();
  const detectedWords = [];

  BAD_WORDS.forEach(word => {
    if (lowerMessage.includes(word.toLowerCase())) {
      detectedWords.push(word);
    }
  });

  return {
    hasBadWord: detectedWords.length > 0,
    detectedWords
  };
};

/**
 * Clean message by replacing bad words with asterisks
 * @param {string} message - Message to clean
 * @returns {string} - Cleaned message
 */
const cleanMessage = (message) => {
  let cleanedMessage = message;

  BAD_WORDS.forEach(word => {
    const regex = new RegExp(word, 'gi');
    cleanedMessage = cleanedMessage.replace(regex, '*'.repeat(word.length));
  });

  return cleanedMessage;
};

module.exports = {
  checkBadWords,
  cleanMessage,
  BAD_WORDS
};
