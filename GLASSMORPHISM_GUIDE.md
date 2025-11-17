# Glassmorphism 디자인 적용 가이드

## 이미 적용된 화면들

✅ **Feed 화면들**
- FeedListScreen
- FeedDetailScreen
- FeedCreateScreen

✅ **HomeScreen**

## Glassmorphism 스타일 사용 방법

### 1. Import 추가
```typescript
import { glassStyles } from '../../styles/glassmorphism';
```

### 2. 배경색 변경
```typescript
container: {
  flex: 1,
  backgroundColor: '#E3F2FD', // 그라데이션 배경 효과
},
```

### 3. 카드/컨테이너에 Glassmorphism 적용

#### 기본 글래스 카드
```typescript
cardStyle: {
  backgroundColor: 'rgba(255, 255, 255, 0.75)',
  borderRadius: 16,
  borderWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.3)',
shadowColor: '#9898985e',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.15,
  shadowRadius: 12,
  elevation: 5,
},
```

#### 강한 글래스 효과 (더 불투명)
```typescript
cardStrongStyle: {
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  borderRadius: 16,
  borderWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.5)',
shadowColor: '#9898985e',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.2,
  shadowRadius: 16,
  elevation: 8,
},
```

#### 약한 글래스 효과 (더 투명)
```typescript
cardLightStyle: {
  backgroundColor: 'rgba(255, 255, 255, 0.55)',
  borderRadius: 12,
  borderWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.2)',
shadowColor: '#9898985e',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 8,
  elevation: 3,
},
```

### 4. 버튼에 Glassmorphism 적용

#### 주요 액션 버튼
```typescript
buttonStyle: {
  backgroundColor: 'rgba(0, 122, 255, 0.9)',
  borderWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.4)',
  borderRadius: 12,
  padding: 15,
  shadowColor: '#007AFF',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  elevation: 5,
},
```

#### 비활성 버튼
```typescript
buttonDisabledStyle: {
  backgroundColor: 'rgba(204, 204, 204, 0.7)',
  borderColor: 'rgba(255, 255, 255, 0.3)',
  shadowOpacity: 0.1,
},
```

### 5. 입력창에 Glassmorphism 적용
```typescript
inputStyle: {
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  borderWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.4)',
  borderRadius: 12,
  padding: 15,
shadowColor: '#9898985e',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.05,
  shadowRadius: 4,
  elevation: 2,
},
```

### 6. 헤더에 Glassmorphism 적용
```typescript
headerStyle: {
  backgroundColor: 'rgba(255, 255, 255, 0.85)',
  borderBottomWidth: 1,
  borderBottomColor: 'rgba(255, 255, 255, 0.3)',
shadowColor: '#9898985e',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 8,
  elevation: 4,
},
```

### 7. 아바타/이미지에 Glassmorphism 적용
```typescript
avatarStyle: {
  borderWidth: 2,
  borderColor: 'rgba(255, 255, 255, 0.5)',
shadowColor: '#9898985e',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.2,
  shadowRadius: 8,
  elevation: 4,
},
```

### 8. FAB(Floating Action Button)에 Glassmorphism 적용
```typescript
fabStyle: {
  backgroundColor: 'rgba(0, 122, 255, 0.9)',
  borderRadius: 30,
  borderWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.4)',
  shadowColor: '#007AFF',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.4,
  shadowRadius: 12,
  elevation: 10,
},
```

## 배경색 팔레트

### 기본 배경
```typescript
backgroundColor: '#E3F2FD' // 연한 파란색
```

### 다양한 그라데이션 배경
- Blue: `#E3F2FD`
- Purple: `#F3E5F5`
- Pink: `#FCE4EC`
- Green: `#E8F5E9`
- Orange: `#FFF3E0`
- Cyan: `#E0F7FA`

## 일관성 유지 팁

1. **투명도 레벨**
   - 강한 배경: `0.9` (헤더, 중요 버튼)
   - 중간 배경: `0.75` (카드, 일반 컨테이너)
   - 약한 배경: `0.55-0.65` (서브 카드, 댓글)

2. **테두리 색상**
   - 일반: `rgba(255, 255, 255, 0.3)`
   - 강조: `rgba(255, 255, 255, 0.5)`
   - 약함: `rgba(255, 255, 255, 0.2)`

3. **그림자 효과**
   - 중요 요소: `shadowOpacity: 0.2-0.3`
   - 일반 요소: `shadowOpacity: 0.1-0.15`
   - 미묘한 효과: `shadowOpacity: 0.05-0.08`

4. **Border Radius**
   - 큰 카드: `16px`
   - 일반 버튼/카드: `12px`
   - 작은 요소: `8px`
   - 원형: `999px` 또는 `width/2`

## 적용하지 않는 화면들

일부 화면은 현재의 디자인이 더 적합하거나 glassmorphism이 필요하지 않을 수 있습니다:
- 전체 화면 이미지가 배경인 경우
- 이미 독특한 디자인 시스템을 가진 경우
- 로딩 화면, 스플래시 화면 등

## 성능 고려사항

- 그림자와 투명도는 성능에 영향을 줄 수 있으므로 적절히 사용
- 중첩된 glassmorphism 효과는 피하기
- 리스트 아이템에는 elevation 값을 낮게 유지

## GlassCard 컴포넌트 사용

공통 컴포넌트를 사용하면 더 쉽게 적용할 수 있습니다:

```typescript
import GlassCard from '../../components/GlassCard';

<GlassCard variant="default" borderRadius={16}>
  <Text>내용</Text>
</GlassCard>
```

Variants:
- `default`: 기본 (0.75 투명도)
- `strong`: 강함 (0.9 투명도)
- `light`: 약함 (0.55 투명도)
- `dark`: 어두운 배경용

