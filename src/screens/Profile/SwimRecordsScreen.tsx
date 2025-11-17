import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../contexts/AuthContext';
import {
  calculateMonthlyStats,
  calculateStrokeStats,
  calculateWeeklyStats,
  formatDistance,
  formatDuration,
  STROKE_NAMES,
} from '../../utils/swimStats';
import { glassStyles } from '../../styles/glassmorphism';
import SwimHabitTracker from '../../components/SwimHabitTracker';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type ViewMode = 'week' | 'month' | 'all';
type TabMode = 'stats' | 'calendar';

const SwimRecordsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [tabMode, setTabMode] = useState<TabMode>('stats');

  // 통계 계산
  const monthlyStats = useMemo(() => {
    return calculateMonthlyStats(user?.swimRecords || []);
  }, [user?.swimRecords]);

  const strokeStats = useMemo(() => {
    return calculateStrokeStats(user?.swimRecords || []);
  }, [user?.swimRecords]);

  const weeklyStats = useMemo(() => {
    return calculateWeeklyStats(user?.swimRecords || []);
  }, [user?.swimRecords]);

  // 전체 통계
  const totalDistance = user?.swimRecords?.reduce((sum, r) => sum + r.distance, 0) || 0;
  const totalDuration = user?.swimRecords?.reduce((sum, r) => sum + r.duration, 0) || 0;
  const totalCalories = user?.swimRecords?.reduce((sum, r) => sum + (r.calories || 0), 0) || 0;

  const currentStats = viewMode === 'week' ? weeklyStats : 
                       viewMode === 'month' ? (monthlyStats[0] || null) :
                       {
                         totalDistance,
                         totalDuration,
                         swimCount: user?.swimRecords?.length || 0,
                         totalCalories,
                       };

  if (!user) return null;

  return (
    <ScrollView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>수영 기록 분석</Text>
        <Text style={styles.headerSubtitle}>나의 수영 여정을 한눈에</Text>
      </View>

      {/* 탭 선택 */}
      <View style={styles.tabSelector}>
        <TouchableOpacity
          style={[styles.tabButton, tabMode === 'stats' && styles.tabButtonActive]}
          onPress={() => setTabMode('stats')}
        >
          <Icon name="stats-chart" size={20} color={tabMode === 'stats' ? '#fff' : '#666'} />
          <Text style={[styles.tabText, tabMode === 'stats' && styles.tabTextActive]}>
            통계
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, tabMode === 'calendar' && styles.tabButtonActive]}
          onPress={() => setTabMode('calendar')}
        >
          <Icon name="calendar" size={20} color={tabMode === 'calendar' ? '#fff' : '#666'} />
          <Text style={[styles.tabText, tabMode === 'calendar' && styles.tabTextActive]}>
            달력
          </Text>
        </TouchableOpacity>
      </View>

      {tabMode === 'stats' ? (
        <>
          {/* 기간 선택 */}
      <View style={styles.periodSelector}>
        <TouchableOpacity
          style={[styles.periodButton, viewMode === 'week' && styles.periodButtonActive]}
          onPress={() => setViewMode('week')}
        >
          <Text style={[styles.periodText, viewMode === 'week' && styles.periodTextActive]}>
            주간
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.periodButton, viewMode === 'month' && styles.periodButtonActive]}
          onPress={() => setViewMode('month')}
        >
          <Text style={[styles.periodText, viewMode === 'month' && styles.periodTextActive]}>
            월간
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.periodButton, viewMode === 'all' && styles.periodButtonActive]}
          onPress={() => setViewMode('all')}
        >
          <Text style={[styles.periodText, viewMode === 'all' && styles.periodTextActive]}>
            전체
          </Text>
        </TouchableOpacity>
      </View>

      {/* 주요 통계 */}
      {currentStats && (
        <View style={styles.mainStatsContainer}>
          <View style={styles.mainStatCard}>
            <Icon name="water" size={32} color="#007AFF" />
            <Text style={styles.mainStatValue}>
              {formatDistance(currentStats.totalDistance)}
            </Text>
            <Text style={styles.mainStatLabel}>총 거리</Text>
          </View>

          <View style={styles.mainStatCard}>
            <Icon name="time" size={32} color="#34C759" />
            <Text style={styles.mainStatValue}>
              {formatDuration(currentStats.totalDuration)}
            </Text>
            <Text style={styles.mainStatLabel}>총 시간</Text>
          </View>

          <View style={styles.mainStatCard}>
            <Icon name="fitness" size={32} color="#FF9500" />
            <Text style={styles.mainStatValue}>{currentStats.swimCount}회</Text>
            <Text style={styles.mainStatLabel}>수영 횟수</Text>
          </View>

          {currentStats.totalCalories !== undefined && (
            <View style={styles.mainStatCard}>
              <Icon name="flame" size={32} color="#FF3B30" />
              <Text style={styles.mainStatValue}>
                {Math.round(currentStats.totalCalories)}
              </Text>
              <Text style={styles.mainStatLabel}>칼로리</Text>
            </View>
          )}
        </View>
      )}

      {/* 영법별 통계 */}
      {strokeStats.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>영법별 분석</Text>
          <View style={styles.strokeStatsContainer}>
            {strokeStats.map((stat, index) => (
              <View key={stat.strokeType} style={styles.strokeCard}>
                <View style={styles.strokeCardHeader}>
                  <Text style={styles.strokeName}>{stat.displayName}</Text>
                  <Text style={styles.strokePercentage}>{stat.percentage.toFixed(1)}%</Text>
                </View>
                <View style={styles.strokeProgressBar}>
                  <View 
                    style={[
                      styles.strokeProgress, 
                      { width: `${stat.percentage}%` },
                      { backgroundColor: getStrokeColor(index) }
                    ]} 
                  />
                </View>
                <View style={styles.strokeCardFooter}>
                  <Text style={styles.strokeDistance}>{formatDistance(stat.totalDistance)}</Text>
                  <Text style={styles.strokeCount}>{stat.count}회</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* 월별 추이 */}
      {monthlyStats.length > 0 && viewMode === 'all' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>월별 추이</Text>
          {monthlyStats.slice(0, 6).map(stat => (
            <View key={stat.month} style={styles.monthCard}>
              <View style={styles.monthHeader}>
                <Icon name="calendar" size={20} color="#007AFF" />
                <Text style={styles.monthLabel}>{stat.month}</Text>
              </View>
              <View style={styles.monthStats}>
                <View style={styles.monthStatItem}>
                  <Text style={styles.monthStatLabel}>거리</Text>
                  <Text style={styles.monthStatValue}>{formatDistance(stat.totalDistance)}</Text>
                </View>
                <View style={styles.monthStatItem}>
                  <Text style={styles.monthStatLabel}>시간</Text>
                  <Text style={styles.monthStatValue}>{formatDuration(stat.totalDuration)}</Text>
                </View>
                <View style={styles.monthStatItem}>
                  <Text style={styles.monthStatLabel}>횟수</Text>
                  <Text style={styles.monthStatValue}>{stat.swimCount}회</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* 스마트워치 연동 안내 */}
      <View style={styles.watchSection}>
        <Icon name="watch" size={40} color="#007AFF" />
        <Text style={styles.watchTitle}>Apple Watch 연동하기</Text>
        <Text style={styles.watchDescription}>
          Apple Health 데이터를 연동하여 자동으로 수영 기록을 관리하세요
        </Text>
        <TouchableOpacity style={styles.watchButton}>
          <Icon name="link" size={20} color="#fff" />
          <Text style={styles.watchButtonText}>건강 데이터 연동</Text>
        </TouchableOpacity>
      </View>

        </>
      ) : (
        <>
          {/* 달력 뷰 */}
          <View style={styles.calendarContainer}>
            {user.swimRecords && user.swimRecords.length > 0 ? (
              <SwimHabitTracker swimRecords={user.swimRecords} weekCount={26} />
            ) : (
              <View style={styles.emptyState}>
                <Icon name="calendar-outline" size={60} color="#ccc" />
                <Text style={styles.emptyStateText}>아직 수영 기록이 없습니다</Text>
                <Text style={styles.emptyStateSubtext}>첫 수영을 시작해보세요!</Text>
              </View>
            )}
          </View>

          {/* 월별 리포트 */}
          {monthlyStats.length > 0 && (
            <View style={styles.monthlyReportSection}>
              <Text style={styles.reportTitle}>월별 리포트</Text>
              {monthlyStats.slice(0, 6).map(stat => {
                const monthRecords = user.swimRecords?.filter(record => {
                  const recordDate = new Date(record.date);
                  const monthStr = `${recordDate.getFullYear()}-${String(recordDate.getMonth() + 1).padStart(2, '0')}`;
                  return monthStr === stat.month;
                }) || [];

                const monthStrokeStats = calculateStrokeStats(monthRecords).slice(0, 3);

                return (
                  <View key={stat.month} style={styles.reportCard}>
                    <View style={styles.reportHeader}>
                      <Text style={styles.reportMonth}>{stat.month}</Text>
                      <View style={styles.reportBadge}>
                        <Icon name="water" size={14} color="#007AFF" />
                        <Text style={styles.reportBadgeText}>{stat.swimCount}회</Text>
                      </View>
                    </View>

                    <View style={styles.reportStatsGrid}>
                      <View style={styles.reportStatItem}>
                        <Text style={styles.reportStatLabel}>거리</Text>
                        <Text style={styles.reportStatValue}>{formatDistance(stat.totalDistance)}</Text>
                      </View>
                      <View style={styles.reportStatItem}>
                        <Text style={styles.reportStatLabel}>시간</Text>
                        <Text style={styles.reportStatValue}>{formatDuration(stat.totalDuration)}</Text>
                      </View>
                      <View style={styles.reportStatItem}>
                        <Text style={styles.reportStatLabel}>칼로리</Text>
                        <Text style={styles.reportStatValue}>{Math.round(stat.totalCalories || 0)}</Text>
                      </View>
                    </View>

                    {monthStrokeStats.length > 0 && (
                      <View style={styles.reportStrokeSection}>
                        <Text style={styles.reportStrokeTitle}>주요 영법</Text>
                        <View style={styles.reportStrokeList}>
                          {monthStrokeStats.map((stroke, index) => (
                            <View key={stroke.strokeType} style={styles.reportStrokeChip}>
                              <Text style={styles.reportStrokeText}>{stroke.displayName}</Text>
                              <Text style={styles.reportStrokePercent}>{stroke.percentage.toFixed(0)}%</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          )}
        </>
      )}

      {/* 수영 기록 추가 플로팅 버튼 */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('SwimRecordInput')}
      >
        <Icon name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </ScrollView>
  );
};

const getStrokeColor = (index: number): string => {
  const colors = ['#007AFF', '#34C759', '#FF9500', '#FF3B30', '#AF52DE'];
  return colors[index % colors.length];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F4FD',
  },
  header: {
    backgroundColor: 'rgba(0, 122, 255, 0.85)',
    padding: 30,
    paddingTop: 60,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  periodSelector: {
    flexDirection: 'row',
    margin: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 12,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  periodButtonActive: {
    backgroundColor: '#007AFF',
  },
  periodText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  periodTextActive: {
    color: '#fff',
  },
  mainStatsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  mainStatCard: {
    width: (SCREEN_WIDTH - 60) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: 'rgba(255, 255, 255, 0.5)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  mainStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 12,
  },
  mainStatLabel: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  strokeStatsContainer: {
    gap: 12,
  },
  strokeCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 16,
    padding: 16,
    shadowColor: 'rgba(255, 255, 255, 0.5)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  strokeCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  strokeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  strokePercentage: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  strokeProgressBar: {
    height: 10,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 10,
  },
  strokeProgress: {
    height: '100%',
    borderRadius: 5,
  },
  strokeCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  strokeDistance: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  strokeCount: {
    fontSize: 14,
    color: '#666',
  },
  monthCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: 'rgba(255, 255, 255, 0.5)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  monthLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginLeft: 8,
  },
  monthStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  monthStatItem: {
    flex: 1,
  },
  monthStatLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  monthStatValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  watchSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 24,
    padding: 30,
    margin: 20,
    marginTop: 10,
    alignItems: 'center',
    shadowColor: 'rgba(255, 255, 255, 0.5)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  watchTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginTop: 16,
  },
  watchDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  watchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 20,
    gap: 8,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  watchButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  tabSelector: {
    flexDirection: 'row',
    margin: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  tabButtonActive: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  tabTextActive: {
    color: '#fff',
  },
  calendarContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginTop: 15,
  },
  emptyStateSubtext: {
    fontSize: 13,
    color: '#999',
    marginTop: 5,
  },
  monthlyReportSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  reportTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  reportCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    borderWidth: 0,
    shadowColor: 'rgba(255, 255, 255, 0.5)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  reportMonth: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  reportBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  reportBadgeText: {
    fontSize: 13,
    color: '#007AFF',
    fontWeight: '600',
  },
  reportStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  reportStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  reportStatLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  reportStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  reportStrokeSection: {
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  reportStrokeTitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 10,
    fontWeight: '600',
  },
  reportStrokeList: {
    flexDirection: 'row',
    gap: 8,
  },
  reportStrokeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  reportStrokeText: {
    fontSize: 12,
    color: '#000',
  },
  reportStrokePercent: {
    fontSize: 11,
    color: '#007AFF',
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
});

export default SwimRecordsScreen;

