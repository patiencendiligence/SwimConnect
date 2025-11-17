# SwimConnect 프로젝트 구조

## 📱 프로젝트 개요

SwimConnect는 수영을 즐기는 사람들을 위한 소셜 네트워크 앱입니다.

### 기술 스택
- **React Native**: 0.70.15
- **Node.js**: 16.0.0
- **TypeScript**
- **Firebase**: Authentication, Firestore, Storage
- **React Navigation**: 네비게이션 관리
- **Xcode**: 15.3
- **CocoaPods**: 1.16.2

## 📂 프로젝트 구조

```
SwimConnect/
├── android/                    # Android 네이티브 코드
│   ├── app/
│   │   ├── build.gradle       # Firebase 설정 포함
│   │   └── src/main/
│   │       └── AndroidManifest.xml  # 권한 설정
│   └── build.gradle           # Google Services 플러그인
│
├── ios/                        # iOS 네이티브 코드
│   ├── Podfile                # CocoaPods 설정
│   └── SwimConnect/
│       ├── Info.plist         # 권한 설명
│       └── GoogleService-Info.plist  # Firebase 설정 (직접 추가)
│
├── src/                        # 메인 소스 코드
│   ├── components/            # 재사용 가능한 UI 컴포넌트
│   │
│   ├── constants/             # 앱 전체 상수
│   │   └── index.ts          # 금지어, 등급 시스템, 에러 메시지
│   │
│   ├── contexts/              # React Context
│   │   └── AuthContext.tsx   # 인증 상태 관리
│   │
│   ├── navigation/            # 네비게이션 구조
│   │   ├── types.ts          # 네비게이션 타입 정의
│   │   ├── AuthStack.tsx     # 인증 스택
│   │   ├── MainTabs.tsx      # 메인 탭 네비게이션
│   │   ├── PoolStack.tsx     # 수영장 스택
│   │   ├── FeedStack.tsx     # 피드 스택
│   │   ├── ProfileStack.tsx  # 프로필 스택
│   │   └── RootNavigator.tsx # 루트 네비게이터
│   │
│   ├── screens/               # 화면 컴포넌트
│   │   ├── Auth/             # 인증 관련
│   │   │   ├── LoginScreen.tsx
│   │   │   └── SignUpScreen.tsx
│   │   │
│   │   ├── Home/             # 홈 화면
│   │   │   └── HomeScreen.tsx
│   │   │
│   │   ├── Pool/             # 수영장 관련
│   │   │   ├── PoolListScreen.tsx
│   │   │   ├── PoolDetailScreen.tsx
│   │   │   └── PoolReviewScreen.tsx
│   │   │
│   │   ├── Feed/             # 피드 관련
│   │   │   ├── FeedListScreen.tsx
│   │   │   ├── FeedCreateScreen.tsx
│   │   │   ├── FeedDetailScreen.tsx
│   │   │   └── FeedEditScreen.tsx
│   │   │
│   │   └── Profile/          # 프로필 관련
│   │       ├── ProfileMainScreen.tsx
│   │       ├── ProfileEditScreen.tsx
│   │       ├── SwimRecordsScreen.tsx
│   │       ├── FriendsScreen.tsx
│   │       └── SettingsScreen.tsx
│   │
│   ├── services/              # 외부 서비스 연동
│   │   ├── firestore.ts      # Firestore 데이터베이스 CRUD
│   │   ├── location.ts       # 위치 서비스
│   │   └── image.ts          # 이미지 업로드
│   │
│   ├── types/                 # TypeScript 타입 정의
│   │   └── index.ts          # User, Pool, Feed, Review 등
│   │
│   └── utils/                 # 유틸리티 함수
│       ├── validation.ts     # 입력 검증 및 금지어 필터
│       ├── level.ts          # 등급 계산
│       └── distance.ts       # 거리 계산
│
├── App.tsx                    # 앱 진입점
├── index.js                   # React Native 진입점
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript 설정
├── README.md                  # 프로젝트 설명
├── SETUP.md                   # 설정 가이드
└── PROJECT_STRUCTURE.md       # 이 파일

```

## 🔑 주요 기능별 파일

### 1. 인증 시스템
- **Context**: `src/contexts/AuthContext.tsx`
- **Service**: `src/services/firestore.ts` (createUser, getUserData)
- **Screens**: 
  - `src/screens/Auth/LoginScreen.tsx`
  - `src/screens/Auth/SignUpScreen.tsx`
- **Validation**: `src/utils/validation.ts`

### 2. 위치 기반 수영장 검색
- **Screen**: `src/screens/Pool/PoolListScreen.tsx`
- **Service**: `src/services/location.ts`
- **Utils**: `src/utils/distance.ts`
- **Firestore**: `src/services/firestore.ts` (getPools, getPoolById)

### 3. 피드 시스템
- **Screens**:
  - `src/screens/Feed/FeedListScreen.tsx` (목록, 좋아요)
  - `src/screens/Feed/FeedCreateScreen.tsx` (작성, 이미지)
  - `src/screens/Feed/FeedDetailScreen.tsx`
  - `src/screens/Feed/FeedEditScreen.tsx`
- **Services**:
  - `src/services/firestore.ts` (createFeed, getFeeds, toggleLike)
  - `src/services/image.ts` (uploadFeedImage)
- **Validation**: `src/utils/validation.ts` (금지어 필터)

### 4. 등급 시스템
- **Utils**: `src/utils/level.ts`
- **Constants**: `src/constants/index.ts` (LEVELS)
- **Screen**: `src/screens/Profile/ProfileMainScreen.tsx`

### 5. 리뷰 시스템
- **Screen**: `src/screens/Pool/PoolReviewScreen.tsx`
- **Service**: `src/services/firestore.ts` (createReview, getPoolReviews)

## 📊 데이터 구조

### Firestore Collections

1. **users**
   - id (userId)
   - email
   - nickname
   - profileImage
   - level
   - swimRecords[]
   - friends[]
   - createdAt

2. **pools**
   - id
   - name
   - address
   - latitude
   - longitude
   - price
   - rating
   - reviews[]
   - facilities[]
   - images[]

3. **feeds**
   - id
   - userId
   - userName
   - userProfileImage
   - content
   - image
   - type (record | product | general)
   - likes[]
   - comments[]
   - createdAt
   - updatedAt

4. **reviews**
   - id
   - userId
   - poolId
   - rating
   - comment
   - createdAt

5. **friendRequests**
   - id
   - fromUserId
   - toUserId
   - status (pending | accepted | rejected)
   - createdAt

## 🛠️ 개발 팁

### 새로운 화면 추가하기

1. `src/screens/[카테고리]/` 폴더에 화면 컴포넌트 생성
2. 해당 Stack 네비게이터에 화면 추가
3. 타입 정의 업데이트: `src/navigation/types.ts`

### 새로운 서비스 추가하기

1. `src/services/` 폴더에 서비스 파일 생성
2. 필요한 타입을 `src/types/index.ts`에 추가
3. `src/services/firestore.ts`에 CRUD 함수 추가

### 새로운 검증 규칙 추가하기

1. `src/utils/validation.ts`에 검증 함수 추가
2. `src/constants/index.ts`에 관련 상수 추가

## 🚀 배포 전 체크리스트

- [ ] Firebase 프로젝트 설정 완료
- [ ] iOS: `GoogleService-Info.plist` 추가
- [ ] Android: `google-services.json` 추가
- [ ] Firebase Authentication 활성화
- [ ] Firestore Database 생성
- [ ] Firebase Storage 설정
- [ ] Firebase 보안 규칙 설정 (SETUP.md 참조)
- [ ] 앱 아이콘 변경
- [ ] 스플래시 스크린 설정
- [ ] 앱 이름 및 번들 ID 변경
- [ ] 프로덕션 빌드 테스트

## 📱 지원 플랫폼

- iOS 12.4+
- Android API 21+ (Android 5.0 Lollipop)

## 🔐 보안 고려사항

1. **API 키 보호**: Firebase 설정 파일을 .gitignore에 추가
2. **보안 규칙**: Firestore 및 Storage 보안 규칙 설정
3. **데이터 검증**: 클라이언트와 서버 양측에서 검증
4. **금지어 필터**: 부적절한 컨텐츠 차단

## 📈 향후 개발 계획

1. 수영 용품 광고 게시 기능
2. 강의 광고 게시 기능
3. 결제 시스템 연동
4. 푸시 알림
5. 소셜 로그인 (Google, Apple)
6. 오프라인 지원
7. 다크 모드
8. 다국어 지원

## 🐛 알려진 이슈

1. Node.js 16.0.0 버전이 낮아 일부 패키지에서 경고 발생 (동작에는 문제 없음)
2. 일부 placeholder 화면 미구현 (ProfileEdit, SwimRecords, Friends, Settings 등)

## 📝 추가 문서

- **README.md**: 프로젝트 소개 및 기본 정보
- **SETUP.md**: 상세한 설정 가이드 및 트러블슈팅
- **PROJECT_STRUCTURE.md**: 이 문서

