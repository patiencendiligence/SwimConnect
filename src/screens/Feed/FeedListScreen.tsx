import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Feed } from '../../types';
import { getFeeds, toggleLike } from '../../services/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { glassStyles } from '../../styles/glassmorphism';

const FeedListScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadFeeds();
  }, []);

  const loadFeeds = async () => {
    try {
      const data = await getFeeds();
      setFeeds(data);
    } catch (error) {
      Alert.alert('오류', '피드를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadFeeds();
  };

  const handleLike = async (feedId: string) => {
    if (!user) return;

    try {
      await toggleLike(feedId, user.id);
      
      // 로컬 상태 업데이트
      setFeeds(prevFeeds =>
        prevFeeds.map(feed => {
          if (feed.id === feedId) {
            const hasLiked = feed.likes.includes(user.id);
            return {
              ...feed,
              likes: hasLiked
                ? feed.likes.filter(id => id !== user.id)
                : [...feed.likes, user.id],
            };
          }
          return feed;
        })
      );
    } catch (error) {
      Alert.alert('오류', '좋아요 처리에 실패했습니다.');
    }
  };

  const renderFeedItem = ({ item }: { item: Feed }) => {
    const isLiked = user ? item.likes.includes(user.id) : false;
    const feedTypeIcon =
      item.type === 'record'
        ? 'water'
        : item.type === 'product'
        ? 'cart'
        : 'chatbubble';

    return (
      <TouchableOpacity
        style={styles.feedCard}
        onPress={() => navigation.navigate('FeedDetail', { feedId: item.id })}
      >
        <View style={styles.feedHeader}>
          <View style={styles.userInfo}>
            {item.userProfileImage ? (
              <Image
                source={{ uri: item.userProfileImage }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Icon name="person" size={20} color="#999" />
              </View>
            )}
            <View>
              <Text style={styles.userName}>{item.userName}</Text>
              <Text style={styles.feedDate}>
                {item.createdAt.toLocaleDateString()}
              </Text>
            </View>
          </View>
          <View style={styles.feedTypeBadge}>
            <Icon name={feedTypeIcon} size={16} color="#007AFF" />
          </View>
        </View>

        {item.image && (
          <Image source={{ uri: item.image }} style={styles.feedImage} />
        )}

        <Text style={styles.feedContent}>{item.content}</Text>

        <View style={styles.feedFooter}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleLike(item.id)}
          >
            <Icon
              name={isLiked ? 'heart' : 'heart-outline'}
              size={20}
              color={isLiked ? '#FF3B30' : '#666'}
            />
            <Text
              style={[styles.actionText, isLiked && styles.actionTextActive]}
            >
              {item.likes.length}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Icon name="chatbubble-outline" size={20} color="#666" />
            <Text style={styles.actionText}>{item.comments?.length || 0}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Icon name="share-social-outline" size={20} color="#666" />
          </TouchableOpacity>
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

  return (
    <View style={styles.container}>
      <FlatList
        data={feeds}
        renderItem={renderFeedItem}
        keyExtractor={item => item.id}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="newspaper-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>아직 피드가 없습니다</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('FeedCreate')}
      >
        <Icon name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F4FD', // 좀 더 진한 파란색 배경 (glassmorphism 효과를 위해)
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 15,
  },
  feedCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 24,
    borderWidth: 0,
    padding: 15,
    marginBottom: 12,
    shadowColor: 'rgba(255, 255, 255, 0.5)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  feedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 0,
    shadowColor: 'rgba(255, 255, 255, 0.5)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 0,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  feedDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  feedTypeBadge: {
    backgroundColor: 'rgba(227, 242, 253, 0.5)',
    borderWidth: 0,
    padding: 6,
    borderRadius: 12,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  feedImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  feedContent: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    marginBottom: 12,
  },
  feedFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    gap: 10,
  },
  actionText: {
    fontSize: 14,
    color: '#666',
  },
  actionTextActive: {
    color: '#FF3B30',
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
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 122, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
});

export default FeedListScreen;

