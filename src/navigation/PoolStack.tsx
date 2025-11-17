import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { PoolStackParamList } from './types';

// Screens (to be created)
import PoolListScreen from '../screens/Pool/PoolListScreen';
import PoolDetailScreen from '../screens/Pool/PoolDetailScreen';
import PoolReviewScreen from '../screens/Pool/PoolReviewScreen';

const Stack = createStackNavigator<PoolStackParamList>();

const PoolStack: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PoolList"
        component={PoolListScreen}
        options={{ title: '근처 수영장' }}
      />
      <Stack.Screen
        name="PoolDetail"
        component={PoolDetailScreen}
        options={{ title: '수영장 정보' }}
      />
      <Stack.Screen
        name="PoolReview"
        component={PoolReviewScreen}
        options={{ title: '리뷰 작성' }}
      />
    </Stack.Navigator>
  );
};

export default PoolStack;

