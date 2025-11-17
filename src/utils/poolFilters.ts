import { Pool } from '../types';

// 수영장 타입 한글 이름
export const POOL_TYPE_NAMES = {
  sports_center: '스포츠센터',
  youth_center: '청소년센터',
  public_pool: '공공수영장',
  hotel: '호텔',
  fitness: '피트니스',
  other: '기타',
};

// 필터 옵션 인터페이스
export interface PoolFilterOptions {
  city?: string; // 시
  district?: string; // 구
  poolTypes?: string[]; // 수영장 타입 (복수 선택)
  kickboardAvailable?: boolean; // 킥판 사용 가능
  minRating?: number; // 최소 평점
  maxDistance?: number; // 최대 거리 (km, 현재 위치 기준)
  priceRange?: { min?: number; max?: number }; // 가격 범위
}

/**
 * 수영장 필터링
 */
export const filterPools = (
  pools: Pool[],
  filters: PoolFilterOptions,
  userLocation?: { latitude: number; longitude: number }
): Pool[] => {
  return pools.filter(pool => {
    // 시 필터
    if (filters.city && pool.city !== filters.city) {
      return false;
    }

    // 구 필터
    if (filters.district && pool.district !== filters.district) {
      return false;
    }

    // 수영장 타입 필터
    if (filters.poolTypes && filters.poolTypes.length > 0) {
      if (!filters.poolTypes.includes(pool.poolType)) {
        return false;
      }
    }

    // 킥판 가능 필터
    if (filters.kickboardAvailable !== undefined && pool.kickboardAvailable !== filters.kickboardAvailable) {
      return false;
    }

    // 최소 평점 필터
    if (filters.minRating !== undefined && pool.rating < filters.minRating) {
      return false;
    }

    // 가격 범위 필터
    if (filters.priceRange) {
      if (pool.price) {
        if (filters.priceRange.min !== undefined && pool.price < filters.priceRange.min) {
          return false;
        }
        if (filters.priceRange.max !== undefined && pool.price > filters.priceRange.max) {
          return false;
        }
      }
    }

    // 거리 필터 (사용자 위치가 제공된 경우)
    if (filters.maxDistance && userLocation) {
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        pool.latitude,
        pool.longitude
      );
      if (distance > filters.maxDistance) {
        return false;
      }
    }

    return true;
  });
};

/**
 * 두 좌표 간의 거리 계산 (Haversine formula)
 * @returns 거리 (km)
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // 지구 반지름 (km)
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
};

const toRad = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * 거리에 따라 수영장 정렬
 */
export const sortPoolsByDistance = (
  pools: Pool[],
  userLocation: { latitude: number; longitude: number }
): Pool[] => {
  return [...pools].sort((a, b) => {
    const distA = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      a.latitude,
      a.longitude
    );
    const distB = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      b.latitude,
      b.longitude
    );
    return distA - distB;
  });
};

/**
 * 평점에 따라 수영장 정렬
 */
export const sortPoolsByRating = (pools: Pool[]): Pool[] => {
  return [...pools].sort((a, b) => b.rating - a.rating);
};

/**
 * 고유한 시(city) 목록 추출
 */
export const getUniqueCities = (pools: Pool[]): string[] => {
  const cities = new Set(pools.map(p => p.city));
  return Array.from(cities).sort();
};

/**
 * 특정 시의 구(district) 목록 추출
 */
export const getDistrictsInCity = (pools: Pool[], city: string): string[] => {
  const districts = new Set(
    pools
      .filter(p => p.city === city)
      .map(p => p.district)
  );
  return Array.from(districts).sort();
};

/**
 * 거리 포맷팅
 */
export const formatDistance = (km: number): string => {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`;
  }
  return `${km.toFixed(1)}km`;
};

/**
 * 수영장과 사용자 위치 간 거리 계산 및 포맷팅
 */
export const getPoolDistance = (
  pool: Pool,
  userLocation?: { latitude: number; longitude: number }
): string | null => {
  if (!userLocation) return null;
  
  const distance = calculateDistance(
    userLocation.latitude,
    userLocation.longitude,
    pool.latitude,
    pool.longitude
  );
  
  return formatDistance(distance);
};

