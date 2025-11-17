import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RouteProp } from '@react-navigation/native';

// Auth Stack
export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
};

export type AuthStackNavigationProp = StackNavigationProp<AuthStackParamList>;

// Main Bottom Tabs
export type MainTabParamList = {
  Home: undefined;
  Pool: undefined;
  Feed: undefined;
  Profile: undefined;
};

export type MainTabNavigationProp = BottomTabNavigationProp<MainTabParamList>;

// Pool Stack
export type PoolStackParamList = {
  PoolList: undefined;
  PoolDetail: { poolId: string };
  PoolReview: { poolId: string };
};

// Feed Stack
export type FeedStackParamList = {
  FeedList: undefined;
  FeedCreate: undefined;
  FeedDetail: { feedId: string };
  FeedEdit: { feedId: string };
};

// Profile Stack
export type ProfileStackParamList = {
  ProfileMain: undefined;
  ProfileEdit: undefined;
  SwimRecords: undefined;
  SwimRecordInput: undefined;
  Friends: undefined;
  Settings: undefined;
};

// Root Stack
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

