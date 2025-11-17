import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Pool, Review } from '../../types';
import { getPoolById, getPoolReviews, createPoolReview, togglePoolFavorite } from '../../services/firestore';
import { useAuth } from '../../contexts/AuthContext';
import DetailedReviewModal, { ReviewData } from '../../components/DetailedReviewModal';
import { POOL_TYPE_NAMES } from '../../utils/poolFilters';

const PoolDetailScreen: React.FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const { poolId } = route.params;
  const { user } = useAuth();
  const [pool, setPool] = useState<Pool | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    loadPoolData();
    checkFavoriteStatus();
  }, [poolId]);

  const loadPoolData = async () => {
    try {
      const [poolData, reviewsData] = await Promise.all([
        getPoolById(poolId),
        getPoolReviews(poolId),
      ]);
      setPool(poolData);
      setReviews(reviewsData);
    } catch (error) {
      Alert.alert('오류', '수영장 정보를 불러오는데 실패했습니다.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const checkFavoriteStatus = () => {
    if (user && user.favoritePoolIds) {
      setIsFavorite(user.favoritePoolIds.includes(poolId));
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      Alert.alert('알림', '로그인이 필요합니다.');
      return;
    }

    try {
      const newStatus = await togglePoolFavorite(user.id, poolId);
      setIsFavorite(newStatus);
      Alert.alert(
        '성공',
        newStatus ? '즐겨찾기에 추가되었습니다.' : '즐겨찾기에서 제거되었습니다.'
      );
    } catch (error) {
      Alert.alert('오류', '즐겨찾기 처리에 실패했습니다.');
    }
  };

  const handleSubmitReview = async (reviewData: ReviewData) => {
    if (!user || !pool) return;

    try {
      const newReview: Omit<Review, 'id'> = {
        userId: user.id,
        userName: user.nickname,
        userProfileImage: user.profileImage,
        poolId: pool.id,
        ...reviewData,
        helpful: [],
        createdAt: new Date(),
      };

      await createPoolReview(newReview);
      Alert.alert('성공', '리뷰가 등록되었습니다!');
      loadPoolData(); // 리뷰 목록 새로고침
    } catch (error) {
      Alert.alert('오류', '리뷰 등록에 실패했습니다.');
    }
  };

  const calculateAverageRating = (category: keyof Review['ratings']): number => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => {
      const rating = review.ratings?.[category];
      return acc + (rating || 0);
    }, 0);
    return sum / reviews.length;
  };

  if (loading || !pool) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{pool.name}</Text>
            {pool.kickboardAvailable && (
              <View style={styles.kickboardBadge}>
                <Icon name="fitness" size={16} color="#34C759" />
                <Text style={styles.kickboardText}>킥판 사용 가능</Text>
              </View>
            )}
          </View>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={handleToggleFavorite}
          >
            <Icon
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={28}
              color={isFavorite ? '#FF3B30' : '#666'}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.poolType}>{POOL_TYPE_NAMES[pool.poolType as keyof typeof POOL_TYPE_NAMES]}</Text>
        <View style={styles.ratingContainer}>
          <Icon name="star" size={24} color="#FFD700" />
          <Text style={styles.rating}>{pool.rating.toFixed(1)}</Text>
          <Text style={styles.reviewCount}>({reviews.length}개 리뷰)</Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <Icon name="location" size={20} color="#007AFF" />
          <Text style={styles.infoText}>{pool.address}</Text>
        </View>
        {pool.price && (
          <View style={styles.infoRow}>
            <Icon name="cash" size={20} color="#007AFF" />
            <Text style={styles.infoText}>{pool.price.toLocaleString()}원</Text>
          </View>
        )}
        {pool.phoneNumber && (
          <View style={styles.infoRow}>
            <Icon name="call" size={20} color="#007AFF" />
            <Text style={styles.infoText}>{pool.phoneNumber}</Text>
          </View>
        )}
        {pool.operatingHours && (
          <View style={styles.infoRow}>
            <Icon name="time" size={20} color="#007AFF" />
            <Text style={styles.infoText}>{pool.operatingHours}</Text>
          </View>
        )}
      </View>

      {/* 수영장 상세 정보 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>수영장 정보</Text>
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Icon name="water" size={20} color="#007AFF" />
            <Text style={styles.detailLabel}>레인 수</Text>
            <Text style={styles.detailValue}>{pool.lanes}개</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="resize" size={20} color="#007AFF" />
            <Text style={styles.detailLabel}>수심</Text>
            <Text style={styles.detailValue}>{pool.depth}</Text>
          </View>
          {pool.temperature && (
            <View style={styles.detailItem}>
              <Icon name="thermometer" size={20} color="#007AFF" />
              <Text style={styles.detailLabel}>수온</Text>
              <Text style={styles.detailValue}>{pool.temperature}°C</Text>
            </View>
          )}
        </View>
      </View>

      {pool.facilities && pool.facilities.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>시설 정보</Text>
          <View style={styles.facilitiesContainer}>
            {pool.facilities.map((facility, index) => (
              <View key={index} style={styles.facilityBadge}>
                <Text style={styles.facilityText}>{facility}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* 운영 시간표 */}
      {pool.schedule && pool.schedule.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>운영 시간표</Text>
          <View style={styles.scheduleContainer}>
            {pool.schedule.map((day, index) => (
              <View key={index} style={styles.scheduleRow}>
                <Text style={styles.scheduleDayOfWeek}>{day.dayOfWeek}</Text>
                <View style={styles.scheduleDetails}>
                  {day.closedDay ? (
                    <Text style={styles.scheduleClosedText}>휴무</Text>
                  ) : (
                    <>
                      {day.freeSwim && day.freeSwim.length > 0 && (
                        <View style={styles.scheduleTimeBlock}>
                          <View style={styles.scheduleTypeLabel}>
                            <Icon name="water" size={14} color="#007AFF" />
                            <Text style={styles.scheduleTypeText}>자유수영</Text>
                          </View>
                          <View style={styles.scheduleTimeList}>
                            {day.freeSwim.map((time, i) => (
                              <Text key={i} style={styles.scheduleTimeText}>{time}</Text>
                            ))}
                          </View>
                        </View>
                      )}
                      {day.lessons && day.lessons.length > 0 && (
                        <View style={styles.scheduleTimeBlock}>
                          <View style={styles.scheduleTypeLabel}>
                            <Icon name="school" size={14} color="#34C759" />
                            <Text style={styles.scheduleTypeText}>강습</Text>
                          </View>
                          <View style={styles.scheduleTimeList}>
                            {day.lessons.map((time, i) => (
                              <Text key={i} style={styles.scheduleTimeText}>{time}</Text>
                            ))}
                          </View>
                        </View>
                      )}
                    </>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* 카테고리별 평균 평점 */}
      {reviews.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>세부 평가</Text>
          <View style={styles.categoryRatingsContainer}>
            <View style={styles.categoryRatingItem}>
              <Icon name="business" size={20} color="#007AFF" />
              <Text style={styles.categoryLabel}>시설</Text>
              <View style={styles.categoryRatingBar}>
                <View 
                  style={[
                    styles.categoryRatingFill, 
                    { width: `${(calculateAverageRating('facilities') / 5) * 100}%` }
                  ]} 
                />
              </View>
              <Text style={styles.categoryRatingValue}>{calculateAverageRating('facilities').toFixed(1)}</Text>
            </View>

            <View style={styles.categoryRatingItem}>
              <Icon name="water" size={20} color="#007AFF" />
              <Text style={styles.categoryLabel}>수질</Text>
              <View style={styles.categoryRatingBar}>
                <View 
                  style={[
                    styles.categoryRatingFill, 
                    { width: `${(calculateAverageRating('waterQuality') / 5) * 100}%` }
                  ]} 
                />
              </View>
              <Text style={styles.categoryRatingValue}>{calculateAverageRating('waterQuality').toFixed(1)}</Text>
            </View>

            <View style={styles.categoryRatingItem}>
              <Icon name="sparkles" size={20} color="#007AFF" />
              <Text style={styles.categoryLabel}>청결도</Text>
              <View style={styles.categoryRatingBar}>
                <View 
                  style={[
                    styles.categoryRatingFill, 
                    { width: `${(calculateAverageRating('cleanliness') / 5) * 100}%` }
                  ]} 
                />
              </View>
              <Text style={styles.categoryRatingValue}>{calculateAverageRating('cleanliness').toFixed(1)}</Text>
            </View>

            <View style={styles.categoryRatingItem}>
              <Icon name="car" size={20} color="#007AFF" />
              <Text style={styles.categoryLabel}>접근성</Text>
              <View style={styles.categoryRatingBar}>
                <View 
                  style={[
                    styles.categoryRatingFill, 
                    { width: `${(calculateAverageRating('accessibility') / 5) * 100}%` }
                  ]} 
                />
              </View>
              <Text style={styles.categoryRatingValue}>{calculateAverageRating('accessibility').toFixed(1)}</Text>
            </View>
          </View>
        </View>
      )}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>리뷰 ({reviews.length})</Text>
          <TouchableOpacity
            style={styles.writeButton}
            onPress={() => setReviewModalVisible(true)}
          >
            <Icon name="create" size={16} color="#fff" />
            <Text style={styles.writeButtonText}>작성하기</Text>
          </TouchableOpacity>
        </View>

        {reviews.length === 0 ? (
          <View style={styles.emptyReviews}>
            <Text style={styles.emptyText}>아직 리뷰가 없습니다</Text>
            <Text style={styles.emptySubtext}>첫 리뷰를 작성해보세요!</Text>
          </View>
        ) : (
          reviews.map(review => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewAuthor}>{review.userName}</Text>
                <Text style={styles.reviewDate}>
                  {review.createdAt.toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.reviewRating}>
                {[...Array(5)].map((_, i) => (
                  <Icon
                    key={i}
                    name={i < review.rating ? 'star' : 'star-outline'}
                    size={14}
                    color="#FFD700"
                  />
                ))}
                <Text style={styles.reviewRatingText}>{review.rating.toFixed(1)}</Text>
              </View>
              
              {/* 세부 평가 미리보기 */}
              {review.ratings && (
                <View style={styles.reviewCategoriesPreview}>
                  <View style={styles.reviewCategoryChip}>
                    <Icon name="business" size={12} color="#666" />
                    <Text style={styles.reviewCategoryText}>{review.ratings.facilities}</Text>
                  </View>
                  <View style={styles.reviewCategoryChip}>
                    <Icon name="water" size={12} color="#666" />
                    <Text style={styles.reviewCategoryText}>{review.ratings.waterQuality}</Text>
                  </View>
                  <View style={styles.reviewCategoryChip}>
                    <Icon name="sparkles" size={12} color="#666" />
                    <Text style={styles.reviewCategoryText}>{review.ratings.cleanliness}</Text>
                  </View>
                </View>
              )}
              
              <Text style={styles.reviewComment}>{review.comment}</Text>
            </View>
          ))
        )}
      </View>

      {/* 상세 리뷰 작성 모달 */}
      <DetailedReviewModal
        visible={reviewModalVisible}
        poolName={pool.name}
        onClose={() => setReviewModalVisible(false)}
        onSubmit={handleSubmitReview}
      />
    </ScrollView>
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
  header: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  kickboardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 199, 89, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  kickboardText: {
    fontSize: 13,
    color: '#34C759',
    fontWeight: '600',
  },
  favoriteButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  poolType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 8,
  },
  reviewCount: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  infoSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 20,
    marginTop: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 15,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 20,
    marginTop: 10,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  detailItem: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 6,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  writeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  writeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  categoryRatingsContainer: {
    gap: 12,
    marginTop: 10,
  },
  categoryRatingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  categoryLabel: {
    width: 70,
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  categoryRatingBar: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  categoryRatingFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  categoryRatingValue: {
    width: 35,
    textAlign: 'right',
    fontSize: 13,
    color: '#000',
    fontWeight: '600',
  },
  facilitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  facilityBadge: {
    backgroundColor: '#f9fcff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  facilityText: {
    color: '#007AFF',
    fontSize: 14,
  },
  scheduleContainer: {
    gap: 8,
  },
  scheduleRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'flex-start',
    borderWidth: 0,
  },
  scheduleDayOfWeek: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    width: 30,
    marginRight: 15,
  },
  scheduleDetails: {
    flex: 1,
    gap: 8,
  },
  scheduleClosedText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  scheduleTimeBlock: {
    gap: 6,
  },
  scheduleTypeLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  scheduleTypeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  scheduleTimeList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginLeft: 20,
  },
  scheduleTimeText: {
    fontSize: 12,
    color: '#007AFF',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  reviewCard: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
    paddingTop: 15,
    marginTop: 15,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  reviewRatingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
    marginLeft: 4,
  },
  reviewCategoriesPreview: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  reviewCategoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  reviewCategoryText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  reviewComment: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  emptyReviews: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 5,
  },
});

export default PoolDetailScreen;

