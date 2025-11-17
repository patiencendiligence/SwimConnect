import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../contexts/AuthContext';
import { createReview } from '../../services/firestore';
import { validateText } from '../../utils/validation';

const PoolReviewScreen: React.FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const { poolId } = route.params;
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!user) return;

    if (comment.trim().length === 0) {
      Alert.alert('알림', '리뷰 내용을 입력해주세요.');
      return;
    }

    const validation = validateText(comment);
    if (!validation.valid) {
      Alert.alert('알림', validation.message);
      return;
    }

    setLoading(true);
    try {
      await createReview({
        userId: user.id,
        poolId,
        rating,
        comment: comment.trim(),
        createdAt: new Date(),
      });
      
      Alert.alert('성공', '리뷰가 등록되었습니다!', [
        {
          text: '확인',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('오류', '리뷰 등록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.label}>평점을 선택해주세요</Text>
        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map(star => (
            <TouchableOpacity
              key={star}
              onPress={() => setRating(star)}
              style={styles.starButton}
            >
              <Icon
                name={star <= rating ? 'star' : 'star-outline'}
                size={40}
                color="#FFD700"
              />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>리뷰 작성</Text>
        <TextInput
          style={styles.input}
          placeholder="수영장에 대한 솔직한 리뷰를 작성해주세요"
          value={comment}
          onChangeText={setComment}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          maxLength={500}
        />
        <Text style={styles.charCount}>{comment.length}/500</Text>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? '등록 중...' : '리뷰 등록'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  starButton: {
    padding: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    minHeight: 150,
  },
  charCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#efefef',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PoolReviewScreen;

