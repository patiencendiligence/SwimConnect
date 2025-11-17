import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../contexts/AuthContext';
import { SwimRecord } from '../../types';
import { STROKE_NAMES } from '../../utils/swimStats';

type StrokeType = 'freestyle' | 'backstroke' | 'breaststroke' | 'butterfly' | 'medley';

const SwimRecordInputScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const [date] = useState(new Date()); // 오늘 날짜 고정
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [strokeType, setStrokeType] = useState<StrokeType>('freestyle');

  const handleSubmit = async () => {
    if (!user) return;

    // 유효성 검사
    const distanceNum = parseFloat(distance);
    const durationNum = parseFloat(duration);

    if (!distance || isNaN(distanceNum) || distanceNum <= 0) {
      Alert.alert('오류', '유효한 거리를 입력해주세요.');
      return;
    }

    if (!duration || isNaN(durationNum) || durationNum <= 0) {
      Alert.alert('오류', '유효한 시간을 입력해주세요.');
      return;
    }

    // 칼로리 계산 (대략적인 공식)
    // 거리(m) * 0.3 (수영은 1m당 약 0.3 칼로리 소모)
    const calories = Math.round(distanceNum * 0.3);

    // 평균 페이스 계산 (초/100m)
    const avgPace = Math.round((durationNum * 60) / (distanceNum / 100));

    const newRecord: Omit<SwimRecord, 'id'> = {
      userId: user.id,
      distance: distanceNum,
      duration: durationNum,
      date: date,
      strokeType: strokeType,
      calories: calories,
      avgPace: avgPace,
    };

    try {
      // TODO: Firestore에 저장
      // await createSwimRecord(newRecord);
      
      Alert.alert('성공', '수영 기록이 등록되었습니다!', [
        {
          text: '확인',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('오류', '수영 기록 등록에 실패했습니다.');
      console.error(error);
    }
  };

  const strokeOptions: { value: StrokeType; label: string; icon: string }[] = [
    { value: 'freestyle', label: '자유형', icon: 'water' },
    { value: 'backstroke', label: '배영', icon: 'water' },
    { value: 'breaststroke', label: '평영', icon: 'water' },
    { value: 'butterfly', label: '접영', icon: 'water' },
    { value: 'medley', label: '혼영', icon: 'water' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Icon name="water" size={40} color="#007AFF" />
        <Text style={styles.headerTitle}>수영 기록 추가</Text>
        <Text style={styles.headerSubtitle}>오늘의 수영 기록을 등록하세요</Text>
      </View>

      <View style={styles.form}>
        {/* 날짜 (오늘 고정) */}
        <View style={styles.formSection}>
          <Text style={styles.label}>날짜</Text>
          <View style={styles.dateButton}>
            <Icon name="calendar-outline" size={20} color="#007AFF" />
            <Text style={styles.dateText}>
              {date.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })} (오늘)
            </Text>
          </View>
        </View>

        {/* 거리 입력 */}
        <View style={styles.formSection}>
          <Text style={styles.label}>거리 (m)</Text>
          <View style={styles.inputContainer}>
            <Icon name="trending-up-outline" size={20} color="#666" />
            <TextInput
              style={styles.input}
              value={distance}
              onChangeText={setDistance}
              placeholder="예: 1000"
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
            <Text style={styles.unit}>m</Text>
          </View>
        </View>

        {/* 시간 입력 */}
        <View style={styles.formSection}>
          <Text style={styles.label}>시간 (분)</Text>
          <View style={styles.inputContainer}>
            <Icon name="time-outline" size={20} color="#666" />
            <TextInput
              style={styles.input}
              value={duration}
              onChangeText={setDuration}
              placeholder="예: 30"
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
            <Text style={styles.unit}>분</Text>
          </View>
        </View>

        {/* 영법 선택 */}
        <View style={styles.formSection}>
          <Text style={styles.label}>영법</Text>
          <View style={styles.strokeContainer}>
            {strokeOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.strokeButton,
                  strokeType === option.value && styles.strokeButtonActive,
                ]}
                onPress={() => setStrokeType(option.value)}
              >
                <Text
                  style={[
                    styles.strokeButtonText,
                    strokeType === option.value && styles.strokeButtonTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 미리보기 */}
        {distance && duration && (
          <View style={styles.previewSection}>
            <Text style={styles.previewTitle}>예상 정보</Text>
            <View style={styles.previewGrid}>
              <View style={styles.previewItem}>
                <Icon name="flame-outline" size={20} color="#FF9500" />
                <Text style={styles.previewLabel}>소모 칼로리</Text>
                <Text style={styles.previewValue}>
                  약 {Math.round(parseFloat(distance) * 0.3)} kcal
                </Text>
              </View>
              <View style={styles.previewItem}>
                <Icon name="speedometer-outline" size={20} color="#34C759" />
                <Text style={styles.previewLabel}>평균 페이스</Text>
                <Text style={styles.previewValue}>
                  {Math.floor(
                    (parseFloat(duration) * 60) / (parseFloat(distance) / 100) / 60
                  )}:
                  {String(
                    Math.round(
                      ((parseFloat(duration) * 60) / (parseFloat(distance) / 100)) % 60
                    )
                  ).padStart(2, '0')}
                  /100m
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* 제출 버튼 */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Icon name="checkmark-circle" size={24} color="#fff" />
          <Text style={styles.submitButtonText}>기록 저장</Text>
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
    backgroundColor: 'rgba(0, 122, 255, 0.85)',
    padding: 40,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 15,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 8,
  },
  form: {
    padding: 20,
  },
  formSection: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 20,
    padding: 15,
    gap: 10,
    borderWidth: 0,
  },
  dateText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
    gap: 10,
    borderWidth: 0,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    paddingVertical: 10,
  },
  unit: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  strokeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  strokeButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 0,
  },
  strokeButtonActive: {
    backgroundColor: '#007AFF',
  },
  strokeButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  strokeButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  previewSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
    borderWidth: 0,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 15,
  },
  previewGrid: {
    flexDirection: 'row',
    gap: 15,
  },
  previewItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  previewLabel: {
    fontSize: 12,
    color: '#666',
  },
  previewValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 20,
    padding: 18,
    gap: 10,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default SwimRecordInputScreen;

