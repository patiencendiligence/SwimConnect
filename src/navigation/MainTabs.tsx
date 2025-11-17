import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import Icon from 'react-native-vector-icons/Ionicons';

// Screens (to be created)
import HomeScreen from '../screens/Home/HomeScreen';
import PoolStack from './PoolStack';
import FeedStack from './FeedStack';
import ProfileStack from './ProfileStack';

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: '홈',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Pool"
        component={PoolStack}
        options={{
          tabBarLabel: '수영장',
          tabBarIcon: ({ color, size }) => (
            <Icon name="location-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Feed"
        component={FeedStack}
        options={{
          tabBarLabel: '피드',
          tabBarIcon: ({ color, size }) => (
            <Icon name="newspaper-outline" color={color} size={size} />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            // 기본 동작 방지
            e.preventDefault();
            // Feed 스택의 FeedList로 리셋
            navigation.navigate('Feed', { screen: 'FeedList' });
          },
        })}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarLabel: '프로필',
          tabBarIcon: ({ color, size }) => (
            <Icon name="person-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabs;

