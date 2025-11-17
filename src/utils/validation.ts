import { BANNED_WORDS, MAX_FEED_LENGTH, ERROR_MESSAGES } from '../constants';

// 이메일 유효성 검사
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 비밀번호 유효성 검사
export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

// 닉네임 유효성 검사
export const validateNickname = (nickname: string): boolean => {
  return nickname.trim().length > 0 && nickname.length <= 20;
};

// 금지어 체크
export const containsBannedWord = (text: string): boolean => {
  const lowerText = text.toLowerCase();
  return BANNED_WORDS.some(word => lowerText.includes(word.toLowerCase()));
};

// 피드 길이 체크
export const validateFeedLength = (content: string): boolean => {
  return content.length <= MAX_FEED_LENGTH;
};

// 금지어를 포함한 텍스트 검증
export const validateText = (text: string): { valid: boolean; message?: string } => {
  if (containsBannedWord(text)) {
    return { valid: false, message: ERROR_MESSAGES.BANNED_WORD_DETECTED };
  }
  return { valid: true };
};

// 피드 컨텐츠 검증
export const validateFeedContent = (content: string): { valid: boolean; message?: string } => {
  if (!validateFeedLength(content)) {
    return { valid: false, message: ERROR_MESSAGES.FEED_TOO_LONG };
  }
  if (containsBannedWord(content)) {
    return { valid: false, message: ERROR_MESSAGES.BANNED_WORD_DETECTED };
  }
  return { valid: true };
};

