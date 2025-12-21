import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  StatusBar,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import {
  Card,
  Text,
  Surface,
  Searchbar,
} from 'react-native-paper';
import {
  ArrowLeft,
  AlertTriangle,
  Clock,
  MapPin,
  HardHat,
  Shirt,
  Footprints,
  AlertOctagon,
  ScanLine,
  Shield,
  TrendingUp,
  Calendar,
  Search,
  ChevronRight,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#0f172a',
  secondary: '#64748b',
  background: '#f8fafc',
  surface: '#ffffff',
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
};

const DUMMY_LOGS = [
  {
    id: 1,
    type: 'No Helmet',
    zone: 'Zone A',
    time: '10:42 AM',
    date: 'Today',
    confidence: 98,
  },
  {
    id: 2,
    type: 'No Vest',
    zone: 'Zone B',
    time: '11:00 AM',
    date: 'Today',
    confidence: 95,
  },
  {
    id: 3,
    type: 'No Safety Boots',
    zone: 'Zone C',
    time: '09:15 AM',
    date: 'Today',
    confidence: 87,
  },
  {
    id: 4,
    type: 'No Helmet',
    zone: 'Zone A',
    time: '02:30 PM',
    date: 'Yesterday',
    confidence: 99,
  },
  {
    id: 5,
    type: 'Restricted Area',
    zone: 'Zone D',
    time: '04:45 PM',
    date: 'Yesterday',
    confidence: 92,
  },
];

const getViolationIcon = (type) => {
  switch (type) {
    case 'No Helmet':
      return HardHat;
    case 'No Vest':
      return Shirt;
    case 'No Safety Boots':
      return Footprints;
    case 'Restricted Area':
      return AlertOctagon;
    default:
      return AlertTriangle;
  }
};

const getViolationColor = (type) => {
  switch (type) {
    case 'No Helmet':
      return '#ef4444';
    case 'No Vest':
      return '#f59e0b';
    case 'No Safety Boots':
      return '#8b5cf6';
    case 'Restricted Area':
      return '#ec4899';
    default:
      return '#ef4444';
  }
};

const HistoryScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filters = ['All', 'Today', 'Yesterday'];

  const filteredLogs = DUMMY_LOGS.filter((log) => {
    const matchesSearch =
      log.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.zone.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      selectedFilter === 'All' || log.date === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleBack = () => {
    if (navigation && navigation.goBack) {
      navigation.goBack();
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const getTodayCount = () => DUMMY_LOGS.filter((log) => log.date === 'Today').length;
  const getAverageConfidence = () => {
    const avg = DUMMY_LOGS.reduce((acc, log) => acc + log.confidence, 0) / DUMMY_LOGS.length;
    return Math.round(avg);
  };

  const renderLogItem = ({ item, index }) => {
    const ViolationIcon = getViolationIcon(item.type);
    const violationColor = getViolationColor(item.type);

    return (
      <TouchableOpacity activeOpacity={0.7}>
        <Card style={styles.logCard} mode="elevated">
          <View style={styles.cardAccent} backgroundColor={violationColor} />
          <Card.Content style={styles.logCardContent}>
            {/* Top Row */}
            <View style={styles.cardTopRow}>
              <View style={[styles.iconContainer, { backgroundColor: `${violationColor}15` }]}>
                <ViolationIcon size={22} color={violationColor} strokeWidth={2} />
              </View>
              <View style={styles.cardMainInfo}>
                <Text style={[styles.violationType, { color: violationColor }]}>
                  {item.type}
                </Text>
                <View style={styles.locationRow}>
                  <MapPin size={12} color={COLORS.secondary} />
                  <Text style={styles.locationText}>{item.zone}</Text>
                </View>
              </View>
              <View style={styles.confidenceBadge}>
                <Text style={styles.confidenceValue}>{item.confidence}%</Text>
                <Text style={styles.confidenceLabel}>Accuracy</Text>
              </View>
            </View>

            {/* Divider */}
            <View style={styles.cardDivider} />

            {/* Bottom Row */}
            <View style={styles.cardBottomRow}>
              <View style={styles.detectedTag}>
                <ScanLine size={12} color={COLORS.error} />
                <Text style={styles.detectedText}>AI Detected</Text>
              </View>
              <View style={styles.timeInfo}>
                <Clock size={12} color={COLORS.secondary} />
                <Text style={styles.timeText}>{item.time}</Text>
                <View style={styles.dateBadge}>
                  <Text style={styles.dateText}>{item.date}</Text>
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View style={styles.listHeader}>
      {/* Stats Cards */}
      <View style={styles.statsRow}>
        <Surface style={styles.statCard} elevation={2}>
          <View style={[styles.statIconBg, { backgroundColor: `${COLORS.error}15` }]}>
            <AlertTriangle size={18} color={COLORS.error} />
          </View>
          <Text style={styles.statValue}>{DUMMY_LOGS.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </Surface>

        <Surface style={styles.statCard} elevation={2}>
          <View style={[styles.statIconBg, { backgroundColor: `${COLORS.warning}15` }]}>
            <Calendar size={18} color={COLORS.warning} />
          </View>
          <Text style={styles.statValue}>{getTodayCount()}</Text>
          <Text style={styles.statLabel}>Today</Text>
        </Surface>

        <Surface style={styles.statCard} elevation={2}>
          <View style={[styles.statIconBg, { backgroundColor: `${COLORS.success}15` }]}>
            <TrendingUp size={18} color={COLORS.success} />
          </View>
          <Text style={styles.statValue}>{getAverageConfidence()}%</Text>
          <Text style={styles.statLabel}>Avg. Accuracy</Text>
        </Surface>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search by type or zone..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={styles.searchInput}
          iconColor={COLORS.secondary}
          placeholderTextColor={COLORS.secondary}
          elevation={0}
        />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            onPress={() => setSelectedFilter(filter)}
            style={[
              styles.filterTab,
              selectedFilter === filter && styles.filterTabActive,
            ]}
          >
            <Text
              style={[
                styles.filterTabText,
                selectedFilter === filter && styles.filterTabTextActive,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Results Header */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsTitle}>Detection History</Text>
        <Text style={styles.resultsCount}>
          {filteredLogs.length} {filteredLogs.length === 1 ? 'record' : 'records'}
        </Text>
      </View>
    </View>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Surface style={styles.emptyIconSurface} elevation={2}>
        <Shield size={56} color={COLORS.success} strokeWidth={1.5} />
      </Surface>
      <Text style={styles.emptyTitle}>All Clear!</Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery || selectedFilter !== 'All'
          ? 'No violations match your search criteria.\nTry adjusting your filters.'
          : 'No safety violations have been detected.\nKeep up the great work!'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerBackground} />
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeft size={22} color={COLORS.surface} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Violation Logs</Text>
            <View style={styles.headerBadge}>
              <ScanLine size={12} color={COLORS.surface} />
              <Text style={styles.headerBadgeText}>AI Powered</Text>
            </View>
          </View>
          <View style={styles.headerRight} />
        </View>
      </View>

      {/* Logs List */}
      <FlatList
        data={filteredLogs}
        renderItem={renderLogItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 50,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.surface,
    letterSpacing: 0.5,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 6,
    gap: 4,
  },
  headerBadgeText: {
    fontSize: 11,
    color: COLORS.surface,
    fontWeight: '500',
  },
  headerRight: {
    width: 42,
  },
  listContent: {
    padding: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
  listHeader: {
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
  },
  statIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.secondary,
    marginTop: 2,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchBar: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    height: 50,
  },
  searchInput: {
    fontSize: 14,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  filterTabActive: {
    backgroundColor: COLORS.primary,
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  filterTabTextActive: {
    color: COLORS.surface,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  resultsCount: {
    fontSize: 13,
    color: COLORS.secondary,
    fontWeight: '500',
  },
  logCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardAccent: {
    height: 4,
    width: '100%',
  },
  logCardContent: {
    padding: 16,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardMainInfo: {
    flex: 1,
    marginLeft: 14,
  },
  violationType: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 13,
    color: COLORS.secondary,
  },
  confidenceBadge: {
    alignItems: 'center',
    backgroundColor: `${COLORS.success}10`,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  confidenceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.success,
  },
  confidenceLabel: {
    fontSize: 9,
    color: COLORS.secondary,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 14,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detectedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.error}10`,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  detectedText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.error,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeText: {
    fontSize: 12,
    color: COLORS.secondary,
    fontWeight: '500',
  },
  dateBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 4,
  },
  dateText: {
    fontSize: 10,
    color: COLORS.surface,
    fontWeight: '600',
  },
  separator: {
    height: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIconSurface: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: `${COLORS.success}10`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default HistoryScreen;
