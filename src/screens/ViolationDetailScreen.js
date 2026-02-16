import React, { useState } from 'react';
import {View,ScrollView,StatusBar,TouchableOpacity,Image,Alert,Share,ActivityIndicator} from 'react-native';
import {Card,Text,Surface,Button,Divider} from 'react-native-paper';
import {ArrowLeft,Camera,AlertTriangle,MapPin,Clock,Calendar,Gauge,CheckCircle,Share2,HardHat,Shirt,
  Smartphone,ScanLine,FileText,Shield,User,} from 'lucide-react-native';
import { styles, COLORS } from './styles/ViolationDetailScreenStyles';

// ============ CONFIG ============
const VIOLATION_CONFIG = {
  'No Helmet': { icon: HardHat, color: '#ef4444' },
  'No Vest': { icon: Shirt, color: '#f59e0b' },
  'Mobile Phone Usage': { icon: Smartphone, color: '#8b5cf6' },
  'No detection': { icon: Camera, color: '#6366f1' },
};

const SEVERITY_CONFIG = {
  'Critical': '#ef4444',
  'High': '#f59e0b',
  'Medium': '#3b82f6',
  'Low': '#10b981',
};

const METADATA_FIELDS = [
  { icon: MapPin, label: 'Zone', key: 'zone' },
  { icon: Calendar, label: 'Date', key: 'date' },
  { icon: Clock, label: 'Timestamp', key: 'time' },
  { icon: Gauge, label: 'Severity', key: 'severity', isSeverity: true },
  { icon: User, label: 'Detected By', value: 'AI System' },
  { icon: FileText, label: 'Report ID', key: 'id', format: (v) => `#${v}` },
];

const getConfig = (type, config) => config[type] || { icon: AlertTriangle, color: '#ef4444' };

// ============ IMAGE LIBRARY ============
const IMAGE_LIBRARY = {
  'IMG_001': require('../../assets/000001_jpg.rf.13bbbb75beaf9a127850c10c49992ba3.jpg'),
  'IMG_003': require('../../assets/000003_jpg.rf.912b52bd4aaa765d9eb1eac1d40fe50f.jpg'),
  'IMG_008': require('../../assets/000008_jpg.rf.82886e512a520cf51578fbc2e25bf8e2.jpg'),
  'IMG_010': require('../../assets/000010_jpg.rf.746207ed5adb44d301f30a30745a5a91.jpg'),
  'IMG_019': require('../../assets/000019_jpg.rf.aa39388cb2b5aacb3079166d9153a858.jpg'),
};

const getImageByID = (imageId) => IMAGE_LIBRARY[imageId] || null;

// ============ SAMPLE VIOLATIONS ============
const SAMPLE_VIOLATIONS = [
  {
    id: 1,
    type: 'No Vest',
    zone: 'Zone A - Construction Site',
    time: '10:42 AM',
    date: 'Today',
    severity: 'High',
    status: 'Pending',
    imageId: 'IMG_001',
    highlightArea: { top: 10, left: 30, width: 40, height: 30 },
    description: 'Worker detected without safety helmet in active construction zone.',
  },
  {
    id: 2,
    type: 'No Vest',
    zone: 'Zone B - Scaffolding Area',
    time: '11:15 AM',
    date: 'Today',
    severity: 'Medium',
    status: 'Pending',
    imageId: 'IMG_003',
    highlightArea: { top: 15, left: 25, width: 45, height: 35 },
    description: 'Worker found without protective vest in high-risk area.',
  },
  {
    id: 3,
    type: 'Mobile Phone Usage',
    zone: 'Zone C - Equipment Area',
    time: '12:30 PM',
    date: 'Today',
    severity: 'Low',
    status: 'Resolved',
    imageId: 'IMG_008',
    highlightArea: { top: 20, left: 40, width: 35, height: 25 },
    description: 'Worker using mobile phone while operating equipment.',
  },
  {
    id: 4,
    type: 'No Helmet',
    zone: 'Zone A - Construction Site',
    time: '1:45 PM',
    date: 'Today',
    severity: 'Critical',
    status: 'Pending',
    imageId: 'IMG_010',
    highlightArea: { top: 12, left: 35, width: 38, height: 28 },
    description: 'Critical: Worker without helmet near heavy machinery.',
  },
  {
    id: 5,
    type: 'No Vest',
    zone: 'Zone D - Loading Bay',
    time: '2:20 PM',
    date: 'Today',
    severity: 'High',
    status: 'Pending',
    imageId: 'IMG_019',
    highlightArea: { top: 18, left: 28, width: 42, height: 32 },
    description: 'Worker without safety vest in loading area.',
  },
];

// ============ MAIN COMPONENT ============
const ViolationDetailScreen = ({ navigation, route }) => {
  const violation = route?.params?.violation || SAMPLE_VIOLATIONS[0];
  

  const [status, setStatus] = useState(violation.status);
  const [isResolving, setIsResolving] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const { icon: ViolationIcon, color: violationColor } = getConfig(violation.type, VIOLATION_CONFIG);
  const severityColor = SEVERITY_CONFIG[violation.severity] || '#64748b';

  const handleBack = () => navigation?.goBack?.();

  const handleMarkAsResolved = async () => {
    if (status === 'Resolved') {
      Alert.alert('Already Resolved', 'This incident has already been marked as resolved.');
      return;
    }

    Alert.alert('Mark as Resolved', 'Are you sure you want to mark this incident as resolved?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Confirm',
        onPress: async () => {
          setIsResolving(true);
          await new Promise((resolve) => setTimeout(resolve, 1500));
          setStatus('Resolved');
          setIsResolving(false);
          Alert.alert('Success', 'Incident has been marked as resolved.');
        },
      },
    ]);
  };

  

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <Header violation={violation} onBack={handleBack} />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ImageSection violation={violation} violationColor={violationColor} ViolationIcon={ViolationIcon} imageLoading={imageLoading} setImageLoading={setImageLoading} imageError={imageError} setImageError={setImageError} />
        <IncidentCard violation={violation} status={status} violationColor={violationColor} ViolationIcon={ViolationIcon} />
        <MetadataCard violation={violation} status={status} severityColor={severityColor} />
        <ActionButtons isResolving={isResolving} status={status} onResolve={handleMarkAsResolved} onShare={handleShareReport} />
        <Footer />
      </ScrollView>
    </View>
  );
};

// ============ SUB-COMPONENTS ============
const Header = ({ violation, onBack }) => (
  <View style={styles.header}>
    <View style={styles.headerContent}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <ArrowLeft size={22} color={COLORS.surface} />
      </TouchableOpacity>
      <View style={styles.headerCenter}>
        <Text style={styles.headerTitle}>Incident Details</Text>
        <View style={styles.headerBadge}>
          <FileText size={12} color={COLORS.surface} />
          <Text style={styles.headerBadgeText}>Report #{violation.id}</Text>
        </View>
      </View>
      <View style={styles.headerRight} />
    </View>
  </View>
);

const ImageSection = ({ violation, violationColor, ViolationIcon, imageLoading, setImageLoading, imageError, setImageError }) => {
  const imageSource = getImageByID(violation.imageId);
  
  return (
    <Card style={styles.evidenceCard} mode="elevated">
      <View style={styles.evidenceImageContainer}>
        {imageSource && !imageError ? (
          <>
            <Image
              source={imageSource}
              style={styles.evidenceImage}
              resizeMode="cover"
              onLoadStart={() => setImageLoading(true)}
              onLoadEnd={() => setImageLoading(false)}
              onError={() => { setImageError(true); setImageLoading(false); }}
            />
            {imageLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.info} />
                <Text style={styles.loadingText}>Loading evidence...</Text>
              </View>
            )}
            <View style={styles.imageOverlay} />
            {!imageLoading && <HighlightBox violation={violation} violationColor={violationColor} />}
            <AiBadge />
            <ViolationBadge violation={violation} violationColor={violationColor} ViolationIcon={ViolationIcon} />
          </>
        ) : (
          <ImagePlaceholder imageError={imageError} />
        )}
      </View>
    </Card>
  );
};

const HighlightBox = ({ violation, violationColor }) => (
  <View style={[
    styles.highlightBox,
    {
      top: `${violation.highlightArea?.top || 10}%`,
      left: `${violation.highlightArea?.left || 30}%`,
      width: `${violation.highlightArea?.width || 40}%`,
      height: `${violation.highlightArea?.height || 30}%`,
      borderColor: violationColor,
    },
  ]}>
    {['cornerTopLeft', 'cornerTopRight', 'cornerBottomLeft', 'cornerBottomRight'].map((corner) => (
      <View key={corner} style={[styles.highlightCorner, styles[corner], { borderColor: violationColor }]} />
    ))}
  </View>
);

const AiBadge = () => (
  <View style={styles.aiBadge}>
    <ScanLine size={12} color="#00ff88" />
    <Text style={styles.aiBadgeText}>AI DETECTED</Text>
  </View>
);

const ViolationBadge = ({ violation, violationColor, ViolationIcon }) => (
  <View style={[styles.violationBadgeOnImage, { backgroundColor: violationColor }]}>
    <ViolationIcon size={14} color="#ffffff" />
    <Text style={styles.violationBadgeText}>{violation.type}</Text>
  </View>
);

const ImagePlaceholder = ({ imageError }) => (
  <View style={styles.placeholderContainer}>
    <Surface style={styles.placeholderIconSurface} elevation={0}>
      <Camera size={48} color={COLORS.secondary} strokeWidth={1.5} />
    </Surface>
    <Text style={styles.placeholderText}>Evidence Photo</Text>
    <Text style={styles.placeholderSubtext}>{imageError ? 'Failed to load image' : 'No image available'}</Text>
  </View>
);

const IncidentCard = ({ violation, status, violationColor, ViolationIcon }) => (
  <Card style={styles.incidentCard} mode="elevated">
    <Card.Content style={styles.incidentCardContent}>
      <View style={styles.incidentHeader}>
        <View style={styles.incidentTitleRow}>
          <View style={[styles.incidentIconContainer, { backgroundColor: `${violationColor}15` }]}>
            <ViolationIcon size={24} color={violationColor} strokeWidth={2} />
          </View>
          <View style={styles.incidentTitleContainer}>
            <Text style={styles.incidentLabel}>Violation Type</Text>
            <Text style={[styles.incidentTitle, { color: violationColor }]}>{violation.type}</Text>
          </View>
        </View>
        <StatusBadge status={status} />
      </View>
      <Divider style={styles.divider} />
      <View style={styles.descriptionSection}>
        <Text style={styles.descriptionLabel}>Description</Text>
        <Text style={styles.descriptionText}>{violation.description}</Text>
      </View>
    </Card.Content>
  </Card>
);

const StatusBadge = ({ status }) => (
  <View style={[styles.statusBadge, { backgroundColor: status === 'Resolved' ? `${COLORS.success}15` : `${COLORS.warning}15` }]}>
    {status === 'Resolved' ? (
      <CheckCircle size={14} color={COLORS.success} />
    ) : (
      <AlertTriangle size={14} color={COLORS.warning} />
    )}
    <Text style={[styles.statusText, { color: status === 'Resolved' ? COLORS.success : COLORS.warning }]}>{status}</Text>
  </View>
);

const MetadataCard = ({ violation, status, severityColor }) => (
  <Card style={styles.metadataCard} mode="elevated">
    <Card.Content style={styles.metadataCardContent}>
      <View style={styles.metadataSectionHeader}>
        <Shield size={18} color={COLORS.primary} />
        <Text style={styles.metadataSectionTitle}>Incident Metadata</Text>
      </View>
      <View style={styles.metadataGrid}>
        {METADATA_FIELDS.map((field, idx) => (
          <MetadataItem key={idx} field={field} violation={violation} status={status} severityColor={severityColor} />
        ))}
      </View>
    </Card.Content>
  </Card>
);

const MetadataItem = ({ field, violation, status, severityColor }) => {
  const Icon = field.icon;
  let value = field.value;
  
  if (!value) {
    value = field.format ? field.format(violation[field.key]) : violation[field.key];
  }

  return (
    <View style={styles.metadataItem}>
      <View style={styles.metadataIconContainer}>
        <Icon size={18} color={COLORS.secondary} />
      </View>
      <View style={styles.metadataTextContainer}>
        <Text style={styles.metadataLabel}>{field.label}</Text>
        <Text style={[styles.metadataValue, field.isSeverity && { color: severityColor }]}>{value}</Text>
      </View>
    </View>
  );
};

const ActionButtons = ({ isResolving, status, onResolve, onShare }) => (
  <View style={styles.actionButtonsContainer}>
    <Button 
      mode="contained" 
      onPress={onResolve} 
      loading={isResolving} 
      disabled={isResolving || status === 'Resolved'} 
      style={[styles.resolveButton, status === 'Resolved' && styles.resolvedButton]} 
      contentStyle={styles.resolveButtonContent} 
      labelStyle={styles.resolveButtonLabel} 
      icon={() => <CheckCircle size={20} color="#ffffff" />}
    >
      {status === 'Resolved' ? 'Already Resolved' : 'Mark as Resolved'}
    </Button>
    <Button 
      mode="outlined" 
      onPress={onShare} 
      style={styles.shareButton} 
      contentStyle={styles.shareButtonContent} 
      labelStyle={styles.shareButtonLabel} 
      icon={() => <Share2 size={18} color={COLORS.primary} />}
    >
      Share Report
    </Button>
  </View>
);

const Footer = () => (
  <View style={styles.footerInfo}>
    <ScanLine size={14} color={COLORS.secondary} />
    <Text style={styles.footerText}>Detected and analyzed by SafeSite AI v2.0</Text>
  </View>
);

export default ViolationDetailScreen;
