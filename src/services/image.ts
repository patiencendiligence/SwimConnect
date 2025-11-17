import { launchCamera, launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
import { Platform, PermissionsAndroid } from 'react-native';
import RNFS from 'react-native-fs';

// 카메라 권한 요청
export const requestCameraPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: '카메라 권한 요청',
        message: '사진을 촬영하기 위해 카메라 권한이 필요합니다.',
        buttonNeutral: '나중에',
        buttonNegative: '취소',
        buttonPositive: '확인',
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true; // iOS는 Info.plist에서 처리
};

// 이미지를 Base64로 변환
export const convertImageToBase64 = async (uri: string): Promise<string> => {
  try {
    // file:// 프로토콜 제거
    const path = uri.replace('file://', '');
    const base64String = await RNFS.readFile(path, 'base64');
    return `data:image/jpeg;base64,${base64String}`;
  } catch (error) {
    console.error('Error converting to base64:', error);
    throw error;
  }
};

// 갤러리에서 이미지 선택 (Base64로 변환)
export const pickImageFromLibrary = async (): Promise<string | null> => {
  const result: ImagePickerResponse = await launchImageLibrary({
    mediaType: 'photo',
    maxWidth: 800,      // 크기 제한 (Firestore 1MB 제한)
    maxHeight: 800,
    quality: 0.5,       // 압축률 높임
    includeBase64: false, // 자체 변환 사용
  });

  if (result.didCancel || !result.assets || result.assets.length === 0) {
    return null;
  }

  const uri = result.assets[0].uri;
  if (!uri) return null;

  // Base64로 변환
  return await convertImageToBase64(uri);
};

// 카메라로 사진 촬영 (Base64로 변환)
export const takePicture = async (): Promise<string | null> => {
  const hasPermission = await requestCameraPermission();
  
  if (!hasPermission) {
    throw new Error('Camera permission denied');
  }

  const result: ImagePickerResponse = await launchCamera({
    mediaType: 'photo',
    maxWidth: 800,
    maxHeight: 800,
    quality: 0.5,
    saveToPhotos: true,
    includeBase64: false,
  });

  if (result.didCancel || !result.assets || result.assets.length === 0) {
    return null;
  }

  const uri = result.assets[0].uri;
  if (!uri) return null;

  // Base64로 변환
  return await convertImageToBase64(uri);
};

// Base64 이미지 크기 검증 (Firestore 1MB 제한)
export const validateBase64Size = (base64String: string): boolean => {
  // Base64 문자열 크기 계산 (bytes)
  const sizeInBytes = Math.ceil((base64String.length * 3) / 4);
  const maxSizeInBytes = 800 * 1024; // 800KB (안전 마진 포함)
  
  return sizeInBytes <= maxSizeInBytes;
};

// Base64 이미지가 너무 크면 에러 메시지 반환
export const checkBase64Size = (base64String: string): { valid: boolean; message?: string } => {
  if (!validateBase64Size(base64String)) {
    return {
      valid: false,
      message: '이미지가 너무 큽니다. 더 작은 이미지를 선택해주세요.',
    };
  }
  return { valid: true };
};

