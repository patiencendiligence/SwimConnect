import { SwimRecord } from '../types';

/**
 * 연속 수영 일수 계산
 */
export const calculateSwimStreak = (records: SwimRecord[]): number => {
  if (records.length === 0) return 0;

  // 날짜별로 그룹화
  const dateSet = new Set<string>();
  records.forEach(record => {
    const date = new Date(record.date);
    const dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    dateSet.add(dateStr);
  });

  const uniqueDates = Array.from(dateSet)
    .map(dateStr => {
      const [year, month, day] = dateStr.split('-').map(Number);
      return new Date(year, month - 1, day);
    })
    .sort((a, b) => b.getTime() - a.getTime()); // 최신순 정렬

  if (uniqueDates.length === 0) return 0;

  // 오늘부터 연속된 날짜 카운트
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  let currentDate = new Date(today);

  for (const recordDate of uniqueDates) {
    const diffDays = Math.floor(
      (currentDate.getTime() - recordDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0 || diffDays === 1) {
      // 오늘이거나 하루 전
      streak++;
      currentDate = new Date(recordDate);
    } else if (diffDays > 1) {
      // 연속이 끊김
      break;
    }
  }

  return streak;
};

/**
 * 최장 연속 수영 일수 계산
 */
export const calculateLongestStreak = (records: SwimRecord[]): number => {
  if (records.length === 0) return 0;

  // 날짜별로 그룹화
  const dateSet = new Set<string>();
  records.forEach(record => {
    const date = new Date(record.date);
    const dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    dateSet.add(dateStr);
  });

  const uniqueDates = Array.from(dateSet)
    .map(dateStr => {
      const [year, month, day] = dateStr.split('-').map(Number);
      return new Date(year, month - 1, day);
    })
    .sort((a, b) => a.getTime() - b.getTime()); // 오래된 순 정렬

  if (uniqueDates.length === 0) return 0;

  let maxStreak = 1;
  let currentStreak = 1;
  let prevDate = uniqueDates[0];

  for (let i = 1; i < uniqueDates.length; i++) {
    const currentDate = uniqueDates[i];
    const diffDays = Math.floor(
      (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 1) {
      // 연속
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      // 연속 끊김
      currentStreak = 1;
    }

    prevDate = currentDate;
  }

  return maxStreak;
};

/**
 * 주간 수영 빈도 계산 (요일별)
 */
export const calculateWeeklyFrequency = (records: SwimRecord[]): number[] => {
  const weekDays = [0, 0, 0, 0, 0, 0, 0]; // 일~토

  records.forEach(record => {
    const date = new Date(record.date);
    const dayOfWeek = date.getDay();
    weekDays[dayOfWeek]++;
  });

  return weekDays;
};

/**
 * 이번 주 수영 횟수
 */
export const getThisWeekSwimCount = (records: SwimRecord[]): number => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // 이번 주 일요일
  startOfWeek.setHours(0, 0, 0, 0);

  return records.filter(record => {
    const recordDate = new Date(record.date);
    return recordDate >= startOfWeek;
  }).length;
};

