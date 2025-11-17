import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface DetailedReviewModalProps {
  visible: boolean;
  poolName: string;
  onClose: () => void;
  onSubmit: (review: ReviewData) => void;
}

export interface ReviewData {
  rating: number;
  comment: string;
  ratings: {
    facilities: number;
    waterQuality: number;
    instructor?: number;
    cleanliness: number;
    accessibility: number;
  };
}

interface CategoryRating {
  key: keyof ReviewData['ratings'];
  label: string;
  icon: string;
  required: boolean;
}

const RATING_CATEGORIES: CategoryRating[] = [
  { key: 'facilities', label: '시설 (샤워실, 탈의실 등)', icon: 'business', required: true },
  { key: 'waterQuality', label: '수질', icon: 'water', required: true },
  { key: 'instructor', label: '강습 품질', icon: 'school', required: false },
  { key: 'cleanliness', label: '청결도', icon: 'sparkles', required: true },
  { key: 'accessibility', label: '접근성 (교통, 주차 등)', icon: 'car', required: true },
];

const DetailedReviewModal: React.FC<DetailedReviewModalProps> = ({
  visible,
  poolName,
  onClose,
  onSubmit,
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [categoryRatings, setCategoryRatings] = useState<ReviewData['ratings']>({
    facilities: 0,
    waterQuality: 0,
    cleanliness: 0,
    accessibility: 0,
  });

  const handleSubmit = () => {
    // 전체 평점 확인
    if (rating === 0) {
      Alert.alert('알림', '전체 평점을 선택해주세요.');
      return;
    }

    // 필수 카테고리 평점 확인
    if (
      categoryRatings.facilities === 0 ||
      categoryRatings.waterQuality === 0 ||
      categoryRatings.cleanliness === 0 ||
      categoryRatings.accessibility === 0
    ) {
      Alert.alert('알림', '필수 항목의 평점을 모두 선택해주세요.');
      return;
    }

    // 코멘트 확인
    if (comment.trim().length < 10) {
      Alert.alert('알림', '리뷰는 최소 10자 이상 작성해주세요.');
      return;
    }

    const reviewData: ReviewData = {
      rating,
      comment: comment.trim(),
      ratings: categoryRatings,
    };

    onSubmit(reviewData);
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setRating(0);
    setComment('');
    setCategoryRatings({
      facilities: 0,
      waterQuality: 0,
      cleanliness: 0,
      accessibility: 0,
    });
  };

  const setCategoryRating = (key: keyof ReviewData['ratings'], value: number) => {
    setCategoryRatings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const renderStars = (currentRating: number, onRate: (rating: number) => void) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map(star => (
          <TouchableOpacity key={star} onPress={() => onRate(star)}>
            <Icon
              name={star <= currentRating ? 'star' : 'star-outline'}
              size={28}
              color="#FFD700"
            />
          </TouchableOpacity>
        ))}
      </View>
    );
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
            <Text style={styles.headerTitle}>리뷰 작성</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.scrollContent}>
            {/* 수영장 이름 */}
            <Text style={styles.poolName}>{poolName}</Text>

            {/* 전체 평점 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>전체 평점 *</Text>
              {renderStars(rating, setRating)}
            </View>

            {/* 카테고리별 평점 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>세부 평가</Text>
              {RATING_CATEGORIES.map(category => (
                <View key={category.key} style={styles.categoryItem}>
                  <View style={styles.categoryHeader}>
                    <Icon name={category.icon} size={20} color="#007AFF" />
                    <Text style={styles.categoryLabel}>
                      {category.label} {category.required && <Text style={styles.required}>*</Text>}
                    </Text>
                  </View>
                  {renderStars(
                    categoryRatings[category.key] || 0,
                    (value) => setCategoryRating(category.key, value)
                  )}
                </View>
              ))}
            </View>

            {/* 리뷰 내용 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>리뷰 내용 *</Text>
              <TextInput
                style={styles.commentInput}
                placeholder="이 수영장에 대한 자세한 경험을 공유해주세요 (최소 10자)"
                placeholderTextColor="#999"
                multiline
                value={comment}
                onChangeText={setComment}
                maxLength={500}
              />
              <Text style={styles.charCount}>{comment.length}/500</Text>
            </View>
          </ScrollView>

          {/* 제출 버튼 */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>리뷰 등록</Text>
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
    maxHeight: '90%',
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
  scrollContent: {
    padding: 20,
  },
  poolName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryLabel: {
    fontSize: 14,
    color: '#000',
    marginLeft: 8,
    flex: 1,
  },
  required: {
    color: '#FF3B30',
  },
  commentInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 16,
    padding: 15,
    fontSize: 15,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
  footer: {
    padding: 20,
    paddingTop: 10,
  },
  submitButton: {
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
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DetailedReviewModal;

