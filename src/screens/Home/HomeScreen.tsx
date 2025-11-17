import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { LEVELS } from '../../constants';
import Icon from 'react-native-vector-icons/Ionicons';
import { glassStyles } from '../../styles/glassmorphism';
import {
  getCurrentMonthStats,
  calculateStrokeStats,
  formatDistance,
  formatDuration,
  STROKE_NAMES,
} from '../../utils/swimStats';
import {
  calculateSwimStreak,
  calculateLongestStreak,
  getThisWeekSwimCount,
} from '../../utils/swimStreak';
import SwimHabitTracker from '../../components/SwimHabitTracker';

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const [levelModalVisible, setLevelModalVisible] = useState(false);

  if (!user) return null;

  const currentLevel = LEVELS.find(l => l.level === user.level) || LEVELS[0];
  const swimCount = user.swimRecords?.length || 0;

  // 이번 달 통계 계산
  const monthStats = useMemo(() => {
    return getCurrentMonthStats(user.swimRecords || []);
  }, [user.swimRecords]);

  // 영법별 통계 계산
  const strokeStats = useMemo(() => {
    return calculateStrokeStats(user.swimRecords || []).slice(0, 3); // 상위 3개만
  }, [user.swimRecords]);

  // 연속 수영 일수 계산
  const currentStreak = useMemo(() => {
    return calculateSwimStreak(user.swimRecords || []);
  }, [user.swimRecords]);

  const longestStreak = useMemo(() => {
    return calculateLongestStreak(user.swimRecords || []);
  }, [user.swimRecords]);

  const thisWeekCount = useMemo(() => {
    return getThisWeekSwimCount(user.swimRecords || []);
  }, [user.swimRecords]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>안녕하세요, {user.nickname}님!</Text>
        <TouchableOpacity
          style={[styles.levelBadge, { backgroundColor: 'rgba(255, 255, 255, 0.25)' }]}
          onPress={() => setLevelModalVisible(true)}
        >
          <Icon name={currentLevel.icon} size={18} color="#fff" />
          <Text style={styles.levelText}>
            {currentLevel.name}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Icon name="water" size={30} color="#007AFF" />
          <Text style={styles.statNumber}>{swimCount}</Text>
          <Text style={styles.statLabel}>수영 횟수</Text>
        </View>
        <View style={styles.statBox}>
          <Icon name="people" size={30} color="#007AFF" />
          <Text style={styles.statNumber}>{user.friends?.length || 0}</Text>
          <Text style={styles.statLabel}>친구</Text>
        </View>
        <TouchableOpacity 
          style={styles.statBox}
          onPress={() => setLevelModalVisible(true)}
        >
          <Icon name={currentLevel.icon} size={30} color={currentLevel.color} />
          <Text style={styles.statNumber}>{user.level}</Text>
          <Text style={styles.statLabel}>등급</Text>
        </TouchableOpacity>
      </View>

      {/* 연속 수영 일수 */}
      <View style={styles.streakContainer}>
        <View style={styles.streakCard}>
          <View style={styles.streakHeader}>
            <Icon name="flame" size={32} color="#007AFF" />
            <View style={styles.streakTextContainer}>
              <Text style={styles.streakNumber}>{currentStreak}일</Text>
              <Text style={styles.streakLabel}>연속 수영</Text>
            </View>
          </View>
          <View style={styles.streakStats}>
            <View style={styles.streakStatItem}>
              <Icon name="trophy" size={16} color="#007AFF" />
              <Text style={styles.streakStatLabel}>최장 기록</Text>
              <Text style={styles.streakStatValue}>{longestStreak}일</Text>
            </View>
            <View style={styles.streakDivider} />
            <View style={styles.streakStatItem}>
              <Icon name="calendar" size={16} color="#007AFF" />
              <Text style={styles.streakStatLabel}>이번 주</Text>
              <Text style={styles.streakStatValue}>{thisWeekCount}회</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>빠른 실행</Text>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Pool', { screen: 'PoolList' })}
        >
          <Icon name="location" size={24} color="#007AFF" />
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>근처 수영장 찾기</Text>
            <Text style={styles.actionSubtitle}>내 위치 기반 수영장 검색</Text>
          </View>
          <Icon name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Feed', { screen: 'FeedCreate' })}
        >
          <Icon name="create" size={24} color="#007AFF" />
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>피드 작성하기</Text>
            <Text style={styles.actionSubtitle}>수영 기록 및 정보 공유</Text>
          </View>
          <Icon name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Profile', { screen: 'SwimRecords' })}
        >
          <Icon name="stats-chart" size={24} color="#007AFF" />
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>내 수영 기록</Text>
            <Text style={styles.actionSubtitle}>기록 확인 및 관리</Text>
          </View>
          <Icon name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>
      </View>

      {/* 이번 달 통계 */}
      {monthStats && (
        <View style={styles.monthStatsContainer}>
          <View style={styles.monthStatsHeader}>
            <Icon name="calendar" size={24} color="#007AFF" />
            <Text style={styles.sectionTitle}>이번 달 수영 기록</Text>
          </View>
          
          <View style={styles.monthStatsGrid}>
            <View style={styles.monthStatItem}>
              <Icon name="water" size={20} color="#007AFF" />
              <Text style={styles.monthStatValue}>{formatDistance(monthStats.totalDistance)}</Text>
              <Text style={styles.monthStatLabel}>총 거리</Text>
            </View>
            
            <View style={styles.monthStatItem}>
              <Icon name="time" size={20} color="#007AFF" />
              <Text style={styles.monthStatValue}>{formatDuration(monthStats.totalDuration)}</Text>
              <Text style={styles.monthStatLabel}>총 시간</Text>
            </View>
            
            <View style={styles.monthStatItem}>
              <Icon name="fitness" size={20} color="#007AFF" />
              <Text style={styles.monthStatValue}>{monthStats.swimCount}회</Text>
              <Text style={styles.monthStatLabel}>수영 횟수</Text>
            </View>
            
            <View style={styles.monthStatItem}>
              <Icon name="flame" size={20} color="#007AFF" />
              <Text style={styles.monthStatValue}>{Math.round(monthStats.totalCalories || 0)}</Text>
              <Text style={styles.monthStatLabel}>칼로리</Text>
            </View>
          </View>

          {/* 영법별 통계 */}
          {strokeStats.length > 0 && (
            <View style={styles.strokeStatsSection}>
              <Text style={styles.strokeStatsTitle}>주로 하는 영법</Text>
              {strokeStats.map((stat, index) => (
                <View key={stat.strokeType} style={styles.strokeStatItem}>
                  <Text style={styles.strokeName}>{stat.displayName}</Text>
                  <View style={styles.strokeProgressBar}>
                    <View 
                      style={[
                        styles.strokeProgress, 
                        { width: `${stat.percentage}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.strokePercentage}>{stat.percentage.toFixed(1)}%</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      {/* 수영 습관 추적기 (영법바) */}
      {user.swimRecords && user.swimRecords.length > 0 && (
        <View style={styles.habitTrackerContainer}>
          <SwimHabitTracker swimRecords={user.swimRecords} weekCount={12} />
        </View>
      )}

      <View style={styles.benefitsContainer}>
        <Text style={styles.sectionTitle}>현재 등급 혜택</Text>
        {currentLevel.benefits.map((benefit, index) => (
          <View key={index} style={styles.benefitItem}>
            <Icon name="checkmark-circle" size={20} color="#007AFF" />
            <Text style={styles.benefitText}>{benefit}</Text>
          </View>
        ))}
      </View>

      {/* 등급 정보 모달 */}
      <Modal
        visible={levelModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLevelModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>등급 시스템</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setLevelModalVisible(false)}
              >
                <Icon name="close" size={28} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.currentLevelSection}>
                <Text style={styles.currentLevelLabel}>현재 등급</Text>
                <View style={[styles.currentLevelCard, { backgroundColor: `${currentLevel.color}15` }]}>
                  <Icon name={currentLevel.icon} size={40} color={currentLevel.color} />
                  <Text style={styles.currentLevelName}>{currentLevel.name}</Text>
                  <Text style={styles.currentLevelNumber}>Lv. {currentLevel.level}</Text>
                </View>
              </View>

              <Text style={styles.levelsTitle}>전체 등급</Text>
              {LEVELS.map((level, index) => {
                const isCurrentLevel = level.level === user.level;
                const isUnlocked = level.level <= user.level;

                return (
                  <View 
                    key={level.level} 
                    style={[
                      styles.levelCard,
                      isCurrentLevel && styles.levelCardCurrent,
                      { borderLeftColor: level.color }
                    ]}
                  >
                    <View style={styles.levelCardHeader}>
                      <View style={styles.levelCardTitleRow}>
                        <Icon 
                          name={level.icon} 
                          size={24} 
                          color={isUnlocked ? level.color : '#ccc'} 
                        />
                        <Text style={[
                          styles.levelCardName,
                          !isUnlocked && styles.levelCardNameLocked
                        ]}>
                          {level.name}
                        </Text>
                        {isCurrentLevel && (
                          <View style={styles.currentBadge}>
                            <Text style={styles.currentBadgeText}>현재</Text>
                          </View>
                        )}
                      </View>
                      <Text style={[
                        styles.levelCardNumber,
                        !isUnlocked && styles.levelCardNumberLocked
                      ]}>
                        Lv. {level.level}
                      </Text>
                    </View>

                    <View style={styles.levelCardBody}>
                      <View style={styles.requirementRow}>
                        <Icon name="water" size={16} color="#007AFF" />
                        <Text style={styles.requirementText}>
                          수영 {level.minSwimCount}회 이상
                        </Text>
                      </View>
                      <View style={styles.requirementRow}>
                        <Icon name="heart" size={16} color="#007AFF" />
                        <Text style={styles.requirementText}>
                          좋아요 {level.minLikeCount}개 이상
                        </Text>
                      </View>
                      <View style={styles.requirementRow}>
                        <Icon name="create" size={16} color="#007AFF" />
                        <Text style={styles.requirementText}>
                          피드 {level.minFeedCount}개 이상
                        </Text>
                      </View>
                    </View>

                    <View style={styles.benefitsSection}>
                      <Text style={styles.benefitsTitle}>혜택</Text>
                      {level.benefits.map((benefit, i) => (
                        <View key={i} style={styles.benefitRow}>
                          <Icon name="checkmark-circle" size={14} color="#007AFF" />
                          <Text style={styles.modalBenefitText}>{benefit}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  header: {
    backgroundColor: 'rgba(0, 122, 255, 0.85)',
    borderBottomWidth: 0,
    padding: 20,
    paddingTop: 60,
    shadowColor: '#007AFF',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    shadowColor: 'rgba(255, 255, 255, 0.5)',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 1,
  },
  levelText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 0,
    margin: 20,
    borderRadius: 24,
    padding: 20,
    shadowColor: 'rgba(255, 255, 255, 0.5)',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  quickActions: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 20,
    marginBottom: 10,
    shadowColor: 'rgba(255, 255, 255, 0.5)',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
    gap: 10,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  streakContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  streakCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 0,
    shadowColor: 'rgba(255, 255, 255, 0.5)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 10,
  },
  streakTextContainer: {
    flex: 1,
  },
  streakNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
  },
  streakLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  streakStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  streakStatItem: {
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  streakStatLabel: {
    fontSize: 11,
    color: '#666',
  },
  streakStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  streakDivider: {
    width: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  habitTrackerContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  benefitsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 0,
    padding: 12,
    borderRadius: 12,
    shadowColor: 'rgba(255, 255, 255, 0.5)',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
    marginBottom: 8,
    gap: 10,
  },
  benefitText: {
    fontSize: 14,
    color: '#333',
  },
  // 이번 달 통계 스타일
  monthStatsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 0,
    margin: 20,
    marginTop: 10,
    borderRadius: 24,
    padding: 20,
    shadowColor: 'rgba(255, 255, 255, 0.5)',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  monthStatsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  monthStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  monthStatItem: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 16,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: 'rgba(255, 255, 255, 0.5)',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  monthStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 8,
    marginBottom: 4,
  },
  monthStatLabel: {
    fontSize: 12,
    color: '#666',
  },
  strokeStatsSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
  },
  strokeStatsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 15,
  },
  strokeStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  strokeName: {
    width: 60,
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  strokeProgressBar: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: 4,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  strokeProgress: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  strokePercentage: {
    width: 50,
    textAlign: 'right',
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
  },
  // 모달 스타일
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '100%',
    maxHeight: '85%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  currentLevelSection: {
    marginBottom: 30,
  },
  currentLevelLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    fontWeight: '600',
  },
  currentLevelCard: {
    alignItems: 'center',
    padding: 30,
    borderRadius: 16,
  },
  currentLevelName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 12,
  },
  currentLevelNumber: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  levelsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
  },
  levelCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  levelCardCurrent: {
    backgroundColor: '#f0f7ff',
  },
  levelCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelCardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  levelCardName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  levelCardNameLocked: {
    color: '#999',
  },
  levelCardNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  levelCardNumberLocked: {
    color: '#ccc',
  },
  currentBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  currentBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  levelCardBody: {
    gap: 10,
    marginBottom: 12,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  requirementText: {
    fontSize: 14,
    color: '#666',
  },
  benefitsSection: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
  },
  benefitsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  modalBenefitText: {
    fontSize: 12,
    color: '#666',
  },
});

export default HomeScreen;

