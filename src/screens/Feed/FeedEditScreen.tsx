import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';

const FeedEditScreen: React.FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const { feedId } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.placeholder}>피드 수정 화면</Text>
      <Text style={styles.placeholderSub}>Feed ID: {feedId}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  placeholder: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 50,
  },
  placeholderSub: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default FeedEditScreen;

