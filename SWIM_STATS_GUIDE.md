# 수영 기록 통계 기능 가이드 🏊‍♂️

## ✅ 완료된 기능

### 1. 홈 화면 - 이번 달 통계 요약

**위치**: 하단 탭 > 홈

**표시되는 정보**:
- 📊 **4가지 주요 지표**
  - 총 거리 (km/m)
  - 총 시간 (시간/분)
  - 수영 횟수
  - 소모 칼로리

- 🏊 **주로 하는 영법 TOP 3**
  - 각 영법별 프로그레스 바
  - 퍼센트 표시
  - 자유형, 배영, 평영, 접영, 혼영

**조건**: 
- `user.swimRecords` 배열에 데이터가 있어야 표시됨
- 이번 달 데이터가 없으면 통계 섹션이 숨겨짐

---

### 2. 수영 기록 대시보드 (전체 화면)

**위치**: 하단 탭 > 프로필 > 내 수영 기록

**주요 기능**:

#### 📅 기간 선택
- **주간**: 최근 7일 데이터
- **월간**: 이번 달 데이터 (기본값)
- **전체**: 전체 기간 데이터

#### 📊 주요 통계 카드 (4개)
- 🌊 총 거리
- ⏱️ 총 시간
- 🏋️ 수영 횟수
- 🔥 칼로리

#### 🏊 영법별 상세 분석
각 영법마다:
- 영법 이름 (자유형, 배영, 평영, 접영, 혼영)
- 퍼센트 (전체 거리 대비)
- 프로그레스 바 (색상별 구분)
- 총 거리
- 수영 횟수

**영법별 색상**:
- 자유형: 파란색 (#007AFF)
- 배영: 초록색 (#34C759)
- 평영: 주황색 (#FF9500)
- 접영: 빨간색 (#FF3B30)
- 혼영: 보라색 (#AF52DE)

#### 📈 월별 추이 (전체 모드)
최근 6개월 데이터:
- 월별로 표시 (2024-11 형식)
- 거리, 시간, 횟수
- 카드 형태로 나열

#### ⌚ Apple Watch 연동 안내
- 건강 데이터 연동 버튼
- 안내 문구
- (추후 구현 예정)

---

## 🔧 데이터 구조

### SwimRecord 타입
```typescript
interface SwimRecord {
  id: string;
  userId: string;
  distance: number;              // 미터
  duration: number;              // 분
  date: Date;
  poolId?: string;
  strokeType?: 'freestyle' | 'backstroke' | 'breaststroke' | 'butterfly' | 'medley';
  calories?: number;             // 소모 칼로리
  avgPace?: number;             // 평균 페이스 (초/100m)
}
```

### 샘플 데이터 예시
```typescript
const sampleRecords: SwimRecord[] = [
  {
    id: '1',
    userId: 'user123',
    distance: 1000,              // 1km
    duration: 30,                // 30분
    date: new Date('2024-11-01'),
    strokeType: 'freestyle',
    calories: 300,
    avgPace: 180,               // 3분/100m
  },
  {
    id: '2',
    userId: 'user123',
    distance: 500,
    duration: 20,
    date: new Date('2024-11-03'),
    strokeType: 'backstroke',
    calories: 150,
  },
  // ... more records
];
```

---

## 📱 사용 흐름

### 홈 화면에서 확인하기
1. 앱 실행
2. 하단 탭 > **홈** (이미 홈 화면)
3. 스크롤하여 **"이번 달 수영 기록"** 섹션 확인
4. 총 거리, 시간, 횟수, 칼로리 확인
5. 주로 하는 영법 TOP 3 확인

### 상세 분석 보기
1. 하단 탭 > **프로필**
2. **"내 수영 기록"** 클릭
3. 기간 선택 (주간/월간/전체)
4. 영법별 분석 확인
5. 월별 추이 확인 (전체 모드)

---

## 🎨 유틸리티 함수

### src/utils/swimStats.ts

**월별 통계 계산**
```typescript
calculateMonthlyStats(records: SwimRecord[]): MonthlyStats[]
```

**영법별 통계 계산**
```typescript
calculateStrokeStats(records: SwimRecord[]): StrokeStats[]
```

**주간 통계 계산 (최근 7일)**
```typescript
calculateWeeklyStats(records: SwimRecord[]): WeeklyStats
```

**이번 달 통계 가져오기**
```typescript
getCurrentMonthStats(records: SwimRecord[]): MonthlyStats | null
```

**포맷팅 함수**
```typescript
formatDistance(meters: number): string  // "1.5km" or "500m"
formatDuration(minutes: number): string // "1시간 30분" or "45분"
formatPace(secondsPer100m: number): string // "2:30/100m"
```

---

## 🚀 테스트 방법

### 1. 샘플 데이터로 테스트

User 객체에 swimRecords 추가:
```typescript
const testUser = {
  id: 'test123',
  email: 'test@example.com',
  nickname: '테스트',
  level: 1,
  friends: [],
  createdAt: new Date(),
  swimRecords: [
    {
      id: '1',
      userId: 'test123',
      distance: 1500,
      duration: 45,
      date: new Date(),
      strokeType: 'freestyle',
      calories: 450,
    },
    {
      id: '2',
      userId: 'test123',
      distance: 1000,
      duration: 30,
      date: new Date(),
      strokeType: 'backstroke',
      calories: 300,
    },
    {
      id: '3',
      userId: 'test123',
      distance: 800,
      duration: 25,
      date: new Date(),
      strokeType: 'breaststroke',
      calories: 240,
    },
  ],
};
```

### 2. 확인 사항
- ✅ 홈 화면에 "이번 달 수영 기록" 섹션이 표시되는지
- ✅ 4가지 통계 (거리, 시간, 횟수, 칼로리)가 올바른지
- ✅ 영법별 프로그레스 바가 표시되는지
- ✅ 프로필 > 내 수영 기록 화면이 작동하는지
- ✅ 주간/월간/전체 전환이 작동하는지
- ✅ 영법별 분석이 표시되는지
- ✅ 월별 추이 (전체 모드)가 표시되는지

---

## 🎯 데이터가 없을 때

**홈 화면**:
- "이번 달 수영 기록" 섹션 자체가 표시되지 않음
- 다른 섹션은 정상 표시

**수영 기록 대시보드**:
- 주요 통계: 모두 0으로 표시
- 영법별 분석: 섹션 숨김
- 월별 추이: 섹션 숨김
- Apple Watch 연동 안내는 항상 표시

---

## 🔜 향후 개선 사항

1. **Apple Health 연동**
   - `react-native-health` 라이브러리 사용
   - 자동 수영 기록 동기화
   - 수영 운동 타입 인식

2. **수영 기록 수동 입력**
   - 날짜, 시간, 거리 입력
   - 영법 선택
   - 수영장 선택

3. **목표 설정**
   - 월간 거리 목표
   - 주간 횟수 목표
   - 목표 달성률 표시

4. **차트 시각화**
   - React Native Chart 라이브러리
   - 선 그래프 (거리/시간 추이)
   - 막대 그래프 (영법별 비교)
   - 도넛 차트 (영법 비율)

5. **소셜 기능**
   - 친구와 기록 비교
   - 리더보드
   - 챌린지 시스템

---

**작성일**: 2024년 11월 5일
**버전**: 1.0.0
**상태**: ✅ 완료 및 적용됨

