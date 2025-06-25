import React from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { useUser } from '../context/UserContext';
import UserCard from '../components/UserCard';
import SearchBar from '../components/SearchBar';
import { globalStyles } from '../styles/globalStyles';

const HomeScreen = ({ navigation }) => {
  const { filteredUsers, searchQuery, searchUsers } = useUser();

  const renderUserCard = ({ item }) => (
    <UserCard
      user={item}
      onPress={() => navigation.navigate('Profile', { userId: item.id })}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>No users found</Text>
      <Text style={styles.emptyStateSubtext}>Try adjusting your search</Text>
    </View>
  );

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={styles.header}>
        <Text style={globalStyles.header}>User Profiles</Text>
        <SearchBar
          value={searchQuery}
          onChangeText={searchUsers}
          placeholder="Search by name..."
          placeholderTextColor="#000"
          style={styles.searchBar}
        />
      </View>
      <FlatList
        data={filteredUsers}
        renderItem={renderUserCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#f8f9fa',
  },
  searchBar: {
    color: '#000',
  },
  listContainer: {
    paddingBottom: 20,
    color: '#000',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#000',
  },
});

export default HomeScreen;