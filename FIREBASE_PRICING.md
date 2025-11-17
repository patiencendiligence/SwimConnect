# 💰 Firebase 요금제 안내

## 🎁 완전 무료! (Spark 플랜)

SwimConnect 앱은 **Firebase Spark 플랜(무료)**으로 개발 및 운영 가능합니다.

### ✅ 무료 제공 내용

| 서비스 | 무료 한도 | SwimConnect 사용량 |
|--------|----------|-------------------|
| **Authentication** | 무제한 | ✅ 충분 |
| **Firestore 저장** | 1GB | ✅ 충분 (사용자 1만명까지) |
| **Firestore 읽기** | 5만건/일 | ✅ 충분 (일 5천명 활동) |
| **Firestore 쓰기** | 2만건/일 | ✅ 충분 |
| **Storage 저장** | 5GB | ✅ 충분 (이미지 5천장) |
| **Storage 다운로드** | 1GB/월 | ⚠️ 주의 필요 |

### 📊 예상 사용량 계산

#### 시나리오 1: 초기 사용자 100명
```
월 비용: 0원 ✅

- 사용자: 100명
- 일일 활동 사용자: 30명
- Firestore 읽기: 일 1,000건 (무료 한도: 50,000건)
- Firestore 쓰기: 일 300건 (무료 한도: 20,000건)
- Storage: 500MB (무료 한도: 5GB)
- Storage 다운로드: 300MB/월 (무료 한도: 1GB)
```

#### 시나리오 2: 성장기 사용자 1,000명
```
월 비용: 0~1달러 ✅

- 사용자: 1,000명
- 일일 활동 사용자: 300명
- Firestore 읽기: 일 10,000건 (무료 범위)
- Firestore 쓰기: 일 3,000건 (무료 범위)
- Storage: 3GB (무료 범위)
- Storage 다운로드: 1~2GB/월 (약간 초과 가능)
```

#### 시나리오 3: 인기 앱 사용자 10,000명
```
월 비용: 5~15달러 추정

- 사용자: 10,000명
- 일일 활동 사용자: 3,000명
- Firestore 읽기: 일 100,000건 (초과 50,000건)
- Firestore 쓰기: 일 30,000건 (초과 10,000건)
- Storage: 15GB (초과 10GB)
- Storage 다운로드: 5GB/월 (초과 4GB)

→ 이 정도면 광고/유료 기능으로 수익 창출 가능!
```

## 💳 Blaze 플랜 (종량제)

무료 한도 초과 시 자동으로 과금되는 플랜

### 초과 비용
- **Firestore 읽기**: 10만건당 $0.06 (약 80원)
- **Firestore 쓰기**: 10만건당 $0.18 (약 240원)
- **Storage 저장**: 1GB당 $0.026/월 (약 35원)
- **Storage 다운로드**: 1GB당 $0.12 (약 160원)

### 예산 한도 설정
Firebase Console에서 **예산 알림** 설정 가능:
1. Firebase Console → ⚙️ 설정
2. "사용량 및 결제"
3. "예산 알림" 설정
   - 예: 월 5달러 초과 시 이메일 알림

## 🎯 비용 절감 팁

### 1. 이미지 최적화
```typescript
// src/services/image.ts 수정
import { launchImageLibrary } from 'react-native-image-picker';

export const pickImageFromLibrary = async () => {
  const result = await launchImageLibrary({
    mediaType: 'photo',
    maxWidth: 800,        // 작게 조정
    maxHeight: 800,       // 작게 조정
    quality: 0.6,         // 압축률 높임 (0.8 → 0.6)
  });
  // 용량: 1MB → 150KB로 감소! 💰
};
```

### 2. 캐싱 전략
```typescript
// 로컬 캐시 사용
import AsyncStorage from '@react-native-async-storage/async-storage';

// 피드 캐싱
const cachedFeeds = await AsyncStorage.getItem('feeds');
if (cachedFeeds) {
  setFeeds(JSON.parse(cachedFeeds));
}

// Firestore 읽기 최소화 ✅
```

### 3. 페이지네이션
```typescript
// 한 번에 20개씩만 로드
const feeds = await getFeeds(20); // 전체 로드 대신
```

### 4. 이미지 리사이징
```typescript
// Thumbnail 생성
// 목록: 200x200 썸네일 사용
// 상세: 원본 이미지 사용
// → Storage 다운로드 90% 감소! 💰
```

### 5. 오프라인 캐시
```typescript
// Firestore 오프라인 지속성 활성화
firestore().settings({
  persistence: true, // 자동 캐싱 ✅
});
```

## 🚀 수익 모델 (향후)

무료 한도를 초과하기 시작하면 수익 창출 고려:

1. **광고 (앱 내 배너)**
   - 예상 수익: 사용자 1만명 기준 월 50~200달러
   - Firebase 비용 커버 가능 ✅

2. **유료 기능**
   - 프리미엄 회원: 월 2,900원
   - 광고 게시: 건당 10,000원
   - 예상 수익: 월 100~500달러

3. **제휴 마케팅**
   - 수영 용품 판매 수수료
   - 수영장 제휴 수수료

## 📈 비용 모니터링

### Firebase Console 확인
1. Firebase Console 로그인
2. 프로젝트 선택
3. ⚙️ 설정 → "사용량 및 결제"
4. 실시간 사용량 확인 ✅

### 알림 설정
```
예산 알림 설정 예시:
- 월 1달러 도달 시: 이메일 알림
- 월 5달러 도달 시: 이메일 알림
- 월 10달러 도달 시: SMS 알림
```

## ✅ 결론

**개발 및 초기 운영: 완전 무료 ✅**
- 사용자 1,000명까지: 0원
- 사용자 10,000명까지: 월 5~15달러
- 수익 창출 후에는 비용 문제 없음!

**추천 전략:**
1. Spark 플랜(무료)으로 시작
2. 사용자 5,000명 도달 시 Blaze 플랜으로 전환
3. 동시에 광고/유료 기능 도입
4. 비용 < 수익 달성! 🎉

Firebase는 **스타트업에 매우 친화적**입니다! 💪

