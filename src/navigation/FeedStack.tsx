import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { FeedStackParamList } from './types';

// Screens (to be created)
import FeedListScreen from '../screens/Feed/FeedListScreen';
import FeedCreateScreen from '../screens/Feed/FeedCreateScreen';
import FeedDetailScreen from '../screens/Feed/FeedDetailScreen';
import FeedEditScreen from '../screens/Feed/FeedEditScreen';

const Stack = createStackNavigator<FeedStackParamList>();

const FeedStack: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="FeedList"
        component={FeedListScreen}
        options={{ title: '피드' }}
      />
      <Stack.Screen
        name="FeedCreate"
        component={FeedCreateScreen}
        options={{ title: '피드 작성' }}
      />
      <Stack.Screen
        name="FeedDetail"
        component={FeedDetailScreen}
        options={{ title: '피드 상세' }}
      />
      <Stack.Screen
        name="FeedEdit"
        component={FeedEditScreen}
        options={{ title: '피드 수정' }}
      />
    </Stack.Navigator>
  );
};

export default FeedStack;

