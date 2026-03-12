import { Search } from 'lucide-react-native';
import React, { useCallback } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDoctorSearch } from '../hooks/useDoctorSearch';
import { DoctorCard } from './DoctorCard';
import { SpecialtyFilter } from './SpecialtyFilter';

import type { IDoctor } from '../types';

const SCREEN_WIDTH = Dimensions.get('window').width;

export const DoctorsScreen: React.FC = React.memo(() => {
  const { searchQuery, setSearchQuery, filters, toggleFilter, filteredDoctors, resultCount } = useDoctorSearch();

  const handleBookPress = useCallback((doctorId: string) => {
    // TODO: Navigate to booking flow
    console.log('Book doctor:', doctorId);
  }, []);

  const renderDoctorCard = useCallback(
    ({ item }: { item: IDoctor }) => <DoctorCard doctor={item} onBookPress={handleBookPress} />,
    [handleBookPress],
  );

  const keyExtractor = useCallback((item: IDoctor) => item.id, []);

  const ListHeaderComponent = useCallback(
    () => (
      <>
        {/* Title */}
        <Text style={styles.title}>Find a Doctor</Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={18} color='#9E9E9E' style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder='Search doctors or specialties...'
            placeholderTextColor='#BDBDBD'
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize='none'
            autoCorrect={false}
            returnKeyType='search'
          />
        </View>

        {/* Filter chips */}
        <View style={styles.filterRow}>
          <SpecialtyFilter filters={filters} onFilterToggle={toggleFilter} />
        </View>

        {/* Result count */}
        <Text style={styles.resultCount}>{resultCount} doctors found</Text>
      </>
    ),
    [searchQuery, setSearchQuery, filters, toggleFilter, resultCount],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={filteredDoctors}
        renderItem={renderDoctorCard}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeaderComponent}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
});

DoctorsScreen.displayName = 'DoctorsScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  listContent: {
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#212121',
    paddingHorizontal: 20,
    paddingTop: 12,
    marginBottom: 16,
  },
  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginHorizontal: 20,
    marginBottom: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    height: 48,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#212121',
    height: '100%',
  },
  // Filters
  filterRow: {
    marginBottom: 14,
  },
  // Results
  resultCount: {
    fontSize: 13,
    color: '#9E9E9E',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
});
