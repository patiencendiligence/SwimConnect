# SwimConnect - 수영 커뮤니티 앱

## 프로젝트 소개

SwimConnect는 수영을 즐기는 사람들을 위한 소셜 네트워크 앱입니다.

### 주요 기능

1. **위치 기반 수영장 검색**
   - 현재 위치 기반으로 근처 수영장 검색
   - 수영장 정보, 가격, 리뷰 확인
   - 수영장 리뷰 작성 및 평점 등록

2. **사용자 인증**
   - 이메일 기반 회원가입/로그인
   - 닉네임 설정
   - 친구 추가 및 수영 기록 공유

3. **피드 기능**
   - 수영 기록, 수영 용품, 일반 정보 공유
   - 이미지 첨부 (최대 1장)
   - 150자 제한
   - 금지어 필터링 (욕설, 성적 표현, 도배)
   - 좋아요 및 댓글 기능
   - 피드 공유 (링크)

4. **등급 시스템**
   - 수영 기록, 좋아요 수, 피드 작성 수에 따른 등급 산정
   - 5단계 등급 (초보 → 일반 → 숙련 → 전문 → 마스터)
   - 등급별 혜택 제공

5. **향후 계획**
   - 수영 용품 광고 및 강의 광고 게시 (유료)
   - 결제 연동

## 기술 스택

- **React Native**: 0.70.15
- **TypeScript**
- **Firebase**: 인증, Firestore, Storage
- **React Navigation**: 네비게이션
- **React Native Vector Icons**: 아이콘

## 설치 및 실행

### 사전 요구사항

- Node.js 16.0.0+
- Xcode 15.3 (iOS)
- CocoaPods 1.16.2+ (iOS)
- JDK 11+ (Android)

### 설치

\`\`\`bash
# dependencies 설치
npm install --legacy-peer-deps

# iOS CocoaPods 설치
cd ios && pod install && cd ..
\`\`\`

### Firebase 설정

1. Firebase Console에서 새 프로젝트 생성
2. iOS 및 Android 앱 추가
3. 설정 파일 다운로드:
   - iOS: `GoogleService-Info.plist` → `ios/SwimConnect/`
   - Android: `google-services.json` → `android/app/`

### 실행

\`\`\`bash
# iOS
npm run ios

# Android
npm run android
\`\`\`

## 프로젝트 구조

\`\`\`
src/
├── components/       # 재사용 가능한 컴포넌트
├── constants/        # 상수 및 설정
├── contexts/         # React Context (AuthContext 등)
├── navigation/       # 네비게이션 구조
├── screens/          # 화면 컴포넌트
│   ├── Auth/         # 로그인/회원가입
│   ├── Home/         # 홈 화면
│   ├── Pool/         # 수영장 관련
│   ├── Feed/         # 피드 관련
│   └── Profile/      # 프로필 관련
├── services/         # API 및 서비스
│   ├── firestore.ts  # Firestore 데이터베이스
│   ├── location.ts   # 위치 서비스
│   └── image.ts      # 이미지 업로드
├── types/            # TypeScript 타입 정의
└── utils/            # 유틸리티 함수
    ├── validation.ts # 입력 검증
    ├── level.ts      # 등급 계산
    └── distance.ts   # 거리 계산
\`\`\`

## 주요 기능 설명

### 금지어 필터링

피드 및 댓글 작성 시 금지어를 자동으로 감지합니다:
- 욕설
- 성적 표현
- 도배 관련 단어

### 등급 시스템

| 등급 | 이름 | 수영 횟수 | 좋아요 | 피드 수 |
|------|------|----------|--------|---------|
| 1 | 불가사리 | 0 | 0 | 0 |
| 2 | 바다거부기 | 10 | 20 | 5 |
| 3 | 해달이 | 30 | 50 | 15 |
| 4 | 바다사자 | 50 | 100 | 30 |
| 5 | 범고래킹 | 100 | 200 | 50 |

### 위치 기반 검색

- 기본 반경: 5km
- 사용자 현재 위치 기반
- 거리순 정렬

## 라이센스

MIT License

## 문의

프로젝트 관련 문의사항이 있으시면 이슈를 등록해주세요.

