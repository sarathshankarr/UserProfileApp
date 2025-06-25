import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useUser } from '../context/UserContext';
import { globalStyles } from '../styles/globalStyles';

const ProfileScreen = ({ route, navigation }) => {
  const { userId } = route.params;
  const { getUserById } = useUser();
  const user = getUserById(userId);

  if (!user) {
    return (
      <SafeAreaView style={[globalStyles.container, styles.errorContainer]}>
        <Text style={styles.errorText}>User not found</Text>
        <TouchableOpacity style={globalStyles.button} onPress={() => navigation.goBack()}>
          <Text style={globalStyles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Image
              source={require('../../assets/backarrow.png')}
              style={styles.backIcon}
              resizeMode="contain"
            />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.profileContent}>
          <Image
            source={{ uri: user.avatar }}
            style={globalStyles.largeAvatar}
            defaultSource={require('../../assets/placeholder-avatar.png')}
          />

          <Text style={[globalStyles.header, styles.userName]}>{user.name}</Text>

          <View style={styles.infoSection}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={[globalStyles.text, styles.infoValue]}>{user.email}</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={[globalStyles.text, styles.infoValue]}>{user.phone}</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Bio</Text>
              <Text style={[globalStyles.text, styles.bioText]}>{user.bio}</Text>
            </View>
          </View>

          <TouchableOpacity style={[globalStyles.button, styles.actionButton]} onPress={() => navigation.goBack()}>
            <Text style={globalStyles.buttonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  backIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
    tintColor: '#007AFF',      
  },
  profileContent: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  userName: {
    textAlign: 'center',
    marginBottom: 32,
  },
  infoSection: {
    width: '100%',
    marginBottom: 32,
  },
  infoItem: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
     color: '#000',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 16,
    color: '#000',
  },
  bioText: {
    lineHeight: 22,
  },
  actionButton: {
    width: '100%',
    marginTop: 16,
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default ProfileScreen;