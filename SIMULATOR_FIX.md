# 🛠️ iOS 시뮬레이터 부팅 문제 해결

## ❌ 에러: "Unable to boot the Simulator"

### 해결 방법 (순서대로 시도)

---

## 1️⃣ 시뮬레이터 종료 및 재시작 (가장 흔한 해결책)

```bash
# 모든 시뮬레이터 종료
killall Simulator

# Xcode 완전 종료
killall Xcode

# 5초 대기 후 다시 실행
npm run ios
```

---

## 2️⃣ 시뮬레이터 캐시 삭제

```bash
# 시뮬레이터 데이터 삭제
xcrun simctl erase all

# 다시 실행
npm run ios
```

⚠️ **주의**: 시뮬레이터의 모든 앱과 데이터가 삭제됩니다.

---

## 3️⃣ 특정 시뮬레이터 선택하여 실행

```bash
# 사용 가능한 시뮬레이터 목록 확인
xcrun simctl list devices

# 특정 시뮬레이터 지정 (예: iPhone 14)
npm run ios -- --simulator="iPhone 14"

# 또는 iPhone SE (더 가벼움)
npm run ios -- --simulator="iPhone SE (3rd generation)"
```

---

## 4️⃣ CoreSimulator 서비스 재시작

```bash
# CoreSimulator 프로세스 종료
launchctl remove com.apple.CoreSimulator.CoreSimulatorService || true

# 시뮬레이터 재시작
open -a Simulator

# 앱 실행
npm run ios
```

---

## 5️⃣ Xcode 설정 재설정

```bash
# Xcode 파생 데이터 삭제
rm -rf ~/Library/Developer/Xcode/DerivedData

# Xcode 캐시 삭제
rm -rf ~/Library/Caches/com.apple.dt.Xcode

# Xcode 다시 열기
open -a Xcode
```

---

## 6️⃣ 디스크 공간 확인

```bash
# 디스크 공간 확인
df -h

# 최소 필요 공간: 10GB 이상
```

**공간 부족 시 해결:**
```bash
# Xcode 파생 데이터 정리 (보통 수 GB)
rm -rf ~/Library/Developer/Xcode/DerivedData

# 시뮬레이터 불필요한 디바이스 삭제
xcrun simctl delete unavailable
```

---

## 7️⃣ macOS 재시작

가장 확실한 방법:
```bash
# Mac 재시작 후
npm run ios
```

---

## 🎯 빠른 해결 (자주 사용)

### 방법 A: 한 번에 해결
```bash
# 1. 모든 프로세스 종료
killall Simulator
killall Xcode

# 2. 시뮬레이터 초기화
xcrun simctl erase all

# 3. CoreSimulator 재시작
launchctl remove com.apple.CoreSimulator.CoreSimulatorService || true

# 4. 앱 실행
npm run ios
```

### 방법 B: 가벼운 시뮬레이터 사용
```bash
# iPhone SE 사용 (더 빠름)
npm run ios -- --simulator="iPhone SE (3rd generation)"
```

---

## 🔍 에러별 상세 해결

### "Failed to boot device"
```bash
# 시뮬레이터 리셋
xcrun simctl shutdown all
xcrun simctl erase all
npm run ios
```

### "Domain: com.apple.CoreSimulator.SimError"
```bash
# CoreSimulator 재시작
sudo killall -9 com.apple.CoreSimulator.CoreSimulatorService
npm run ios
```

### "Device is not available"
```bash
# Xcode Command Line Tools 재설정
sudo xcode-select --reset
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
npm run ios
```

---

## 💡 예방 팁

### 1. 시뮬레이터를 가볍게 유지
```bash
# 사용하지 않는 시뮬레이터 삭제
xcrun simctl delete unavailable
```

### 2. 정기적인 캐시 정리
```bash
# 주기적으로 실행
rm -rf ~/Library/Developer/Xcode/DerivedData
```

### 3. 디스크 공간 확보
```
최소 10GB 이상 유지
```

### 4. Xcode 최신 상태 유지
```
App Store → Xcode 업데이트 확인
```

---

## 🚀 대안: 실제 iOS 기기에서 실행

시뮬레이터 문제가 계속되면 실제 기기 사용:

### 준비물
- iPhone/iPad
- Lightning/USB-C 케이블

### 실행 방법
```bash
# 1. 기기를 Mac에 연결
# 2. 기기에서 "이 컴퓨터를 신뢰하시겠습니까?" → 신뢰
# 3. Xcode 열기
open ios/SwimConnect.xcworkspace

# 4. 상단 기기 선택 → 연결된 iPhone 선택
# 5. ▶ 버튼 클릭
```

**장점:**
- 시뮬레이터보다 빠름
- 실제 성능 테스트 가능
- 카메라, GPS 등 실제 하드웨어 사용 가능

---

## 📱 Android로 먼저 테스트

iOS 문제 해결하는 동안 Android로 개발:

```bash
# Android 에뮬레이터 실행 (보통 문제 없음)
npm run android
```

**Android 장점:**
- 설정이 더 간단
- 에뮬레이터가 더 안정적
- 시뮬레이터보다 가벼움

---

## 🆘 여전히 안 되는 경우

### 1. Xcode 재설치
```bash
# App Store에서 Xcode 삭제 후 재설치
```

### 2. macOS 업데이트
```
시스템 설정 → 소프트웨어 업데이트
```

### 3. 문제 로그 확인
```bash
# 시뮬레이터 로그 확인
tail -f ~/Library/Logs/CoreSimulator/CoreSimulator.log
```

---

## ✅ 최종 체크리스트

시도한 순서대로 체크:

- [ ] `killall Simulator` + `killall Xcode` 실행
- [ ] `xcrun simctl erase all` 실행
- [ ] `npm run ios` 재시도
- [ ] CoreSimulator 서비스 재시작
- [ ] Xcode 캐시 삭제
- [ ] Mac 재시작
- [ ] 실제 기기로 테스트
- [ ] Android로 대체 개발

---

## 💬 자주 묻는 질문

**Q: 왜 이런 문제가 생기나요?**
A: Xcode 시뮬레이터는 리소스를 많이 사용하고, 캐시 문제나 프로세스 충돌이 자주 발생합니다.

**Q: 매번 이런 문제가 생기나요?**
A: 아닙니다. 보통 한 번 해결하면 잘 작동합니다. 정기적인 캐시 정리로 예방 가능합니다.

**Q: 실제 기기가 더 나은가요?**
A: 네! 개발 시 실제 기기가 더 빠르고 안정적입니다.

---

## 🎯 권장 순서

대부분의 경우 이것만으로 해결:

```bash
# 1단계
killall Simulator
killall Xcode

# 2단계
xcrun simctl erase all

# 3단계
npm run ios
```

안 되면:
```bash
# 4단계: Mac 재시작
sudo reboot
```

그래도 안 되면:
```bash
# 5단계: 실제 기기 사용!
```

화이팅! 🚀

