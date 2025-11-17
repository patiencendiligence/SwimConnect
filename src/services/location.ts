import Geolocation from 'react-native-geolocation-service';
import { Platform, PermissionsAndroid } from 'react-native';

export interface Location {
  latitude: number;
  longitude: number;
}

// 위치 권한 요청
export const requestLocationPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'ios') {
    const auth = await Geolocation.requestAuthorization('whenInUse');
    return auth === 'granted';
  }

  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: '위치 권한 요청',
        message: '근처 수영장을 찾기 위해 위치 정보가 필요합니다.',
        buttonNeutral: '나중에',
        buttonNegative: '취소',
        buttonPositive: '확인',
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }

  return false;
};

// 현재 위치 가져오기
export const getCurrentLocation = (): Promise<Location> => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  });
};

// 위치 추적 시작
export const watchLocation = (
  onLocationUpdate: (location: Location) => void,
  onError: (error: any) => void
): number => {
  return Geolocation.watchPosition(
    (position) => {
      onLocationUpdate({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    },
    onError,
    {
      enableHighAccuracy: true,
      distanceFilter: 10, // 10m 이동 시 업데이트
      interval: 5000, // 5초마다 체크
      fastestInterval: 2000,
    }
  );
};

// 위치 추적 중지
export const stopWatchingLocation = (watchId: number): void => {
  Geolocation.clearWatch(watchId);
};

