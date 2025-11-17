# 피드 등록 문제 해결 가이드

## 가능한 원인들

### 1. Firestore 보안 규칙 문제 (가장 가능성 높음)
Firebase Console에서 Firestore 보안 규칙이 쓰기를 막고 있을 수 있습니다.

**해결 방법:**
1. Firebase Console 접속: https://console.firebase.google.com/
2. 프로젝트 선택
3. Firestore Database 메뉴로 이동
4. "규칙" 탭 클릭
5. 임시로 테스트 모드로 변경:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;  // 임시 테스트용 (보안 위험!)
    }
  }
}
```

**주의:** 위 규칙은 누구나 읽고 쓸 수 있으므로 테스트 후 반드시 변경하세요!

**프로덕션 규칙 (나중에 적용):**
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 사용자는 자신의 데이터만 읽고 쓸 수 있음
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // 인증된 사용자만 피드 작성 가능
    match /feeds/{feedId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
                               resource.data.userId == request.auth.uid;
    }
    
    // 수영장 정보는 모두 읽기 가능, 관리자만 쓰기
    match /pools/{poolId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 2. 사용자 인증 문제
로그인이 제대로 되지 않았을 수 있습니다.

**확인 방법:**
- 로그인 화면에서 다시 로그인
- AuthContext에서 user 객체가 제대로 로드되는지 확인

### 3. 네트워크 연결 문제
에뮬레이터가 인터넷에 연결되어 있는지 확인

### 4. Firebase 초기화 문제
google-services.json이 올바른 프로젝트의 것인지 확인

## 에러 확인 방법

1. **Metro Bundler 로그 확인:**
```bash
cd /Users/a20240302/dev/SwimConnect
npm start
```

2. **Android 로그 확인:**
```bash
npx react-native log-android
```

3. **Chrome DevTools 사용:**
- Chrome에서 `chrome://inspect` 접속
- "Inspect" 클릭하여 Console 확인

## 테스트 순서

1. ✅ Firebase 설정 파일 존재 확인 (완료)
2. ⏳ Firestore 보안 규칙 확인 (필요)
3. ⏳ 사용자 로그인 상태 확인 (필요)
4. ⏳ 실제 에러 메시지 확인 (필요)

## 빠른 해결

**가장 빠른 해결 방법:**
1. Firebase Console에서 Firestore 규칙을 테스트 모드로 변경
2. 앱 다시 실행
3. 피드 등록 시도
4. 작동하면 규칙 문제였던 것 → 프로덕션 규칙으로 변경
5. 작동하지 않으면 로그 확인

