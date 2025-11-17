import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ProfileStackParamList } from './types';

// Screens (to be created)
import ProfileMainScreen from '../screens/Profile/ProfileMainScreen';
import ProfileEditScreen from '../screens/Profile/ProfileEditScreen';
import SwimRecordsScreen from '../screens/Profile/SwimRecordsScreen';
import SwimRecordInputScreen from '../screens/Profile/SwimRecordInputScreen';
import FriendsScreen from '../screens/Profile/FriendsScreen';
import SettingsScreen from '../screens/Profile/SettingsScreen';

const Stack = createStackNavigator<ProfileStackParamList>();

const ProfileStack: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileMain"
        component={ProfileMainScreen}
        options={{ title: '프로필' }}
      />
      <Stack.Screen
        name="ProfileEdit"
        component={ProfileEditScreen}
        options={{ title: '프로필 수정' }}
      />
      <Stack.Screen
        name="SwimRecords"
        component={SwimRecordsScreen}
        options={{ title: '수영 기록' }}
      />
      <Stack.Screen
        name="SwimRecordInput"
        component={SwimRecordInputScreen}
        options={{ title: '기록 추가' }}
      />
      <Stack.Screen
        name="Friends"
        component={FriendsScreen}
        options={{ title: '친구' }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: '설정' }}
      />
    </Stack.Navigator>
  );
};

export default ProfileStack;

