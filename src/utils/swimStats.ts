import { SwimRecord } from '../types';

// 영법 한글 이름
export const STROKE_NAMES = {
  freestyle: '자유형',
  backstroke: '배영',
  breaststroke: '평영',
  butterfly: '접영',
  medley: '혼영',
};

// 월별 통계 인터페이스
export interface MonthlyStats {
  month: string; // "2024-11"
  totalDistance: number;
  totalDuration: number;
  swimCount: number;
  avgDistance: number;
  totalCalories: number;
  strokeBreakdown: {
    [key: string]: number; // 영법별 거리
  };
}

// 영법별 통계
export interface StrokeStats {
  strokeType: string;
  displayName: string;
  totalDistance: number;
  count: number;
  percentage: number;
}

// 주간 통계 (최근 7일)
export interface WeeklyStats {
  totalDistance: number;
  totalDuration: number;
  swimDays: number;
  avgDistancePerDay: number;
  dailyData: {
    date: string;
    distance: number;
    duration: number;
  }[];
}

/**
 * 월별 통계 계산
 */
export const calculateMonthlyStats = (records: SwimRecord[]): MonthlyStats[] => {
  const monthlyMap = new Map<string, SwimRecord[]>();

  // 월별로 그룹화
  records.forEach(record => {
    const monthKey = `${record.date.getFullYear()}-${String(record.date.getMonth() + 1).padStart(2, '0')}`;
    if (!monthlyMap.has(monthKey)) {
      monthlyMap.set(monthKey, []);
    }
    monthlyMap.get(monthKey)!.push(record);
  });

  // 각 월의 통계 계산
  const stats: MonthlyStats[] = [];
  monthlyMap.forEach((monthRecords, month) => {
    const totalDistance = monthRecords.reduce((sum, r) => sum + r.distance, 0);
    const totalDuration = monthRecords.reduce((sum, r) => sum + r.duration, 0);
    const totalCalories = monthRecords.reduce((sum, r) => sum + (r.calories || 0), 0);
    
    // 영법별 분류
    const strokeBreakdown: { [key: string]: number } = {};
    monthRecords.forEach(record => {
      const stroke = record.strokeType || 'freestyle';
      strokeBreakdown[stroke] = (strokeBreakdown[stroke] || 0) + record.distance;
    });

    stats.push({
      month,
      totalDistance,
      totalDuration,
      swimCount: monthRecords.length,
      avgDistance: totalDistance / monthRecords.length,
      totalCalories,
      strokeBreakdown,
    });
  });

  return stats.sort((a, b) => b.month.localeCompare(a.month));
};

/**
 * 영법별 통계 계산
 */
export const calculateStrokeStats = (records: SwimRecord[]): StrokeStats[] => {
  const totalDistance = records.reduce((sum, r) => sum + r.distance, 0);
  const strokeMap = new Map<string, { distance: number; count: number }>();

  records.forEach(record => {
    const stroke = record.strokeType || 'freestyle';
    if (!strokeMap.has(stroke)) {
      strokeMap.set(stroke, { distance: 0, count: 0 });
    }
    const stats = strokeMap.get(stroke)!;
    stats.distance += record.distance;
    stats.count += 1;
  });

  const result: StrokeStats[] = [];
  strokeMap.forEach((stats, strokeType) => {
    result.push({
      strokeType,
      displayName: STROKE_NAMES[strokeType as keyof typeof STROKE_NAMES] || strokeType,
      totalDistance: stats.distance,
      count: stats.count,
      percentage: totalDistance > 0 ? (stats.distance / totalDistance) * 100 : 0,
    });
  });

  return result.sort((a, b) => b.totalDistance - a.totalDistance);
};

/**
 * 주간 통계 계산 (최근 7일)
 */
export const calculateWeeklyStats = (records: SwimRecord[]): WeeklyStats => {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // 최근 7일 데이터 필터링
  const weekRecords = records.filter(r => r.date >= sevenDaysAgo);

  const dailyMap = new Map<string, { distance: number; duration: number }>();
  
  weekRecords.forEach(record => {
    const dateKey = record.date.toISOString().split('T')[0];
    if (!dailyMap.has(dateKey)) {
      dailyMap.set(dateKey, { distance: 0, duration: 0 });
    }
    const day = dailyMap.get(dateKey)!;
    day.distance += record.distance;
    day.duration += record.duration;
  });

  const totalDistance = weekRecords.reduce((sum, r) => sum + r.distance, 0);
  const totalDuration = weekRecords.reduce((sum, r) => sum + r.duration, 0);

  const dailyData = Array.from(dailyMap.entries()).map(([date, data]) => ({
    date,
    distance: data.distance,
    duration: data.duration,
  })).sort((a, b) => a.date.localeCompare(b.date));

  return {
    totalDistance,
    totalDuration,
    swimDays: dailyMap.size,
    avgDistancePerDay: dailyMap.size > 0 ? totalDistance / dailyMap.size : 0,
    dailyData,
  };
};

/**
 * 거리를 km 단위로 포맷팅
 */
export const formatDistance = (meters: number): string => {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)}km`;
  }
  return `${meters}m`;
};

/**
 * 시간을 시:분 형식으로 포맷팅
 */
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  
  if (hours > 0) {
    return `${hours}시간 ${mins}분`;
  }
  return `${mins}분`;
};

/**
 * 페이스를 분:초/100m 형식으로 포맷팅
 */
export const formatPace = (secondsPer100m: number): string => {
  const mins = Math.floor(secondsPer100m / 60);
  const secs = Math.round(secondsPer100m % 60);
  return `${mins}:${String(secs).padStart(2, '0')}/100m`;
};

/**
 * 이번 달 통계 가져오기
 */
export const getCurrentMonthStats = (records: SwimRecord[]): MonthlyStats | null => {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  
  const monthlyStats = calculateMonthlyStats(records);
  return monthlyStats.find(s => s.month === currentMonth) || null;
};

