# 🔥 Firebase 빠른 설정 가이드

## ✅ 체크리스트

### 1. Firebase 프로젝트 생성
- [ ] https://console.firebase.google.com/ 접속
- [ ] "프로젝트 추가" → 이름: `SwimConnect`

### 2. iOS 앱 추가
- [ ] Firebase Console → "iOS 앱 추가"
- [ ] 번들 ID: `org.reactjs.native.example.SwimConnect`
- [ ] `GoogleService-Info.plist` 다운로드
- [ ] 파일 복사:
```bash
cp ~/Downloads/GoogleService-Info.plist /Users/a20240302/dev/SwimConnect/ios/SwimConnect/
```
- [ ] Xcode에서 프로젝트에 추가:
```bash
open /Users/a20240302/dev/SwimConnect/ios/SwimConnect.xcworkspace
```
  → `GoogleService-Info.plist` 드래그하여 추가 (Copy items 체크)

### 3. Android 앱 추가
- [ ] Firebase Console → "Android 앱 추가"
- [ ] 패키지 이름: `com.swimconnect`
- [ ] `google-services.json` 다운로드
- [ ] 파일 복사:
```bash
cp ~/Downloads/google-services.json /Users/a20240302/dev/SwimConnect/android/app/
```

### 4. Firebase 서비스 활성화

#### Authentication
- [ ] Firebase Console → "Authentication" → "시작하기"
- [ ] "Sign-in method" → "이메일/비밀번호" **사용 설정**

#### Firestore Database
- [ ] Firebase Console → "Firestore Database" → "데이터베이스 만들기"
- [ ] **테스트 모드** 선택
- [ ] 위치: `asia-northeast3 (Seoul)`

#### Storage
- [ ] Firebase Console → "Storage" → "시작하기"
- [ ] **테스트 모드** 선택

### 5. 앱 실행

#### iOS
```bash
cd /Users/a20240302/dev/SwimConnect
npm start
# 새 터미널에서
npm run ios
```

#### Android
```bash
cd /Users/a20240302/dev/SwimConnect
npm start
# 새 터미널에서
npm run android
```

## 🧪 테스트

1. **회원가입 테스트**
   - 앱 실행
   - "회원가입" 클릭
   - 이메일, 닉네임, 비밀번호 입력
   - 가입 성공 확인

2. **Firebase Console 확인**
   - Authentication → Users 탭에서 사용자 확인
   - Firestore → users 컬렉션에서 데이터 확인

## ⚠️ 문제 해결

### iOS: GoogleService-Info.plist를 찾을 수 없음
```bash
# 파일 위치 확인
ls -la /Users/a20240302/dev/SwimConnect/ios/SwimConnect/GoogleService-Info.plist

# 없으면 다시 복사
cp ~/Downloads/GoogleService-Info.plist /Users/a20240302/dev/SwimConnect/ios/SwimConnect/
```

### Android: google-services.json을 찾을 수 없음
```bash
# 파일 위치 확인
ls -la /Users/a20240302/dev/SwimConnect/android/app/google-services.json

# 없으면 다시 복사
cp ~/Downloads/google-services.json /Users/a20240302/dev/SwimConnect/android/app/
```

### Firebase 초기화 오류
- Firebase Console에서 모든 서비스(Auth, Firestore, Storage)가 활성화되어 있는지 확인
- 앱을 완전히 종료하고 다시 실행

### 빌드 오류
```bash
# iOS - 캐시 삭제 및 재설치
cd /Users/a20240302/dev/SwimConnect/ios
rm -rf Pods Podfile.lock
export LANG=en_US.UTF-8
pod install
cd ..

# Android - clean build
cd /Users/a20240302/dev/SwimConnect/android
./gradlew clean
cd ..

# Metro 캐시 삭제
npm start -- --reset-cache
```

## 📝 다음 단계

1. ✅ Firebase 설정 완료
2. 테스트 계정 생성
3. 수영장 데이터 추가 (Firestore)
4. 앱 기능 테스트

## 🎯 수영장 샘플 데이터 추가

Firebase Console → Firestore Database에서 수동으로 추가:

**컬렉션**: `pools`

**문서 1**:
```json
{
  "name": "서울시립 잠실수영장",
  "address": "서울시 송파구 올림픽로 25",
  "latitude": 37.5142,
  "longitude": 127.0733,
  "price": 5000,
  "rating": 4.5,
  "reviews": [],
  "facilities": ["샤워실", "락커", "주차장"],
  "images": []
}
```

**문서 2**:
```json
{
  "name": "강남구민체육센터",
  "address": "서울시 강남구 학동로 426",
  "latitude": 37.5172,
  "longitude": 127.0286,
  "price": 3000,
  "rating": 4.2,
  "reviews": [],
  "facilities": ["샤워실", "락커", "사우나"],
  "images": []
}
```

이제 앱에서 위치 기반으로 수영장을 검색할 수 있습니다! 🏊‍♂️

