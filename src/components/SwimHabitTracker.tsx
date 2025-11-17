import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SwimRecord } from '../types';

interface SwimHabitTrackerProps {
  swimRecords: SwimRecord[];
  weekCount?: number; // 표시할 주 수 (기본 12주)
}

interface DayData {
  date: Date;
  records: SwimRecord[];
  totalDistance: number;
}

const SwimHabitTracker: React.FC<SwimHabitTrackerProps> = ({
  swimRecords,
  weekCount = 12,
}) => {
  const habitData = useMemo(() => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (weekCount * 7 - 1));
    startDate.setHours(0, 0, 0, 0);

    const days: DayData[] = [];

    // 날짜별 데이터 생성
    for (let i = 0; i < weekCount * 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const dayRecords = swimRecords.filter(record => {
        const recordDate = new Date(record.date);
        return (
          recordDate.getFullYear() === date.getFullYear() &&
          recordDate.getMonth() === date.getMonth() &&
          recordDate.getDate() === date.getDate()
        );
      });

      const totalDistance = dayRecords.reduce((sum, r) => sum + r.distance, 0);

      days.push({
        date,
        records: dayRecords,
        totalDistance,
      });
    }

    // 주별로 그룹화
    const weeks: DayData[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    return weeks;
  }, [swimRecords, weekCount]);

  const getStrokeColor = (strokeType?: string): string => {
    switch (strokeType) {
      case 'freestyle': return '#007AFF';
      case 'backstroke': return '#34C759';
      case 'breaststroke': return '#FF9500';
      case 'butterfly': return '#FF3B30';
      case 'medley': return '#AF52DE';
      default: return '#007AFF';
    }
  };

  const getCellStyle = (dayData: DayData) => {
    if (dayData.records.length === 0) {
      return styles.cellEmpty;
    }

    // 가장 많이 한 영법의 색상 사용
    const strokeCounts: { [key: string]: number } = {};
    dayData.records.forEach(record => {
      const stroke = record.strokeType || 'freestyle';
      strokeCounts[stroke] = (strokeCounts[stroke] || 0) + record.distance;
    });

    const dominantStroke = Object.entries(strokeCounts).reduce(
      (max, [stroke, distance]) => 
        distance > max.distance ? { stroke, distance } : max,
      { stroke: 'freestyle', distance: 0 }
    ).stroke;

    const color = getStrokeColor(dominantStroke);

    // 거리에 따라 투명도 조절
    let opacity = 0.3;
    if (dayData.totalDistance >= 2000) opacity = 1.0;
    else if (dayData.totalDistance >= 1500) opacity = 0.8;
    else if (dayData.totalDistance >= 1000) opacity = 0.6;
    else if (dayData.totalDistance >= 500) opacity = 0.4;

    return {
      ...styles.cellFilled,
      backgroundColor: color,
      opacity,
    };
  };

  const getMonthLabel = (weekIndex: number) => {
    if (weekIndex % 4 !== 0) return null;
    
    const firstDay = habitData[weekIndex][0];
    if (!firstDay) return null;

    const month = firstDay.date.getMonth() + 1;
    return `${month}월`;
  };

  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>수영 습관 추적</Text>
      <Text style={styles.subtitle}>
        매일의 기록이 쌓여 만들어지는 나만의 영법바
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.trackerContainer}>
          {/* 요일 라벨 */}
          <View style={styles.weekDaysColumn}>
            <View style={styles.monthLabelSpace} />
            {weekDays.map((day, index) => (
              <View key={index} style={styles.weekDayLabel}>
                <Text style={styles.weekDayText}>{day}</Text>
              </View>
            ))}
          </View>

          {/* 날짜 그리드 */}
          <View>
            {/* 월 라벨 */}
            <View style={styles.monthLabelsRow}>
              {habitData.map((_, weekIndex) => (
                <View key={weekIndex} style={styles.monthLabelCell}>
                  {getMonthLabel(weekIndex) && (
                    <Text style={styles.monthLabel}>{getMonthLabel(weekIndex)}</Text>
                  )}
                </View>
              ))}
            </View>

            {/* 날짜 셀 */}
            <View style={styles.gridContainer}>
              {habitData.map((week, weekIndex) => (
                <View key={weekIndex} style={styles.column}>
                  {week.map((day, dayIndex) => (
                    <View key={dayIndex} style={getCellStyle(day)} />
                  ))}
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* 범례 */}
      <View style={styles.legend}>
        <Text style={styles.legendLabel}>적음</Text>
        <View style={[styles.legendCell, { backgroundColor: '#007AFF', opacity: 0.3 }]} />
        <View style={[styles.legendCell, { backgroundColor: '#007AFF', opacity: 0.5 }]} />
        <View style={[styles.legendCell, { backgroundColor: '#007AFF', opacity: 0.7 }]} />
        <View style={[styles.legendCell, { backgroundColor: '#007AFF', opacity: 1.0 }]} />
        <Text style={styles.legendLabel}>많음</Text>
      </View>

      {/* 영법 색상 안내 */}
      <View style={styles.strokeLegend}>
        <View style={styles.strokeItem}>
          <View style={[styles.strokeDot, { backgroundColor: '#007AFF' }]} />
          <Text style={styles.strokeLabel}>자유형</Text>
        </View>
        <View style={styles.strokeItem}>
          <View style={[styles.strokeDot, { backgroundColor: '#34C759' }]} />
          <Text style={styles.strokeLabel}>배영</Text>
        </View>
        <View style={styles.strokeItem}>
          <View style={[styles.strokeDot, { backgroundColor: '#FF9500' }]} />
          <Text style={styles.strokeLabel}>평영</Text>
        </View>
        <View style={styles.strokeItem}>
          <View style={[styles.strokeDot, { backgroundColor: '#FF3B30' }]} />
          <Text style={styles.strokeLabel}>접영</Text>
        </View>
        <View style={styles.strokeItem}>
          <View style={[styles.strokeDot, { backgroundColor: '#AF52DE' }]} />
          <Text style={styles.strokeLabel}>혼영</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 20,
  },
  trackerContainer: {
    flexDirection: 'row',
  },
  weekDaysColumn: {
    marginRight: 8,
  },
  monthLabelSpace: {
    height: 20,
  },
  weekDayLabel: {
    height: 14,
    justifyContent: 'center',
    marginVertical: 1,
  },
  weekDayText: {
    fontSize: 10,
    color: '#666',
  },
  monthLabelsRow: {
    flexDirection: 'row',
    height: 20,
    marginBottom: 4,
  },
  monthLabelCell: {
    width: 14,
    marginHorizontal: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthLabel: {
    fontSize: 10,
    color: '#666',
    fontWeight: '600',
  },
  gridContainer: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
    marginHorizontal: 1,
  },
  cellEmpty: {
    width: 14,
    height: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 3,
    marginVertical: 1,
  },
  cellFilled: {
    width: 14,
    height: 14,
    borderRadius: 3,
    marginVertical: 1,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 15,
    gap: 4,
  },
  legendLabel: {
    fontSize: 11,
    color: '#666',
    marginHorizontal: 4,
  },
  legendCell: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  strokeLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  strokeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  strokeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  strokeLabel: {
    fontSize: 11,
    color: '#666',
  },
});

export default SwimHabitTracker;

