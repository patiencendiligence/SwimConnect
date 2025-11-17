# 📸 Base64 이미지 저장 방식 가이드

## ✅ 설정 완료!

Firebase Storage 없이 **Base64 방식**으로 이미지를 Firestore에 저장하도록 구성되었습니다.

### 장점
- ✅ **완전 무료** (카드 등록 불필요)
- ✅ Firebase Storage 설정 불필요
- ✅ 구조가 단순함
- ✅ 이미지와 데이터가 함께 저장됨

### 제약사항
- ⚠️ Firestore 문서 크기 제한: **1MB**
- ⚠️ 이미지 크기: **800x800 이하** 권장
- ⚠️ 압축률: **0.5** (quality 50%)
- ⚠️ 결과 크기: **150~300KB**

## 🔧 적용된 변경사항

### 1. 이미지 처리 방식
```typescript
// 기존: Firebase Storage 업로드
const imageUrl = await uploadImage(uri, path);

// 변경: Base64 변환
const base64 = await convertImageToBase64(uri);
// 결과: "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
```

### 2. 이미지 크기 제한
```typescript
// 자동으로 적용됨:
maxWidth: 800px
maxHeight: 800px
quality: 0.5 (50% 압축)
```

### 3. 크기 검증
```typescript
// 800KB 이하만 허용
if (base64.length > 800KB) {
  Alert: "이미지가 너무 큽니다"
}
```

## 📊 예상 저장 공간

### Firestore 무료 할당량
```
저장 공간: 1GB
읽기: 50,000건/일
쓰기: 20,000건/일
```

### SwimConnect 사용량 예상
```
사용자 1,000명 기준:

1. 프로필 사진
   - 1,000장 × 200KB = 200MB ✅

2. 피드 이미지 (월 3,000개)
   - 3,000장 × 200KB = 600MB ✅

3. 기타 데이터
   - 사용자/피드/리뷰 등: ~100MB

총 사용량: ~900MB / 1GB ✅ 충분!
```

## 🚀 사용 방법

### 1. 기본 설치 (이미 완료됨)
```bash
cd /Users/a20240302/dev/SwimConnect
npm install react-native-fs@2.20.0 --legacy-peer-deps
cd ios && pod install && cd ..
```

### 2. Firebase 설정
```
✅ Authentication 활성화 (이메일/비밀번호)
✅ Firestore Database 생성 (테스트 모드)
❌ Storage 설정 불필요!
```

### 3. 앱 실행
```bash
# iOS
npm run ios

# Android
npm run android
```

### 4. 이미지 업로드 테스트
```
1. 회원가입 후 로그인
2. 피드 작성 화면 이동
3. 이미지 추가 버튼 클릭
4. 갤러리에서 사진 선택 또는 카메라 촬영
5. 자동으로 Base64 변환 및 크기 검증
6. 피드 등록 → Firestore에 저장 ✅
```

## 🔍 확인 방법

### Firebase Console에서 확인
```
1. Firestore Database 열기
2. feeds 컬렉션 선택
3. 문서 클릭
4. image 필드 확인
   → "data:image/jpeg;base64,..." 형식으로 저장됨 ✅
```

## ⚠️ 주의사항

### 1. 이미지가 너무 큰 경우
```
에러: "이미지가 너무 큽니다"

해결:
- 더 작은 이미지 선택
- 스크린샷 대신 카메라 직접 촬영
- 이미지 편집 앱으로 미리 축소
```

### 2. 업로드 실패
```
에러: "피드 등록에 실패했습니다"

확인:
- Firestore 설정 완료 여부
- 인터넷 연결 상태
- Firebase 콘솔에서 Firestore 규칙 확인
```

### 3. 이미지가 표시되지 않음
```
확인:
- Base64 문자열이 "data:image/jpeg;base64," 로 시작하는지
- Image 컴포넌트의 source={{ uri: base64String }}
```

## 💡 최적화 팁

### 1. 이미지 압축률 조정
```typescript
// src/services/image.ts

// 더 작게 (파일 크기 작음, 품질 낮음)
quality: 0.4

// 더 크게 (파일 크기 큼, 품질 높음)
quality: 0.7

// 권장 (균형)
quality: 0.5 ✅
```

### 2. 이미지 크기 조정
```typescript
// 더 작게
maxWidth: 600
maxHeight: 600

// 더 크게 (주의: 파일 크기 증가)
maxWidth: 1024
maxHeight: 1024

// 권장
maxWidth: 800 ✅
maxHeight: 800 ✅
```

### 3. 썸네일 생성 (향후)
```typescript
// 목록용 작은 이미지
const thumbnail = await resizeImage(base64, 200, 200);

// 상세보기용 원본
const fullImage = base64;
```

## 📈 성능 비교

### Firebase Storage vs Base64

| 항목 | Storage | Base64 |
|------|---------|--------|
| 비용 | Blaze 플랜 필요 | 무료 ✅ |
| 이미지 크기 | 제한 없음 | 800KB 이하 |
| 속도 | 빠름 | 보통 |
| 캐싱 | 자동 | 수동 필요 |
| 설정 | 복잡 | 간단 ✅ |

### 언제 Storage로 전환?
```
다음 경우 Firebase Storage 고려:

1. 사용자 5,000명 이상
2. 고해상도 이미지 필요
3. 비디오 업로드 필요
4. 수익 모델 확립

→ 그 전까지는 Base64로 충분! ✅
```

## 🎯 다음 단계

### 개발 단계
1. ✅ Base64 방식 구현 완료
2. Firebase Authentication 설정
3. Firestore Database 생성
4. 앱 실행 및 테스트

### 배포 전
1. Firestore 보안 규칙 설정
2. 이미지 최적화 확인
3. 성능 테스트

### 향후 고도화
1. 이미지 캐싱 구현
2. 썸네일 생성
3. 오프라인 지원
4. (필요시) Storage로 마이그레이션

## 💬 FAQ

**Q: Base64는 안전한가요?**
A: 네! Firebase Firestore는 암호화되어 있어 안전합니다.

**Q: 성능 문제는 없나요?**
A: 이미지가 작아서 (200KB) 성능 문제 없습니다.

**Q: 나중에 Storage로 변경 가능한가요?**
A: 네! 언제든지 마이그레이션 가능합니다.

**Q: 비용이 정말 0원인가요?**
A: 네! 사용자 1,000명까지 완전 무료입니다. ✅

## 🎉 완료!

이제 **카드 등록 없이** 완전 무료로 SwimConnect를 개발할 수 있습니다!

Firebase 설정만 완료하면 바로 사용 가능합니다:
1. Authentication (이메일/비밀번호)
2. Firestore Database (테스트 모드)

Storage는 필요 없습니다! 🚀

