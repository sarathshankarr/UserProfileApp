import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { globalStyles } from '../styles/globalStyles';

const UserCard = ({ user, onPress }) => {
  return (
    <TouchableOpacity style={[globalStyles.card, styles.cardContainer]} onPress={onPress}>
      <View style={styles.cardContent}>
        <Image
          source={{ uri: user.avatar }}
          style={globalStyles.avatar}
          defaultSource={require('../../assets/placeholder-avatar.png')}
        />
        <View style={styles.userInfo}>
          <Text style={[globalStyles.text, styles.userName]}>{user.name}</Text>
          <Text style={[globalStyles.secondaryText, styles.userEmail]}>{user.email}</Text>
        </View>
        <Text style={styles.arrow}>→</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 4,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontWeight: '600',
    marginBottom: 4,
    color: '#000',
    fontSize: 16,
  },
  userEmail: {
    fontSize: 13,
    color: '#000',
  },
  arrow: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: 'bold',
  },
});

export default UserCard;