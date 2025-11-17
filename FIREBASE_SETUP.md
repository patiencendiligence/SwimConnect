# 🔥 Firebase 설정 가이드

## 문제: "수영장이 표시되지 않음" → Firebase 설정 필요!

SwimConnect 앱은 Firebase Firestore를 데이터베이스로 사용합니다.
수영장 데이터를 보려면 Firebase 프로젝트 설정이 필요합니다.

---

## 📋 1단계: Firebase 프로젝트 만들기

### 1. Firebase Console 접속
👉 https://console.firebase.google.com/

### 2. 새 프로젝트 생성
1. **"프로젝트 추가"** 클릭
2. 프로젝트 이름 입력 (예: `SwimConnect`)
3. Google Analytics 설정 (선택사항)
4. **"프로젝트 만들기"** 클릭

### 3. iOS 앱 추가
1. 프로젝트 설정 > **iOS 아이콘** 클릭
2. **iOS 번들 ID** 입력: `com.swimconnect` (또는 `ios/SwimConnect/Info.plist`에서 확인)
3. **앱 등록** 클릭
4. `GoogleService-Info.plist` 다운로드
5. 파일을 `ios/SwimConnect/` 폴더에 복사

### 4. Android 앱 추가
1. 프로젝트 설정 > **Android 아이콘** 클릭
2. **Android 패키지 이름** 입력: `com.swimconnect` (또는 `android/app/build.gradle`에서 확인)
3. **앱 등록** 클릭
4. `google-services.json` 다운로드
5. 파일을 `android/app/` 폴더에 복사

---

## 📋 2단계: Authentication 활성화

### 1. Firebase Console에서 Authentication 메뉴 선택
### 2. "시작하기" 클릭
### 3. 로그인 방법 설정
   - **이메일/비밀번호** 활성화
   - (선택) Google, Apple 로그인 추가

---

## 📋 3단계: Firestore Database 설정

### 1. Firebase Console에서 Firestore Database 메뉴 선택
### 2. "데이터베이스 만들기" 클릭
### 3. 모드 선택
   - **개발 단계**: "테스트 모드에서 시작" 선택
   - **프로덕션**: "프로덕션 모드에서 시작" 선택 (아래 규칙 설정 필요)

### 4. 위치 선택
   - `asia-northeast3 (Seoul)` 추천

### 5. Firestore 보안 규칙 설정
   - **Rules** 탭 클릭
   - 다음 규칙 입력:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 인증된 사용자만 읽기/쓰기 가능
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // 또는 개발 중에는 모두 허용 (보안 위험!)
    // match /{document=**} {
    //   allow read, write: if true;
    // }
  }
}
```

---

## 📋 4단계: Firebase 설정 파일 생성

### 1. 웹 앱 추가 (설정 정보 가져오기)
1. Firebase Console > 프로젝트 설정 (⚙️ 아이콘)
2. **웹 앱 추가** (</>)
3. 앱 닉네임 입력: `SwimConnect Web`
4. **앱 등록** 클릭
5. **SDK 설정 및 구성** 화면에서 `firebaseConfig` 객체 복사

### 2. 설정 파일 생성
```bash
cd /Users/a20240302/dev/SwimConnect
cp src/firebase.config.example.ts src/firebase.config.ts
```

### 3. 설정 정보 입력
`src/firebase.config.ts` 파일을 열고 복사한 설정 정보 붙여넣기:

```typescript
export const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "swimconnect-xxxxx.firebaseapp.com",
  projectId: "swimconnect-xxxxx",
  storageBucket: "swimconnect-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456",
};
```

---

## 📋 5단계: 앱 재빌드

### iOS
```bash
cd ios
pod install
cd ..
npx react-native run-ios
```

### Android
```bash
npx react-native run-android
```

---

## ✅ 확인 사항

설정이 완료되면 앱을 실행하고 다음을 확인하세요:

### 1. 콘솔 로그 확인
```
📍 샘플 수영장 데이터 초기화 시작...
🔍 수영장 데이터 확인 중...
📝 샘플 수영장 10개 추가 시작...
  1. 올림픽수영장 - 서울특별시 송파구 올림픽로 424
  2. 잠실 실내수영장 - 서울특별시 송파구 올림픽로 240
  ...
🎉 10개의 수영장 데이터가 성공적으로 추가되었습니다!
```

### 2. Firestore Console 확인
1. Firebase Console > Firestore Database
2. `pools` 컬렉션에 **10개의 문서** 확인
3. 각 문서에 `name`, `address`, `latitude` 등의 필드 확인

### 3. 앱에서 확인
1. 앱 실행
2. 하단 탭에서 **"수영장"** 탭 선택
3. **서울 지역 10개 수영장** 목록 표시 확인

---

## 🚨 문제 해결

### 에러 1: "Firebase: No Firebase App '[DEFAULT]'"
**원인**: Firebase가 초기화되지 않음
**해결**:
- `src/firebase.config.ts` 파일이 있는지 확인
- `App.tsx`에서 Firebase 초기화 코드 확인

### 에러 2: "PERMISSION_DENIED: Missing or insufficient permissions"
**원인**: Firestore 보안 규칙 문제
**해결**:
1. Firebase Console > Firestore Database > Rules
2. 규칙을 개발 모드로 변경 (위의 3단계 참조)
3. **게시** 클릭

### 에러 3: "Network request failed"
**원인**: 인터넷 연결 문제 또는 Firebase 설정 오류
**해결**:
- 인터넷 연결 확인
- `google-services.json` (Android) 또는 `GoogleService-Info.plist` (iOS) 파일 위치 확인
- 앱 재빌드

### 에러 4: iOS 빌드 실패
**원인**: CocoaPods 설치 필요
**해결**:
```bash
cd ios
pod install
cd ..
```

---

## 📞 추가 지원

위 단계를 모두 수행했는데도 문제가 해결되지 않는 경우:

1. **Firebase Console에서 프로젝트 ID 확인**
2. **설정 파일 경로 확인**:
   - `src/firebase.config.ts` ✅
   - `ios/SwimConnect/GoogleService-Info.plist` ✅
   - `android/app/google-services.json` ✅

3. **Metro Bundler 재시작**:
```bash
npx react-native start --reset-cache
```

4. **앱 완전 재설치**:
```bash
# iOS
npx react-native run-ios --reset-cache

# Android
cd android
./gradlew clean
cd ..
npx react-native run-android
```

---

## 🎉 설정 완료!

Firebase 설정이 완료되면:
- ✅ 서울 지역 10개 수영장 자동 표시
- ✅ 위치 기반 거리순 정렬
- ✅ 필터링 및 검색 기능
- ✅ 수영장 상세 정보 및 리뷰
- ✅ 즐겨찾기 기능

**Happy Swimming! 🏊‍♂️**

