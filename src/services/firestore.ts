import firestore from '@react-native-firebase/firestore';
import { User, Pool, Feed, Review, FriendRequest, SwimRecord } from '../types';
import { SAMPLE_POOLS } from '../utils/sampleData';

// Collections
const USERS_COLLECTION = 'users';
const POOLS_COLLECTION = 'pools';
const FEEDS_COLLECTION = 'feeds';
const REVIEWS_COLLECTION = 'reviews';
const FRIEND_REQUESTS_COLLECTION = 'friendRequests';

// User CRUD
export const createUser = async (user: User): Promise<void> => {
  await firestore().collection(USERS_COLLECTION).doc(user.id).set({
    ...user,
    createdAt: firestore.FieldValue.serverTimestamp(),
  });
};

export const getUserData = async (userId: string): Promise<User> => {
  const doc = await firestore().collection(USERS_COLLECTION).doc(userId).get();
  
  if (!doc.exists) {
    throw new Error('User not found');
  }
  
  const data = doc.data();
  return {
    ...data,
    id: doc.id,
    createdAt: data?.createdAt?.toDate() || new Date(),
  } as User;
};

export const updateUser = async (userId: string, data: Partial<User>): Promise<void> => {
  await firestore().collection(USERS_COLLECTION).doc(userId).update(data);
};

// Feed CRUD
export const createFeed = async (feed: Omit<Feed, 'id'>): Promise<string> => {
  const docRef = await firestore().collection(FEEDS_COLLECTION).add({
    ...feed,
    createdAt: firestore.FieldValue.serverTimestamp(),
  });
  return docRef.id;
};

export const getFeeds = async (limit: number = 20): Promise<Feed[]> => {
  const snapshot = await firestore()
    .collection(FEEDS_COLLECTION)
    .orderBy('createdAt', 'desc')
    .limit(limit)
    .get();
  
  return snapshot.docs.map(doc => ({
    ...doc.data(),
    id: doc.id,
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate(),
  })) as Feed[];
};

export const getUserFeeds = async (userId: string): Promise<Feed[]> => {
  const snapshot = await firestore()
    .collection(FEEDS_COLLECTION)
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .get();
  
  return snapshot.docs.map(doc => ({
    ...doc.data(),
    id: doc.id,
    createdAt: doc.data().createdAt?.toDate() || new Date(),
  })) as Feed[];
};

export const updateFeed = async (feedId: string, data: Partial<Feed>): Promise<void> => {
  await firestore().collection(FEEDS_COLLECTION).doc(feedId).update({
    ...data,
    updatedAt: firestore.FieldValue.serverTimestamp(),
  });
};

export const deleteFeed = async (feedId: string): Promise<void> => {
  await firestore().collection(FEEDS_COLLECTION).doc(feedId).delete();
};

export const toggleLike = async (feedId: string, userId: string): Promise<void> => {
  const feedRef = firestore().collection(FEEDS_COLLECTION).doc(feedId);
  const doc = await feedRef.get();
  
  if (!doc.exists) return;
  
  const likes = doc.data()?.likes || [];
  const hasLiked = likes.includes(userId);
  
  if (hasLiked) {
    await feedRef.update({
      likes: firestore.FieldValue.arrayRemove(userId),
    });
  } else {
    await feedRef.update({
      likes: firestore.FieldValue.arrayUnion(userId),
    });
  }
};

// Pool CRUD
export const getPools = async (): Promise<Pool[]> => {
  console.log('🔍 Firestore에서 수영장 데이터 가져오는 중...');
  const snapshot = await firestore().collection(POOLS_COLLECTION).get();
  console.log(`📦 Firestore에서 ${snapshot.size}개의 문서를 가져왔습니다.`);
  
  const pools = snapshot.docs.map(doc => ({
    ...doc.data(),
    id: doc.id,
  })) as Pool[];
  
  return pools;
};

export const getPoolById = async (poolId: string): Promise<Pool> => {
  const doc = await firestore().collection(POOLS_COLLECTION).doc(poolId).get();
  
  if (!doc.exists) {
    throw new Error('Pool not found');
  }
  
  return {
    ...doc.data(),
    id: doc.id,
  } as Pool;
};

export const createPool = async (pool: Omit<Pool, 'id'>): Promise<string> => {
  const docRef = await firestore().collection(POOLS_COLLECTION).add(pool);
  return docRef.id;
};

// Review CRUD
export const createReview = async (review: Omit<Review, 'id'>): Promise<string> => {
  const docRef = await firestore().collection(REVIEWS_COLLECTION).add({
    ...review,
    createdAt: firestore.FieldValue.serverTimestamp(),
  });
  
  // 수영장 평점 업데이트
  await updatePoolRating(review.poolId);
  
  return docRef.id;
};

export const createPoolReview = async (review: Omit<Review, 'id'>): Promise<string> => {
  return await createReview(review);
};

export const getPoolReviews = async (poolId: string): Promise<Review[]> => {
  const snapshot = await firestore()
    .collection(REVIEWS_COLLECTION)
    .where('poolId', '==', poolId)
    .orderBy('createdAt', 'desc')
    .get();
  
  return snapshot.docs.map(doc => ({
    ...doc.data(),
    id: doc.id,
    createdAt: doc.data().createdAt?.toDate() || new Date(),
  })) as Review[];
};

const updatePoolRating = async (poolId: string): Promise<void> => {
  const reviews = await getPoolReviews(poolId);
  
  if (reviews.length === 0) return;
  
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  
  await firestore().collection(POOLS_COLLECTION).doc(poolId).update({
    rating: Math.round(avgRating * 10) / 10,
  });
};

// Friend Requests
export const sendFriendRequest = async (fromUserId: string, toUserId: string): Promise<string> => {
  const docRef = await firestore().collection(FRIEND_REQUESTS_COLLECTION).add({
    fromUserId,
    toUserId,
    status: 'pending',
    createdAt: firestore.FieldValue.serverTimestamp(),
  });
  return docRef.id;
};

export const acceptFriendRequest = async (requestId: string): Promise<void> => {
  const requestRef = firestore().collection(FRIEND_REQUESTS_COLLECTION).doc(requestId);
  const doc = await requestRef.get();
  
  if (!doc.exists) return;
  
  const { fromUserId, toUserId } = doc.data() as FriendRequest;
  
  // 양쪽 친구 목록에 추가
  await firestore().collection(USERS_COLLECTION).doc(fromUserId).update({
    friends: firestore.FieldValue.arrayUnion(toUserId),
  });
  
  await firestore().collection(USERS_COLLECTION).doc(toUserId).update({
    friends: firestore.FieldValue.arrayUnion(fromUserId),
  });
  
  // 요청 상태 업데이트
  await requestRef.update({ status: 'accepted' });
};

export const rejectFriendRequest = async (requestId: string): Promise<void> => {
  await firestore()
    .collection(FRIEND_REQUESTS_COLLECTION)
    .doc(requestId)
    .update({ status: 'rejected' });
};

// Swim Records
export const addSwimRecord = async (userId: string, record: Omit<SwimRecord, 'id'>): Promise<void> => {
  await firestore()
    .collection(USERS_COLLECTION)
    .doc(userId)
    .update({
      swimRecords: firestore.FieldValue.arrayUnion(record),
    });
};

// Pool Favorites
export const togglePoolFavorite = async (userId: string, poolId: string): Promise<boolean> => {
  const userDoc = await firestore().collection(USERS_COLLECTION).doc(userId).get();
  const userData = userDoc.data();
  const favoritePoolIds = userData?.favoritePoolIds || [];
  
  const isFavorite = favoritePoolIds.includes(poolId);
  
  if (isFavorite) {
    // 즐겨찾기 제거
    await firestore()
      .collection(USERS_COLLECTION)
      .doc(userId)
      .update({
        favoritePoolIds: firestore.FieldValue.arrayRemove(poolId),
      });
    return false;
  } else {
    // 즐겨찾기 추가
    await firestore()
      .collection(USERS_COLLECTION)
      .doc(userId)
      .update({
        favoritePoolIds: firestore.FieldValue.arrayUnion(poolId),
      });
    return true;
  }
};

export const getFavoritePools = async (userId: string): Promise<Pool[]> => {
  const userDoc = await firestore().collection(USERS_COLLECTION).doc(userId).get();
  const userData = userDoc.data();
  const favoritePoolIds = userData?.favoritePoolIds || [];
  
  if (favoritePoolIds.length === 0) {
    return [];
  }
  
  const poolsPromises = favoritePoolIds.map((poolId: string) =>
    firestore().collection(POOLS_COLLECTION).doc(poolId).get()
  );
  
  const poolDocs = await Promise.all(poolsPromises);
  
  return poolDocs
    .filter(doc => doc.exists)
    .map(doc => ({
      ...doc.data(),
      id: doc.id,
    })) as Pool[];
};

// 샘플 수영장 데이터 초기화 (최초 1회 실행)
export const initializeSamplePools = async (): Promise<void> => {
  try {
    console.log('🔍 수영장 데이터 확인 중...');
    
    // 이미 데이터가 있는지 확인
    const existingPools = await firestore().collection(POOLS_COLLECTION).limit(1).get();
    
    if (!existingPools.empty) {
      console.log('✅ 수영장 데이터가 이미 존재합니다. (초기화 건너뛰기)');
      return;
    }

    console.log(`📝 샘플 수영장 ${SAMPLE_POOLS.length}개 추가 시작...`);
    
    // 배치 작업으로 모든 샘플 데이터 추가
    const batch = firestore().batch();
    
    SAMPLE_POOLS.forEach((pool, index) => {
      const docRef = firestore().collection(POOLS_COLLECTION).doc();
      batch.set(docRef, pool);
      console.log(`  ${index + 1}. ${pool.name} - ${pool.address}`);
    });
    
    await batch.commit();
    console.log(`🎉 ${SAMPLE_POOLS.length}개의 수영장 데이터가 성공적으로 추가되었습니다!`);
  } catch (error) {
    console.error('❌ 샘플 데이터 초기화 실패:', error);
    throw error;
  }
};

