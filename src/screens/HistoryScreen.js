import React, { useState } from 'react';
import {
  View,
  FlatList,
  StatusBar,
  TouchableOpacity,
  RefreshControl,
  Image,
  ActivityIndicator,
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
  Smartphone,
  ScanLine,
  Shield,
  Calendar,
  Camera,
} from 'lucide-react-native';
import { styles, COLORS } from './styles/HistoryScreenStyles';

// Local violation images from assets folder
const VIOLATION_IMAGES = {
  image1: require('../../assets/000001_jpg.rf.13bbbb75beaf9a127850c10c49992ba3.jpg'),
  image2: require('../../assets/000003_jpg.rf.912b52bd4aaa765d9eb1eac1d40fe50f.jpg'),
  image3: require('../../assets/000008_jpg.rf.82886e512a520cf51578fbc2e25bf8e2.jpg'),
  image4: require('../../assets/000010_jpg.rf.746207ed5adb44d301f30a30745a5a91.jpg'),
  image5: require('../../assets/000019_jpg.rf.aa39388cb2b5aacb3079166d9153a858.jpg'),
};

// Violation data with local images from assets
const DUMMY_LOGS = [
  {
    id: 1,
    type: 'No Helmet',
    zone: 'Zone A - Construction Site',
    time: '10:42 AM',
    date: 'Today',
    severity: 'High',
    status: 'Pending',
    workerImage: VIOLATION_IMAGES.image1,
    isLocalImage: true,
    highlightArea: { top: 10, left: 30, width: 40, height: 30 },
    description: 'Worker detected without safety helmet in active construction zone.',
  },
  {
    id: 2,
    type: 'No Vest',
    zone: 'Zone B - Loading Area',
    time: '11:00 AM',
    date: 'Today',
    severity: 'Medium',
    status: 'Pending',
    workerImage: VIOLATION_IMAGES.image2,
    isLocalImage: true,
    highlightArea: { top: 20, left: 25, width: 50, height: 45 },
    description: 'Worker not wearing high-visibility safety vest in loading area.',
  },
  {
    id: 3,
    type: 'No Helmet',
    zone: 'Zone C - Machinery Area',
    time: '09:15 AM',
    date: 'Today',
    severity: 'High',
    status: 'Resolved',
    workerImage: VIOLATION_IMAGES.image3,
    isLocalImage: true,
    highlightArea: { top: 5, left: 30, width: 40, height: 25 },
    description: 'Worker detected without safety helmet near heavy machinery.',
  },
  {
    id: 4,
    type: 'No Helmet',
    zone: 'Zone A - Scaffolding',
    time: '02:30 PM',
    date: 'Yesterday',
    severity: 'Critical',
    status: 'Resolved',
    workerImage: VIOLATION_IMAGES.image4,
    isLocalImage: true,
    highlightArea: { top: 8, left: 30, width: 40, height: 28 },
    description: 'Worker on scaffolding without proper head protection.',
  },
  {
    id: 5,
    type: 'No Vest',
    zone: 'Zone B - Entrance',
    time: '04:45 PM',
    date: 'Yesterday',
    severity: 'Low',
    status: 'Pending',
    workerImage: VIOLATION_IMAGES.image5,
    isLocalImage: true,
    highlightArea: { top: 15, left: 28, width: 45, height: 50 },
    description: 'Visitor entering site without required safety vest.',
  },
];

const getViolationIcon = (type) => {
  switch (type) {
    case 'No Helmet':
      return HardHat;
    case 'No Vest':
      return Shirt;
    case 'Mobile Phone Usage':
      return Smartphone;
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
    case 'Mobile Phone Usage':
      return '#8b5cf6';
    default:
      return '#ef4444';
  }
};

// Image component with loading state - supports both local and remote images
const EvidenceImage = ({ imageSource, isLocalImage, highlightArea, violationColor }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Determine the correct source format
  const source = isLocalImage ? imageSource : { uri: imageSource };

  return (
    <View style={styles.evidenceContainer}>
      {!error ? (
        <>
          <Image
            source={source}
            style={styles.evidenceImage}
            resizeMode="cover"
            onLoadEnd={() => setLoading(false)}
            onError={() => {
              setError(true);
              setLoading(false);
            }}
          />
          {loading && (
            <View style={styles.imageLoadingContainer}>
              <ActivityIndicator size="small" color="#00d4ff" />
            </View>
          )}
        </>
      ) : (
        <View style={styles.imageErrorContainer}>
          <Camera size={24} color={COLORS.secondary} />
          <Text style={styles.imageErrorText}>Image unavailable</Text>
        </View>
      )}
      {/* Dark overlay for better visibility */}
      <View style={styles.imageOverlay} />
      {/* Violation Highlight Box */}
      {!loading && !error && (
        <View
          style={[
            styles.highlightBox,
            {
              top: `${highlightArea?.top || 10}%`,
              left: `${highlightArea?.left || 30}%`,
              width: `${highlightArea?.width || 40}%`,
              height: `${highlightArea?.height || 30}%`,
              borderColor: violationColor,
            },
          ]}
        >
          <View style={[styles.highlightCorner, styles.cornerTopLeft, { borderColor: violationColor }]} />
          <View style={[styles.highlightCorner, styles.cornerTopRight, { borderColor: violationColor }]} />
          <View style={[styles.highlightCorner, styles.cornerBottomLeft, { borderColor: violationColor }]} />
          <View style={[styles.highlightCorner, styles.cornerBottomRight, { borderColor: violationColor }]} />
        </View>
      )}
    </View>
  );
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

  const renderLogItem = ({ item }) => {
    const ViolationIcon = getViolationIcon(item.type);
    const violationColor = getViolationColor(item.type);

    return (
      <Card style={styles.logCard} mode="elevated">
        <View style={[styles.cardAccent, { backgroundColor: violationColor }]} />
        <Card.Content style={styles.logCardContent}>
          {/* Evidence Image with Highlight */}
          <View style={styles.evidenceWrapper}>
            <EvidenceImage
              imageSource={item.workerImage}
              isLocalImage={item.isLocalImage}
              highlightArea={item.highlightArea}
              violationColor={violationColor}
            />
            {/* AI Detection Label */}
            <View style={styles.aiDetectionBadge}>
              <ScanLine size={10} color="#00ff88" />
              <Text style={styles.aiDetectionText}>AI DETECTED</Text>
            </View>
            {/* Violation Label on Image */}
            <View style={[styles.violationLabelOnImage, { backgroundColor: violationColor }]}>
              <ViolationIcon size={14} color="#ffffff" />
              <Text style={styles.violationLabelText}>{item.type}</Text>
            </View>
            {/* Timestamp on Image */}
            <View style={styles.timestampOnImage}>
              <Clock size={10} color="#ffffff" />
              <Text style={styles.timestampText}>{item.time}</Text>
            </View>
          </View>

          {/* Info Section */}
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <View style={[styles.iconContainer, { backgroundColor: `${violationColor}15` }]}>
                <ViolationIcon size={18} color={violationColor} strokeWidth={2} />
              </View>
              <View style={styles.cardMainInfo}>
                <Text style={[styles.violationType, { color: violationColor }]}>
                  {item.type}
                </Text>
                <View style={styles.locationRow}>
                  <MapPin size={11} color={COLORS.secondary} />
                  <Text style={styles.locationText} numberOfLines={1}>{item.zone}</Text>
                </View>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: item.status === 'Resolved' ? `${COLORS.success}15` : `${COLORS.warning}15` }]}>
                <Text style={[styles.statusText, { color: item.status === 'Resolved' ? COLORS.success : COLORS.warning }]}>
                  {item.status}
                </Text>
              </View>
            </View>

            {/* Bottom Row */}
            <View style={styles.cardBottomRow}>
              <View style={styles.leftInfo}>
                <View style={styles.dateBadge}>
                  <Calendar size={10} color={COLORS.surface} />
                  <Text style={styles.dateText}>{item.date}</Text>
                </View>
                <View style={[styles.severityBadge, {
                  backgroundColor: item.severity === 'Critical' ? '#ef444415' :
                                   item.severity === 'High' ? '#f59e0b15' :
                                   item.severity === 'Medium' ? '#3b82f615' : '#10b98115'
                }]}>
                  <Text style={[styles.severityText, {
                    color: item.severity === 'Critical' ? '#ef4444' :
                           item.severity === 'High' ? '#f59e0b' :
                           item.severity === 'Medium' ? '#3b82f6' : '#10b981'
                  }]}>{item.severity}</Text>
                </View>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>
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
          <View style={[styles.statIconBg, { backgroundColor: `${COLORS.info}15` }]}>
            <Camera size={18} color={COLORS.info} />
          </View>
          <Text style={styles.statValue}>{DUMMY_LOGS.length}</Text>
          <Text style={styles.statLabel}>Evidence</Text>
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

export default HistoryScreen;
