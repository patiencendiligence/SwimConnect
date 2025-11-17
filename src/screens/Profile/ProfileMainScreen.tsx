import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../contexts/AuthContext';
import { LEVELS } from '../../constants';
import { calculateUserLevel, getNextLevelRequirements } from '../../utils/level';
import {
  getCurrentMonthStats,
  formatDistance,
  formatDuration,
} from '../../utils/swimStats';

const ProfileMainScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, signOut } = useAuth();

  if (!user) return null;

  const swimCount = user.swimRecords?.length || 0;
  const feedCount = 0; // TODO: 실제 피드 카운트
  const likeCount = 0; // TODO: 실제 좋아요 카운트

  const currentLevel = calculateUserLevel(swimCount, likeCount, feedCount);
  const nextLevelInfo = getNextLevelRequirements(
    currentLevel.level,
    swimCount,
    likeCount,
    feedCount
  );

  // 이번 달 통계
  const monthStats = useMemo(() => {
    return getCurrentMonthStats(user?.swimRecords || []);
  }, [user?.swimRecords]);

  const handleSignOut = () => {
    Alert.alert('로그아웃', '정말 로그아웃 하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '로그아웃',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut();
          } catch (error) {
            Alert.alert('오류', '로그아웃에 실패했습니다.');
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          {user.profileImage ? (
            <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Icon name="person" size={40} color="#999" />
            </View>
          )}
          <TouchableOpacity
            style={styles.editImageButton}
            onPress={() => navigation.navigate('ProfileEdit')}
          >
            <Icon name="camera" size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.nickname}>{user.nickname}</Text>
        <Text style={styles.email}>{user.email}</Text>

        <View style={styles.levelContainer}>
          <View style={[styles.levelBadge, { backgroundColor: `${currentLevel.color}15` }]}>
            <Icon name={currentLevel.icon} size={16} color={currentLevel.color} />
            <Text style={styles.levelText}>
              {currentLevel.name}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{swimCount}</Text>
          <Text style={styles.statLabel}>수영 횟수</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{user.friends?.length || 0}</Text>
          <Text style={styles.statLabel}>친구</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{feedCount}</Text>
          <Text style={styles.statLabel}>피드</Text>
        </View>
      </View>

      {nextLevelInfo.nextLevel && (
        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>다음 등급까지</Text>
          <View style={styles.progressItem}>
            <Text style={styles.progressLabel}>수영 기록</Text>
            <Text style={styles.progressValue}>
              {swimCount} / {nextLevelInfo.nextLevel.minSwimCount}
            </Text>
          </View>
          <View style={styles.progressItem}>
            <Text style={styles.progressLabel}>받은 좋아요</Text>
            <Text style={styles.progressValue}>
              {likeCount} / {nextLevelInfo.nextLevel.minLikeCount}
            </Text>
          </View>
          <View style={styles.progressItem}>
            <Text style={styles.progressLabel}>작성한 피드</Text>
            <Text style={styles.progressValue}>
              {feedCount} / {nextLevelInfo.nextLevel.minFeedCount}
            </Text>
          </View>
        </View>
      )}

      {/* 수영 기록 카드 (강조) */}
      <View style={styles.quickAccessSection}>
        <TouchableOpacity
          style={styles.swimRecordCard}
          onPress={() => navigation.navigate('SwimRecords')}
        >
          <View style={styles.swimRecordHeader}>
            <View style={styles.swimRecordTitleRow}>
              <Icon name="water" size={28} color="#007AFF" />
              <Text style={styles.swimRecordTitle}>내 수영 기록</Text>
            </View>
            <Icon name="chevron-forward" size={24} color="#007AFF" />
          </View>

          {monthStats ? (
            <View style={styles.swimRecordStats}>
              <View style={styles.swimRecordStatItem}>
                <Text style={styles.swimRecordStatLabel}>이번 달</Text>
                <Text style={styles.swimRecordStatValue}>
                  {formatDistance(monthStats.totalDistance)}
                </Text>
              </View>
              <View style={styles.swimRecordStatDivider} />
              <View style={styles.swimRecordStatItem}>
                <Text style={styles.swimRecordStatLabel}>총 시간</Text>
                <Text style={styles.swimRecordStatValue}>
                  {formatDuration(monthStats.totalDuration)}
                </Text>
              </View>
              <View style={styles.swimRecordStatDivider} />
              <View style={styles.swimRecordStatItem}>
                <Text style={styles.swimRecordStatLabel}>수영 횟수</Text>
                <Text style={styles.swimRecordStatValue}>{monthStats.swimCount}회</Text>
              </View>
            </View>
          ) : (
            <View style={styles.swimRecordEmpty}>
              <Text style={styles.swimRecordEmptyText}>아직 수영 기록이 없습니다</Text>
              <Text style={styles.swimRecordEmptySubtext}>첫 수영을 시작해보세요! 🏊‍♂️</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('ProfileEdit')}
        >
          <Icon name="create-outline" size={24} color="#007AFF" />
          <Text style={styles.menuText}>프로필 수정</Text>
          <Icon name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Friends')}
        >
          <Icon name="people-outline" size={24} color="#007AFF" />
          <Text style={styles.menuText}>친구 관리</Text>
          <Icon name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Settings')}
        >
          <Icon name="settings-outline" size={24} color="#007AFF" />
          <Text style={styles.menuText}>설정</Text>
          <Icon name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleSignOut}>
          <Icon name="log-out-outline" size={24} color="#FF3B30" />
          <Text style={[styles.menuText, styles.menuTextDanger]}>로그아웃</Text>
          <Icon name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F4FD',
  },
  header: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 30,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editImageButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#007AFF',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  nickname: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  levelText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 20,
    marginTop: 10,
    borderRadius: 0,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  progressSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
  },
  progressItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: '#666',
  },
  progressValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  quickAccessSection: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  swimRecordCard: {
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
  swimRecordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  swimRecordTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  swimRecordTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  swimRecordStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  swimRecordStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  swimRecordStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  swimRecordStatLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  swimRecordStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  swimRecordEmpty: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  swimRecordEmptyText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  swimRecordEmptySubtext: {
    fontSize: 12,
    color: '#999',
  },
  menuContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginTop: 10,
    marginBottom: 30,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    gap: 10,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  menuTextDanger: {
    color: '#FF3B30',
  },
});

export default ProfileMainScreen;

