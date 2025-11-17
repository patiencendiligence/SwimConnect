import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProfileEditScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>프로필 수정 화면</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    fontSize: 18,
    color: '#666',
  },
});

export default ProfileEditScreen;

