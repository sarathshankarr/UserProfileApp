import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>👋 Welcome to the Asiaville</Text>

      <Image
        source={require('../../assets/Asiaville.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.about}>
        We are a Media-Tech company reaching over 150 million monthly users
        across local languages through our Interactive and Gamified app, AyeVee.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Lock')}
      >
        <Text style={styles.buttonText}>Lock the Screen</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 20,
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: 30,
  },
  about: {
    fontSize: 16,
    color: '#475569',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 8,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;
