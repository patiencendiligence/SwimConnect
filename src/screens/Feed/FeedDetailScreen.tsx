import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../contexts/AuthContext';
import firestore from '@react-native-firebase/firestore';
import { Feed } from '../../types';
import { toggleLike } from '../../services/firestore';
import { glassStyles } from '../../styles/glassmorphism';

const FeedDetailScreen: React.FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const { feedId } = route.params;
  const { user } = useAuth();
  const [feed, setFeed] = useState<Feed | null>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadFeed();
  }, [feedId]);

  const loadFeed = async () => {
    try {
      const doc = await firestore().collection('feeds').doc(feedId).get();
      
      if (doc.exists) {
        const data = doc.data();
        setFeed({
          ...data,
          id: doc.id,
          createdAt: data?.createdAt?.toDate() || new Date(),
        } as Feed);
      } else {
        Alert.alert('오류', '피드를 찾을 수 없습니다.');
        navigation.goBack();
      }
    } catch (error) {
      console.error('피드 로드 에러:', error);
      Alert.alert('오류', '피드를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user || !feed) return;

    try {
      await toggleLike(feedId, user.id);
      
      // 로컬 상태 업데이트
      const hasLiked = feed.likes.includes(user.id);
      setFeed({
        ...feed,
        likes: hasLiked
          ? feed.likes.filter(id => id !== user.id)
          : [...feed.likes, user.id],
      });
    } catch (error) {
      Alert.alert('오류', '좋아요 처리에 실패했습니다.');
    }
  };

  const handleSubmitComment = async () => {
    if (!user || !feed || !comment.trim()) return;

    setSubmitting(true);
    try {
      const newComment = {
        id: `${Date.now()}_${user.id}`, // 고유 ID 생성
        userId: user.id,
        userName: user.nickname,
        content: comment.trim(),
        createdAt: new Date(),
      };

      await firestore()
        .collection('feeds')
        .doc(feedId)
        .update({
          comments: firestore.FieldValue.arrayUnion(newComment),
        });

      // 로컬 상태 업데이트
      setFeed({
        ...feed,
        comments: [...(feed.comments || []), newComment],
      });
      
      setComment('');
      Alert.alert('성공', '댓글이 등록되었습니다.');
    } catch (error) {
      console.error('댓글 등록 에러:', error);
      Alert.alert('오류', '댓글 등록에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!feed) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>피드를 불러올 수 없습니다.</Text>
      </View>
    );
  }

  const isLiked = user ? feed.likes.includes(user.id) : false;
  const feedTypeIcon =
    feed.type === 'record'
      ? 'water'
      : feed.type === 'product'
      ? 'cart'
      : 'chatbubble';

  const feedTypeName =
    feed.type === 'record'
      ? '수영 기록'
      : feed.type === 'product'
      ? '수영 용품'
      : '일반';

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.content}>
        {/* 작성자 정보 */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            {feed.userProfileImage ? (
              <Image
                source={{ uri: feed.userProfileImage }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Icon name="person" size={24} color="#999" />
              </View>
            )}
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{feed.userName}</Text>
              <Text style={styles.feedDate}>
                {feed.createdAt.toLocaleDateString()} {feed.createdAt.toLocaleTimeString()}
              </Text>
            </View>
          </View>
          <View style={styles.typeBadge}>
            <Icon name={feedTypeIcon} size={16} color="#007AFF" />
            <Text style={styles.typeBadgeText}>{feedTypeName}</Text>
          </View>
        </View>

        {/* 피드 이미지 */}
        {feed.image && (
          <Image source={{ uri: feed.image }} style={styles.feedImage} />
        )}

        {/* 피드 내용 */}
        <Text style={styles.content}>{feed.content}</Text>

        {/* 좋아요 & 댓글 개수 */}
        <View style={styles.stats}>
          <TouchableOpacity style={styles.statButton} onPress={handleLike}>
            <Icon
              name={isLiked ? 'heart' : 'heart-outline'}
              size={24}
              color={isLiked ? '#FF3B30' : '#666'}
            />
            <Text style={[styles.statText, isLiked && styles.statTextActive]}>
              좋아요 {feed.likes.length}
            </Text>
          </TouchableOpacity>

          <View style={styles.statButton}>
            <Icon name="chatbubble-outline" size={24} color="#666" />
            <Text style={styles.statText}>
              댓글 {feed.comments?.length || 0}
            </Text>
          </View>
        </View>

        {/* 댓글 목록 */}
        <View style={styles.commentsSection}>
          <Text style={styles.sectionTitle}>댓글</Text>
          
          {feed.comments && feed.comments.length > 0 ? (
            feed.comments.map((comment, index) => (
              <View key={index} style={styles.commentItem}>
                <View style={styles.commentHeader}>
                  <Text style={styles.commentUserName}>{comment.userName}</Text>
                  <Text style={styles.commentDate}>
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={styles.commentContent}>{comment.content}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noComments}>아직 댓글이 없습니다.</Text>
          )}
        </View>
      </ScrollView>

      {/* 댓글 입력 */}
      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="댓글을 입력하세요..."
          value={comment}
          onChangeText={setComment}
          multiline
          maxLength={200}
        />
        <TouchableOpacity
          style={[
            styles.submitButton,
            (!comment.trim() || submitting) && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmitComment}
          disabled={!comment.trim() || submitting}
        >
          <Icon name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    backgroundColor: '#E8F4FD',
  },
  errorText: {
    fontSize: 16,
    color: '#999',
  },
  content: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderBottomWidth: 0,
    shadowColor: 'rgba(255, 255, 255, 0.5)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 0,
    shadowColor: 'rgba(255, 255, 255, 0.5)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 0,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  feedDate: {
    fontSize: 13,
    color: '#999',
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(227, 242, 253, 0.5)',
    borderWidth: 0,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
    gap: 10,
  },
  typeBadgeText: {
    fontSize: 13,
    color: '#007AFF',
    fontWeight: '600',
  },
  feedImage: {
    width: '100%',
    height: 300,
  },
  feedContent: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    padding: 15,
  },
  stats: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  statButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    gap: 10,
  },
  statText: {
    fontSize: 15,
    color: '#666',
  },
  statTextActive: {
    color: '#FF3B30',
  },
  commentsSection: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 15,
  },
  commentItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 0,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: 'rgba(255, 255, 255, 0.5)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  commentUserName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  commentDate: {
    fontSize: 12,
    color: '#999',
  },
  commentContent: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  noComments: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 10,
    borderTopWidth: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    shadowColor: 'rgba(255, 255, 255, 0.5)',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  commentInput: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    borderWidth: 0,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 100,
    marginRight: 10,
    shadowColor: 'rgba(255, 255, 255, 0.5)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  submitButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 122, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: 'rgba(204, 204, 204, 0.5)',
    shadowOpacity: 0.08,
  },
});

export default FeedDetailScreen;
