import { LEVELS } from '../constants';
import { User, Level } from '../types';

// 사용자의 현재 등급 계산
export const calculateUserLevel = (
  swimCount: number,
  likeCount: number,
  feedCount: number
): Level => {
  // 역순으로 체크하여 가장 높은 등급을 찾음
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    const level = LEVELS[i];
    if (
      typeof level.minSwimCount === 'number' &&
      typeof level.minLikeCount === 'number' &&
      typeof level.minFeedCount === 'number' &&
      swimCount >= level.minSwimCount &&
      likeCount >= level.minLikeCount &&
      feedCount >= level.minFeedCount
    ) {
      // Type assertion here is safe due to the typeof checks above
      return level as Level;
    }
  }
  return LEVELS[0]; // 기본 등급
};  

// 다음 등급까지 필요한 조건 계산
export const getNextLevelRequirements = (
  currentLevel: number,
  swimCount: number,
  likeCount: number,
  feedCount: number
): {
  nextLevel: Level | null;
  remainingSwims: number;
  remainingLikes: number;
  remainingFeeds: number;
} => {
  const nextLevelIndex = LEVELS.findIndex(l => l.level === currentLevel + 1);
  
  if (nextLevelIndex === -1) {
    return {
      nextLevel: null,
      remainingSwims: 0,
      remainingLikes: 0,
      remainingFeeds: 0,
    };
  }

  const nextLevel = LEVELS[nextLevelIndex];
  
  return {
    nextLevel,
    remainingSwims: typeof nextLevel.minSwimCount === 'number' ? Math.max(0, nextLevel.minSwimCount - swimCount) : 0,
    remainingLikes: typeof nextLevel.minLikeCount === 'number' ? Math.max(0, nextLevel.minLikeCount - likeCount) : 0,
    remainingFeeds: typeof nextLevel.minFeedCount === 'number' ? Math.max(0, nextLevel.minFeedCount - feedCount) : 0,
  };
}
// 등급 업 가능 여부 체크
export const canLevelUp = (
  currentLevel: number,
  swimCount: number,
  likeCount: number,
  feedCount: number
): boolean => {
  const requirements = getNextLevelRequirements(
    currentLevel,
    swimCount,
    likeCount,
    feedCount
  );
  
  return (
    requirements.remainingSwims === 0 &&
    requirements.remainingLikes === 0 &&
    requirements.remainingFeeds === 0
  );
};

