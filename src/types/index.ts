// 사용자 관련 타입
export interface User {
  id: string;
  email: string;
  nickname: string;
  profileImage?: string;
  level: number;
  swimRecords: SwimRecord[];
  friends: string[];
  favoritePoolIds?: string[]; // 즐겨찾기한 수영장 ID 목록
  createdAt: Date;
}

// 수영 기록 타입
export interface SwimRecord {
  id: string;
  userId: string;
  distance: number; // 미터
  duration: number; // 분
  date: Date;
  poolId?: string;
  strokeType?: 'freestyle' | 'backstroke' | 'breaststroke' | 'butterfly' | 'medley'; // 영법
  calories?: number; // 소모 칼로리
  avgPace?: number; // 평균 페이스 (초/100m)
}

// 수영장 시간표 타입
export interface PoolSchedule {
  dayOfWeek: string; // 요일 (예: "월", "화", "수", "목", "금", "토", "일")
  freeSwim?: string[]; // 자유수영 시간 (예: ["06:00-08:00", "12:00-14:00"])
  lessons?: string[]; // 강습 시간 (예: ["09:00-10:00", "19:00-20:00"])
  closedDay?: boolean; // 휴무일 여부
}

// 수영장 타입
export interface Pool {
  id: string;
  name: string;
  address: string;
  city: string; // 시
  district: string; // 구
  latitude: number;
  longitude: number;
  price?: number;
  rating: number;
  reviews: Review[];
  facilities: string[];
  images?: string[];
  poolType: 'sports_center' | 'youth_center' | 'public_pool' | 'hotel' | 'fitness' | 'other'; // 수영장 타입
  lanes: number; // 레인 수
  depth: string; // 수심 (예: "1.2m ~ 1.8m")
  temperature?: number; // 수온
  kickboardAvailable: boolean; // 킥판 사용 가능 여부
  operatingHours?: string; // 운영 시간 (간략히)
  phoneNumber?: string; // 전화번호
  schedule?: PoolSchedule[]; // 상세 시간표
}

// 리뷰 타입
export interface Review {
  id: string;
  userId: string;
  userName: string;
  userProfileImage?: string;
  poolId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  // 세부 평가 항목 (블로그 리뷰 참고)
  ratings: {
    facilities: number; // 시설 (샤워실 등)
    waterQuality: number; // 수질
    instructor?: number; // 강습 (선택)
    cleanliness: number; // 청결도
    accessibility: number; // 접근성
  };
  images?: string[]; // 리뷰 이미지
  helpful: string[]; // 도움됨을 누른 사용자 ID 목록
}

// 피드 타입
export interface Feed {
  id: string;
  userId: string;
  userName: string;
  userProfileImage?: string;
  content: string;
  image?: string;
  type: 'record' | 'product' | 'general';
  likes: string[];
  comments: Comment[];
  createdAt: Date;
  updatedAt?: Date;
}

// 댓글 타입
export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: Date;
}

// 등급 타입
export interface Level {
  level?: number;
  name?: string;
  minSwimCount?: number;
  minLikeCount?: number;
  minFeedCount?: number;
  benefits?: string[];
}

// 친구 요청 타입
export interface FriendRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

