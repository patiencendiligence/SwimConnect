import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { POOL_TYPE_NAMES } from '../utils/poolFilters';
import { glassStyles } from '../styles/glassmorphism';

interface PoolFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  cities: string[];
  districts: string[];
  currentFilters: FilterState;
}

export interface FilterState {
  city?: string;
  district?: string;
  poolTypes: string[];
  kickboardAvailable?: boolean;
  minRating?: number;
}

const PoolFilterModal: React.FC<PoolFilterModalProps> = ({
  visible,
  onClose,
  onApply,
  cities,
  districts,
  currentFilters,
}) => {
  const [filters, setFilters] = useState<FilterState>(currentFilters);

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: FilterState = {
      poolTypes: [],
    };
    setFilters(resetFilters);
  };

  const togglePoolType = (type: string) => {
    setFilters(prev => ({
      ...prev,
      poolTypes: prev.poolTypes.includes(type)
        ? prev.poolTypes.filter(t => t !== type)
        : [...prev.poolTypes, type],
    }));
  };

  const setRating = (rating: number) => {
    setFilters(prev => ({
      ...prev,
      minRating: prev.minRating === rating ? undefined : rating,
    }));
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* 헤더 */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>필터</Text>
            <TouchableOpacity onPress={handleReset}>
              <Text style={styles.resetText}>초기화</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollContent}>
            {/* 지역 선택 */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>지역</Text>
              
              {cities.length > 0 && (
                <>
                  <Text style={styles.subTitle}>시</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.chipContainer}>
                      {cities.map(city => (
                        <TouchableOpacity
                          key={city}
                          style={[
                            styles.chip,
                            filters.city === city && styles.chipActive,
                          ]}
                          onPress={() => setFilters(prev => ({
                            ...prev,
                            city: prev.city === city ? undefined : city,
                            district: undefined, // 시 변경 시 구 초기화
                          }))}
                        >
                          <Text
                            style={[
                              styles.chipText,
                              filters.city === city && styles.chipTextActive,
                            ]}
                          >
                            {city}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                </>
              )}

              {filters.city && districts.length > 0 && (
                <>
                  <Text style={styles.subTitle}>구</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.chipContainer}>
                      {districts.map(district => (
                        <TouchableOpacity
                          key={district}
                          style={[
                            styles.chip,
                            filters.district === district && styles.chipActive,
                          ]}
                          onPress={() => setFilters(prev => ({
                            ...prev,
                            district: prev.district === district ? undefined : district,
                          }))}
                        >
                          <Text
                            style={[
                              styles.chipText,
                              filters.district === district && styles.chipTextActive,
                            ]}
                          >
                            {district}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                </>
              )}
            </View>

            {/* 수영장 타입 */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>수영장 타입</Text>
              <View style={styles.chipContainer}>
                {Object.entries(POOL_TYPE_NAMES).map(([key, name]) => (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.chip,
                      filters.poolTypes.includes(key) && styles.chipActive,
                    ]}
                    onPress={() => togglePoolType(key)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        filters.poolTypes.includes(key) && styles.chipTextActive,
                      ]}
                    >
                      {name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* 킥판 사용 가능 */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>킥판 사용 가능</Text>
              <TouchableOpacity
                style={[
                  styles.switchButton,
                  filters.kickboardAvailable && styles.switchButtonActive,
                ]}
                onPress={() => setFilters(prev => ({
                  ...prev,
                  kickboardAvailable: !prev.kickboardAvailable,
                }))}
              >
                <Icon
                  name={filters.kickboardAvailable ? 'checkmark-circle' : 'ellipse-outline'}
                  size={24}
                  color={filters.kickboardAvailable ? '#fff' : '#666'}
                />
                <Text
                  style={[
                    styles.switchText,
                    filters.kickboardAvailable && styles.switchTextActive,
                  ]}
                >
                  {filters.kickboardAvailable ? '킥판 사용 가능 수영장만' : '모든 수영장'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* 최소 평점 */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>최소 평점</Text>
              <View style={styles.ratingContainer}>
                {[4, 4.5, 5].map(rating => (
                  <TouchableOpacity
                    key={rating}
                    style={[
                      styles.ratingButton,
                      filters.minRating === rating && styles.ratingButtonActive,
                    ]}
                    onPress={() => setRating(rating)}
                  >
                    <Icon
                      name="star"
                      size={18}
                      color={filters.minRating === rating ? '#fff' : '#FFD700'}
                    />
                    <Text
                      style={[
                        styles.ratingText,
                        filters.minRating === rating && styles.ratingTextActive,
                      ]}
                    >
                      {rating}+
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* 적용 버튼 */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>필터 적용</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#f9fcff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  resetText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  scrollContent: {
    padding: 20,
  },
  filterSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  subTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginTop: 12,
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.2)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  chipActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  chipText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#fff',
  },
  switchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.2)',
    borderRadius: 12,
    padding: 15,
  },
  switchButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  switchText: {
    marginLeft: 10,
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
  },
  switchTextActive: {
    color: '#fff',
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  ratingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 6,
  },
  ratingButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  ratingText: {
    fontSize: 15,
    color: '#666',
    fontWeight: '600',
  },
  ratingTextActive: {
    color: '#fff',
  },
  footer: {
    padding: 20,
    paddingTop: 10,
  },
  applyButton: {
    backgroundColor: '#007AFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PoolFilterModal;

