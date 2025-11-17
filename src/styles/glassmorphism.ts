import { StyleSheet, ViewStyle } from 'react-native';

// Glassmorphism 공통 스타일
export const glassStyles = StyleSheet.create({
  // 기본 글래스 카드
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 24,
    borderWidth: 0,
    shadowColor: 'rgba(255, 255, 255, 0.5)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  // 강한 글래스 효과 (더 불투명)
  glassCardStrong: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    shadowColor: 'rgba(255, 255, 255, 0.5)',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 5,
  },

  // 약한 글래스 효과 (더 투명)
  glassCardLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.77)',
    borderRadius: 20,
    borderWidth: 0,
    shadowColor: 'rgba(255, 255, 255, 0.5)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },

  // 버튼용 글래스
  glassButton: {
    backgroundColor: 'rgba(0, 122, 255, 0.75)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  // 입력창용 글래스
  glassInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 12,
    borderWidth: 0,
    shadowColor: 'rgba(255, 255, 255, 0.5)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },

  // 헤더용 글래스
  glassHeader: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: 'rgba(255, 255, 255, 0.5)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  // 다크 글래스 (어두운 배경용)
  glassDark: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: 'rgba(255, 255, 255, 0.5)',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },

  // 그라데이션 배경용 컨테이너
  gradientBackground: {
    flex: 1,
    backgroundColor: '#E8F4FD', // 좀 더 진한 파란색 배경
  },

  gradientBackgroundBlue: {
    flex: 1,
    backgroundColor: '#E8F4FD',
  },

  gradientBackgroundPurple: {
    flex: 1,
    backgroundColor: '#F3E5F5',
  },

  gradientBackgroundPink: {
    flex: 1,
    backgroundColor: '#FCE4EC',
  },

  gradientBackgroundGreen: {
    flex: 1,
    backgroundColor: '#E8F5E9',
  },

  // 아바타/이미지용 글래스
  glassAvatar: {
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: 'rgba(255, 255, 255, 0.5)',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },

  // 플로팅 액션 버튼용
  glassFAB: {
    backgroundColor: 'rgba(0, 122, 255, 0.85)',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },

  // 뱃지용 글래스
  glassBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: 'rgba(255, 255, 255, 0.5)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
});

// 그라데이션 색상 팔레트
export const glassColors = {
  primary: 'rgba(0, 122, 255, 0.85)',
  secondary: 'rgba(88, 86, 214, 0.85)',
  success: 'rgba(52, 199, 89, 0.85)',
  warning: 'rgba(255, 149, 0, 0.85)',
  danger: 'rgba(255, 59, 48, 0.85)',
  info: 'rgba(90, 200, 250, 0.85)',
  light: 'rgba(255, 255, 255, 0.75)',
  dark: 'rgba(0, 0, 0, 0.3)',
};

// 그라데이션 배경 색상
export const gradientBackgrounds = {
  blue: ['#E3F2FD', '#BBDEFB', '#90CAF9'],
  purple: ['#F3E5F5', '#E1BEE7', '#CE93D8'],
  pink: ['#FCE4EC', '#F8BBD0', '#F48FB1'],
  green: ['#E8F5E9', '#C8E6C9', '#A5D6A7'],
  orange: ['#FFF3E0', '#FFE0B2', '#FFCC80'],
  cyan: ['#E0F7FA', '#B2EBF2', '#80DEEA'],
};

export default glassStyles;

