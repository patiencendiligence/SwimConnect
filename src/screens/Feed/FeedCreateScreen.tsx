import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../contexts/AuthContext';
import { createFeed } from '../../services/firestore';
import { pickImageFromLibrary, takePicture, checkBase64Size } from '../../services/image';
import { validateFeedContent } from '../../utils/validation';
import { MAX_FEED_LENGTH, FEED_TYPES } from '../../constants';
import { glassStyles } from '../../styles/glassmorphism';

const FeedCreateScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [feedType, setFeedType] = useState<'record' | 'product' | 'general'>('general');
  const [loading, setLoading] = useState(false);

  const handlePickImage = async () => {
    try {
      const base64 = await pickImageFromLibrary();
      if (base64) {
        // Base64 크기 검증
        const sizeCheck = checkBase64Size(base64);
        if (!sizeCheck.valid) {
          Alert.alert('알림', sizeCheck.message);
          return;
        }
        setImageUri(base64);
      }
    } catch (error) {
      Alert.alert('오류', '이미지를 선택하는데 실패했습니다.');
    }
  };

  const handleTakePhoto = async () => {
    try {
      const base64 = await takePicture();
      if (base64) {
        // Base64 크기 검증
        const sizeCheck = checkBase64Size(base64);
        if (!sizeCheck.valid) {
          Alert.alert('알림', sizeCheck.message);
          return;
        }
        setImageUri(base64);
      }
    } catch (error) {
      Alert.alert('오류', '사진을 촬영하는데 실패했습니다.');
    }
  };

  const handleSubmit = async () => {
    if (!user) return;

    if (content.trim().length === 0) {
      Alert.alert('알림', '내용을 입력해주세요.');
      return;
    }

    const validation = validateFeedContent(content);
    if (!validation.valid) {
      Alert.alert('알림', validation.message);
      return;
    }

    setLoading(true);
    try {
      // 피드 생성 (이미지는 Base64로 이미 저장됨)
      // undefined는 Firestore에서 지원하지 않으므로 필터링
      const feedData: any = {
        userId: user.id,
        userName: user.nickname,
        content: content.trim(),
        type: feedType,
        likes: [],
        comments: [],
        createdAt: new Date(),
      };

      // 선택적 필드는 값이 있을 때만 추가
      if (user.profileImage) {
        feedData.userProfileImage = user.profileImage;
      }
      
      if (imageUri) {
        feedData.image = imageUri;
      }

      await createFeed(feedData);

      // 상태 초기화
      setContent('');
      setImageUri(null);
      setFeedType('general');

      Alert.alert('성공', '피드가 등록되었습니다!', [
        {
          text: '확인',
          onPress: () => navigation.navigate('FeedList'),
        },
      ]);
    } catch (error) {
      console.error('피드 등록 에러:', error);
      const errorMessage = error instanceof Error ? error.message : '피드 등록에 실패했습니다.';
      Alert.alert('오류', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      '이미지 선택',
      '이미지를 어떻게 추가하시겠습니까?',
      [
        {
          text: '갤러리에서 선택',
          onPress: handlePickImage,
        },
        {
          text: '사진 촬영',
          onPress: handleTakePhoto,
        },
        {
          text: '취소',
          style: 'cancel',
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.content}>
        <Text style={styles.label}>피드 타입</Text>
        <View style={styles.typeContainer}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              feedType === 'general' && styles.typeButtonActive,
            ]}
            onPress={() => setFeedType('general')}
          >
            <Icon
              name="chatbubble"
              size={20}
              color={feedType === 'general' ? '#fff' : '#007AFF'}
            />
            <Text
              style={[
                styles.typeText,
                feedType === 'general' && styles.typeTextActive,
              ]}
            >
              일반
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeButton,
              feedType === 'record' && styles.typeButtonActive,
            ]}
            onPress={() => setFeedType('record')}
          >
            <Icon
              name="water"
              size={20}
              color={feedType === 'record' ? '#fff' : '#007AFF'}
            />
            <Text
              style={[
                styles.typeText,
                feedType === 'record' && styles.typeTextActive,
              ]}
            >
              수영 기록
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeButton,
              feedType === 'product' && styles.typeButtonActive,
            ]}
            onPress={() => setFeedType('product')}
          >
            <Icon
              name="cart"
              size={20}
              color={feedType === 'product' ? '#fff' : '#007AFF'}
            />
            <Text
              style={[
                styles.typeText,
                feedType === 'product' && styles.typeTextActive,
              ]}
            >
              수영 용품
            </Text>
          </TouchableOpacity>
        </View>

        {imageUri && (
          <View style={styles.imagePreview}>
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={() => setImageUri(null)}
            >
              <Icon name="close-circle" size={30} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity style={styles.imageButton} onPress={showImageOptions}>
          <Icon name="image" size={24} color="#007AFF" />
          <Text style={styles.imageButtonText}>이미지 추가</Text>
        </TouchableOpacity>

        <Text style={styles.label}>내용</Text>
        <TextInput
          style={styles.input}
          placeholder="수영 관련 정보를 공유해보세요 (최대 150자)"
          value={content}
          onChangeText={setContent}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          maxLength={MAX_FEED_LENGTH}
        />
        <Text style={styles.charCount}>
          {content.length}/{MAX_FEED_LENGTH}
        </Text>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? '등록 중...' : '피드 등록'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F4FD',
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
  typeContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 0,
    borderRadius: 20,
    padding: 12,
    marginRight: 8,
    shadowColor: 'rgba(255, 255, 255, 0.5)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
    gap: 10,
  },
  typeButtonActive: {
    backgroundColor: 'rgba(0, 122, 255, 0.85)',
    borderColor: 'rgba(255, 255, 255, 0.6)',
    shadowColor: '#007AFF',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  typeText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  typeTextActive: {
    color: '#fff',
  },
  imagePreview: {
    position: 'relative',
    marginBottom: 15,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 59, 48, 0.85)',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 122, 255, 0.2)',
    borderRadius: 20,
    borderStyle: 'dashed',
    padding: 20,
    marginBottom: 20,
    shadowColor: 'rgba(255, 255, 255, 0.5)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
    gap: 10,
  },
  imageButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    borderWidth: 0,
    borderRadius: 20,
    padding: 15,
    fontSize: 16,
    minHeight: 120,
    shadowColor: 'rgba(255, 255, 255, 0.5)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  charCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'rgba(0, 122, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 16,
    padding: 15,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: 'rgba(204, 204, 204, 0.5)',
    borderColor: 'rgba(255, 255, 255, 0.6)',
    shadowOpacity: 0.08,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FeedCreateScreen;

