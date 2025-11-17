import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Pool } from '../../types';
import { getPools, initializeSamplePools } from '../../services/firestore';
import { getCurrentLocation, requestLocationPermission, Location } from '../../services/location';
import { calculateDistance, formatDistance } from '../../utils/distance';
import { DEFAULT_SEARCH_RADIUS } from '../../constants';
import PoolFilterModal, { FilterState } from '../../components/PoolFilterModal';
import { 
  filterPools, 
  getUniqueCities, 
  getDistrictsInCity,
  POOL_TYPE_NAMES,
} from '../../utils/poolFilters';

const PoolListScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    poolTypes: [],
  });

  useEffect(() => {
    initializeData();
    initializeLocation();
  }, []);

  const initializeData = async () => {
    try {
      console.log('📍 샘플 수영장 데이터 초기화 시작...');
      // 샘플 데이터 초기화 (최초 1회만 실행됨)
      await initializeSamplePools();
      console.log('✅ 샘플 데이터 초기화 완료');
      
      // 수영장 데이터 로드
      await loadPools();
    } catch (error) {
      console.error('❌ 데이터 초기화 실패:', error);
      console.error('Firebase 설정을 확인해주세요!');
      Alert.alert(
        'Firebase 설정 필요',
        'Firebase 설정이 없습니다.\n\n1. Firebase Console에서 프로젝트 생성\n2. src/firebase.config.ts 파일 생성\n3. Firebase 설정 정보 입력',
        [{ text: '확인' }]
      );
    }
  };

  const initializeLocation = async () => {
    try {
      const hasPermission = await requestLocationPermission();
      if (hasPermission) {
        const location = await getCurrentLocation();
        setUserLocation(location);
      } else {
        Alert.alert('알림', '위치 권한이 필요합니다.');
      }
    } catch (error) {
      console.error('Location error:', error);
    }
  };

  const loadPools = async () => {
    try {
      console.log('📥 수영장 데이터 로드 시작...');
      const data = await getPools();
      console.log(`✅ 수영장 ${data.length}개 로드 완료:`, data.map(p => p.name));
      setPools(data);
    } catch (error) {
      console.error('❌ 수영장 로드 실패:', error);
      Alert.alert('오류', '수영장 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const getPoolDistance = (pool: Pool): number | null => {
    if (!userLocation) return null;
    return calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      pool.latitude,
      pool.longitude
    );
  };

  const getNearbyPools = (): Pool[] => {
    console.log(`🏊 총 수영장 수: ${pools.length}, 사용자 위치: ${userLocation ? '있음' : '없음'}`);
    
    // 필터 적용
    let filteredPools = filterPools(pools, filters, userLocation || undefined);
    console.log(`🔍 필터 적용 후: ${filteredPools.length}개`);
    
    if (!userLocation) {
      console.log('📍 위치 정보 없음 - 모든 수영장 표시');
      return filteredPools;
    }
    
    // 거리 계산 및 정렬 (거리 제한 없이 모두 표시)
    const poolsWithDistance = filteredPools
      .map(pool => ({
        ...pool,
        distance: getPoolDistance(pool),
      }))
      .filter(pool => pool.distance !== null)
      .sort((a, b) => (a.distance || 0) - (b.distance || 0));
    
    console.log(`📏 거리순 정렬 완료: ${poolsWithDistance.length}개`);
    return poolsWithDistance;
  };

  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const getActiveFilterCount = (): number => {
    let count = 0;
    if (filters.city) count++;
    if (filters.district) count++;
    if (filters.poolTypes.length > 0) count += filters.poolTypes.length;
    if (filters.kickboardAvailable) count++;
    if (filters.minRating) count++;
    return count;
  };

  const cities = getUniqueCities(pools);
  const districts = filters.city ? getDistrictsInCity(pools, filters.city) : [];

  const renderPoolItem = ({ item }: { item: Pool }) => {
    const distance = getPoolDistance(item);
    
    return (
      <TouchableOpacity
        style={styles.poolCard}
        onPress={() => navigation.navigate('PoolDetail', { poolId: item.id })}
      >
        <View style={styles.poolHeader}>
          <View style={styles.poolNameContainer}>
            <Text style={styles.poolName}>{item.name}</Text>
            {item.kickboardAvailable && (
              <View style={styles.kickboardBadge}>
                <Icon name="fitness" size={12} color="#34C759" />
                <Text style={styles.kickboardText}>킥판</Text>
              </View>
            )}
          </View>
          {distance !== null && (
            <View style={styles.distanceBadge}>
              <Icon name="location" size={12} color="#007AFF" />
              <Text style={styles.distanceText}>{formatDistance(distance)}</Text>
            </View>
          )}
        </View>
        
        <Text style={styles.poolAddress}>{item.address}</Text>
        <Text style={styles.poolType}>{POOL_TYPE_NAMES[item.poolType as keyof typeof POOL_TYPE_NAMES]}</Text>
        
        <View style={styles.poolFooter}>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
            <Text style={styles.reviewCount}>
              ({item.reviews?.length || 0}개 리뷰)
            </Text>
          </View>
          {item.price && (
            <Text style={styles.price}>{item.price.toLocaleString()}원</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  const nearbyPools = getNearbyPools();

  const activeFilterCount = getActiveFilterCount();

  return (
    <View style={styles.container}>
      {/* 상단 정보 바 */}
      <View style={styles.topBar}>
        {userLocation && (
          <View style={styles.locationInfo}>
            <Icon name="navigate" size={18} color="#007AFF" />
            <Text style={styles.locationText}>
              {nearbyPools.length}개의 수영장
            </Text>
          </View>
        )}
        
        {/* 필터 버튼 */}
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <Icon name="options" size={20} color="#007AFF" />
          <Text style={styles.filterButtonText}>필터</Text>
          {activeFilterCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* 활성 필터 표시 */}
      {activeFilterCount > 0 && (
        <View style={styles.activeFiltersContainer}>
          {filters.city && (
            <View style={styles.activeFilterChip}>
              <Text style={styles.activeFilterText}>{filters.city}</Text>
            </View>
          )}
          {filters.district && (
            <View style={styles.activeFilterChip}>
              <Text style={styles.activeFilterText}>{filters.district}</Text>
            </View>
          )}
          {filters.kickboardAvailable && (
            <View style={styles.activeFilterChip}>
              <Icon name="fitness" size={12} color="#34C759" />
              <Text style={styles.activeFilterText}>킥판</Text>
            </View>
          )}
          {filters.poolTypes.map(type => (
            <View key={type} style={styles.activeFilterChip}>
              <Text style={styles.activeFilterText}>
                {POOL_TYPE_NAMES[type as keyof typeof POOL_TYPE_NAMES]}
              </Text>
            </View>
          ))}
        </View>
      )}

      <FlatList
        data={nearbyPools}
        renderItem={renderPoolItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="sad-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>
              {activeFilterCount > 0 
                ? '필터 조건에 맞는 수영장이 없습니다' 
                : '근처에 수영장이 없습니다'}
            </Text>
            {activeFilterCount > 0 && (
              <TouchableOpacity 
                style={styles.resetButton}
                onPress={() => setFilters({ poolTypes: [] })}
              >
                <Text style={styles.resetButtonText}>필터 초기화</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />

      {/* 필터 모달 */}
      <PoolFilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApply={handleApplyFilters}
        cities={cities}
        districts={districts}
        currentFilters={filters}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F4FD',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 15,
    shadowColor: 'rgba(255, 255, 255, 0.5)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  locationText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.3)',
    gap: 10,
  },
  filterButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  filterBadge: {
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  activeFiltersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    paddingVertical: 10,
    gap: 10,
  },
  activeFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 10,
  },
  activeFilterText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  listContent: {
    padding: 15,
  },
  poolCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 0,
    shadowColor: 'rgba(255, 255, 255, 0.5)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  poolHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  poolNameContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  poolName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000',
  },
  kickboardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 199, 89, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 10,
  },
  kickboardText: {
    fontSize: 11,
    color: '#34C759',
    fontWeight: '600',
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fcff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 10,
  },
  distanceText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
  },
  poolAddress: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  poolType: {
    fontSize: 12,
    color: '#999',
    marginBottom: 10,
  },
  poolFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  reviewCount: {
    fontSize: 12,
    color: '#666',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 15,
    textAlign: 'center',
  },
  resetButton: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default PoolListScreen;

