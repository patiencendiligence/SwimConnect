# SwimConnect 앱 설정 가이드

## Firebase 설정 (필수)

Firebase를 사용하기 위해 다음 단계를 따라주세요:

### 1. Firebase 프로젝트 생성

1. [Firebase Console](https://console.firebase.google.com/)에 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름: "SwimConnect" (또는 원하는 이름)
4. Google Analytics 설정 (선택 사항)

### 2. iOS 앱 추가

1. Firebase 프로젝트 설정에서 "iOS 앱 추가" 클릭
2. 번들 ID 입력: `org.reactjs.native.example.SwimConnect`
   - Xcode에서 확인 가능: `ios/SwimConnect.xcworkspace` 열기 → 프로젝트 설정
3. `GoogleService-Info.plist` 다운로드
4. 파일을 `ios/SwimConnect/` 폴더에 복사
5. Xcode에서 프로젝트에 추가:
   - Xcode에서 SwimConnect 프로젝트 열기
   - `GoogleService-Info.plist` 파일을 SwimConnect 폴더로 드래그
   - "Copy items if needed" 체크

### 3. Android 앱 추가

1. Firebase 프로젝트 설정에서 "Android 앱 추가" 클릭
2. 패키지 이름 입력: `com.swimconnect`
3. `google-services.json` 다운로드
4. 파일을 `android/app/` 폴더에 복사

### 4. Firebase Authentication 활성화

1. Firebase Console에서 "Authentication" 선택
2. "시작하기" 클릭
3. "Sign-in method" 탭에서 "이메일/비밀번호" 활성화

### 5. Firestore Database 생성

1. Firebase Console에서 "Firestore Database" 선택
2. "데이터베이스 만들기" 클릭
3. 보안 규칙:
   - 테스트 모드로 시작 (개발 중)
   - 나중에 프로덕션 모드로 변경

### 6. Firebase Storage 설정

1. Firebase Console에서 "Storage" 선택
2. "시작하기" 클릭
3. 보안 규칙:
   - 테스트 모드로 시작 (개발 중)

## 개발 환경 설정

### iOS 개발

1. Xcode 15.3 이상 설치
2. CocoaPods 설치:
   \`\`\`bash
   sudo gem install cocoapods
   \`\`\`

3. iOS dependencies 설치:
   \`\`\`bash
   cd ios
   export LANG=en_US.UTF-8
   pod install
   cd ..
   \`\`\`

### Android 개발

1. Android Studio 설치
2. JDK 11 이상 설치
3. Android SDK 설치:
   - SDK Platform 31
   - Android SDK Build-Tools

### Node.js 및 npm

- Node.js 16.0.0 이상 필요
- npm 7.10.0 이상 필요

## 앱 실행

### iOS

\`\`\`bash
# Metro Bundler 시작
npm start

# 새 터미널에서
npm run ios
\`\`\`

또는 Xcode에서 직접 실행:
\`\`\`bash
open ios/SwimConnect.xcworkspace
\`\`\`

### Android

\`\`\`bash
# Metro Bundler 시작
npm start

# 새 터미널에서
npm run android
\`\`\`

## 트러블슈팅

### iOS

#### CocoaPods 오류
\`\`\`bash
cd ios
rm -rf Pods Podfile.lock
export LANG=en_US.UTF-8
pod install
cd ..
\`\`\`

#### Xcode 빌드 오류
1. Xcode에서 Product → Clean Build Folder
2. `ios/build` 폴더 삭제
3. 다시 빌드

### Android

#### Gradle 오류
\`\`\`bash
cd android
./gradlew clean
cd ..
\`\`\`

#### Firebase 관련 오류
- `google-services.json` 파일이 `android/app/` 폴더에 있는지 확인
- 패키지 이름이 일치하는지 확인

### 공통

#### Metro Bundler 캐시 삭제
\`\`\`bash
npm start -- --reset-cache
\`\`\`

#### node_modules 재설치
\`\`\`bash
rm -rf node_modules
npm install --legacy-peer-deps
\`\`\`

## Firebase 보안 규칙 (프로덕션용)

### Firestore Rules

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Pools collection
    match /pools/{poolId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Feeds collection
    match /feeds/{feedId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
                               resource.data.userId == request.auth.uid;
    }
    
    // Reviews collection
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
                               resource.data.userId == request.auth.uid;
    }
    
    // Friend requests collection
    match /friendRequests/{requestId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
    }
  }
}
\`\`\`

### Storage Rules

\`\`\`javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /feeds/{feedId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /pools/{poolId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
\`\`\`

## 다음 단계

1. Firebase 설정 완료
2. 앱 실행 및 테스트
3. 테스트 사용자 계정 생성
4. 기능 테스트:
   - 회원가입/로그인
   - 수영장 검색
   - 피드 작성
   - 프로필 관리

## 도움이 필요하신가요?

프로젝트 관련 문제가 있으시면 GitHub Issues에 등록해주세요.

