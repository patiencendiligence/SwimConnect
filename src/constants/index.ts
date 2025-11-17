// 금지어 목록
export const BANNED_WORDS = [
  '욕설', '시발', '씨발', '개새끼', '병신', '미친',
  '섹스', '야동', '음란', '포르노',
  '도배', '광고', '홍보',
];

// 등급 시스템
export const LEVELS = [
  {
    level: 1,
    name: ' 불가사리',
    icon: 'star', // Ionicons 아이콘 이름
    emoji: '★',
    color: '#007AFF', // 파란색
    minSwimCount: 0,
    minLikeCount: 0,
    minFeedCount: 0,
    benefits: ['기본 기능 이용'],
  },
  {
    level: 2,
    name: ' 바다거부기',
    icon: 'fish',
    emoji: '☻',
    color: '#007AFF', // 파란색
    minSwimCount: 10,
    minLikeCount: 20,
    minFeedCount: 5,
    benefits: ['프로필 배지', '특별 아이콘'],
  },
  {
    level: 3,
    name: ' 해달이',
    icon: 'water',
    emoji: '☀︎',
    color: '#007AFF', // 파란색
    minSwimCount: 30,
    minLikeCount: 50,
    minFeedCount: 15,
    benefits: ['프리미엄 배지', '수영장 할인 쿠폰'],
  },
  {
    level: 4,
    name: ' 바다사자',
    icon: 'boat',
    emoji: '⛄︎',
    color: '#007AFF', // 파란색
    minLikeCount: 100,
    minFeedCount: 30,
    benefits: ['골드 배지', '광고 무료 게시 1회'],
  },
  {
    level: 5,
    name: ' 범고래킹',
    icon: 'trophy',
    emoji: '👑',
    color: '#007AFF', // 파란색
    minSwimCount: 100,
    minLikeCount: 200,
    minFeedCount: 50,
    benefits: ['플래티넘 배지', '광고 무료 게시 3회', 'VIP 지원'],
  },
];

// 피드 최대 글자 수
export const MAX_FEED_LENGTH = 150;

// 거리 반경 (km)
export const DEFAULT_SEARCH_RADIUS = 5;

// 이미지 최대 크기 (MB)
export const MAX_IMAGE_SIZE_MB = 5;

// 피드 타입
export const FEED_TYPES = {
  RECORD: 'record',
  PRODUCT: 'product',
  GENERAL: 'general',
};

// 에러 메시지
export const ERROR_MESSAGES = {
  INVALID_EMAIL: '유효하지 않은 이메일 형식입니다.',
  WEAK_PASSWORD: '비밀번호는 최소 6자 이상이어야 합니다.',
  NICKNAME_REQUIRED: '닉네임을 입력해주세요.',
  BANNED_WORD_DETECTED: '금지된 단어가 포함되어 있습니다.',
  FEED_TOO_LONG: `피드는 최대 ${MAX_FEED_LENGTH}자까지 작성 가능합니다.`,
  IMAGE_TOO_LARGE: `이미지는 최대 ${MAX_IMAGE_SIZE_MB}MB까지 업로드 가능합니다.`,
  LOCATION_PERMISSION_DENIED: '위치 권한이 거부되었습니다.',
  CAMERA_PERMISSION_DENIED: '카메라 권한이 거부되었습니다.',
};

