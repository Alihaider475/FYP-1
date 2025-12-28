import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Image,
  Alert,
  Share,
  ActivityIndicator,
} from 'react-native';
import {
  Card,
  Text,
  Surface,
  Button,
  Divider,
} from 'react-native-paper';
import {
  ArrowLeft,
  Camera,
  AlertTriangle,
  MapPin,
  Clock,
  Calendar,
  Gauge,
  CheckCircle,
  Share2,
  HardHat,
  Shirt,
  Smartphone,
  ScanLine,
  FileText,
  Shield,
  User,
} from 'lucide-react-native';
import { styles, COLORS } from './styles/ViolationDetailScreenStyles';

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

const getSeverityColor = (severity) => {
  switch (severity) {
    case 'Critical':
      return '#ef4444';
    case 'High':
      return '#f59e0b';
    case 'Medium':
      return '#3b82f6';
    case 'Low':
      return '#10b981';
    default:
      return '#64748b';
  }
};

const ViolationDetailScreen = ({ navigation, route }) => {
  // Get violation data from navigation params or use default
  const violation = route?.params?.violation || {
    id: 1,
    type: 'No Helmet',
    zone: 'Zone A - Construction Site',
    time: '10:42 AM',
    date: 'Today',
    severity: 'High',
    status: 'Pending',
    workerImage: require('../../assets/000001_jpg.rf.13bbbb75beaf9a127850c10c49992ba3.jpg'),
    isLocalImage: true,
    highlightArea: { top: 10, left: 30, width: 40, height: 30 },
    description: 'Worker detected without safety helmet in active construction zone.',
  };

  const [status, setStatus] = useState(violation.status);
  const [isResolving, setIsResolving] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const ViolationIcon = getViolationIcon(violation.type);
  const violationColor = getViolationColor(violation.type);
  const severityColor = getSeverityColor(violation.severity);

  const handleBack = () => {
    if (navigation && navigation.goBack) {
      navigation.goBack();
    }
  };

  const handleMarkAsResolved = async () => {
    if (status === 'Resolved') {
      Alert.alert('Already Resolved', 'This incident has already been marked as resolved.');
      return;
    }

    Alert.alert(
      'Mark as Resolved',
      'Are you sure you want to mark this incident as resolved?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            setIsResolving(true);
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));
            setStatus('Resolved');
            setIsResolving(false);
            Alert.alert('Success', 'Incident has been marked as resolved.');
          },
        },
      ]
    );
  };

  const handleShareReport = async () => {
    try {
      const reportText = `
SafeSite AI - Incident Report
==============================
Violation ID: #${violation.id}
Type: ${violation.type}
Location: ${violation.zone}
Date: ${violation.date}
Time: ${violation.time}
Severity: ${violation.severity}
Status: ${status}

Description:
${violation.description}

Detected by: SafeSite AI System
==============================
      `.trim();

      await Share.share({
        message: reportText,
        title: `SafeSite AI - Incident Report #${violation.id}`,
      });

      console.log('Report shared successfully');
    } catch (error) {
      console.error('Error sharing report:', error);
      Alert.alert('Error', 'Failed to share the report. Please try again.');
    }
  };

  const MetadataItem = ({ icon: Icon, label, value, valueColor }) => (
    <View style={styles.metadataItem}>
      <View style={styles.metadataIconContainer}>
        <Icon size={18} color={COLORS.secondary} />
      </View>
      <View style={styles.metadataTextContainer}>
        <Text style={styles.metadataLabel}>{label}</Text>
        <Text style={[styles.metadataValue, valueColor && { color: valueColor }]}>
          {value}
        </Text>
      </View>
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
            <Text style={styles.headerTitle}>Incident Details</Text>
            <View style={styles.headerBadge}>
              <FileText size={12} color={COLORS.surface} />
              <Text style={styles.headerBadgeText}>Report #{violation.id}</Text>
            </View>
          </View>
          <View style={styles.headerRight} />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Evidence Image Section */}
        <Card style={styles.evidenceCard} mode="elevated">
          <View style={styles.evidenceImageContainer}>
            {violation.workerImage && !imageError ? (
              <>
                <Image
                  source={violation.isLocalImage ? violation.workerImage : { uri: violation.workerImage }}
                  style={styles.evidenceImage}
                  resizeMode="cover"
                  onLoadStart={() => setImageLoading(true)}
                  onLoadEnd={() => setImageLoading(false)}
                  onError={() => {
                    setImageError(true);
                    setImageLoading(false);
                  }}
                />
                {/* Loading indicator */}
                {imageLoading && (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.info} />
                    <Text style={styles.loadingText}>Loading evidence...</Text>
                  </View>
                )}
                {/* Dark overlay */}
                <View style={styles.imageOverlay} />
                {/* Highlight box */}
                {!imageLoading && (
                  <View
                    style={[
                      styles.highlightBox,
                      {
                        top: `${violation.highlightArea?.top || 10}%`,
                        left: `${violation.highlightArea?.left || 30}%`,
                        width: `${violation.highlightArea?.width || 40}%`,
                        height: `${violation.highlightArea?.height || 30}%`,
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
                {/* AI Badge */}
                <View style={styles.aiBadge}>
                  <ScanLine size={12} color="#00ff88" />
                  <Text style={styles.aiBadgeText}>AI DETECTED</Text>
                </View>
                {/* Violation label */}
                <View style={[styles.violationBadgeOnImage, { backgroundColor: violationColor }]}>
                  <ViolationIcon size={14} color="#ffffff" />
                  <Text style={styles.violationBadgeText}>{violation.type}</Text>
                </View>
              </>
            ) : (
              <View style={styles.placeholderContainer}>
                <Surface style={styles.placeholderIconSurface} elevation={0}>
                  <Camera size={48} color={COLORS.secondary} strokeWidth={1.5} />
                </Surface>
                <Text style={styles.placeholderText}>Evidence Photo</Text>
                <Text style={styles.placeholderSubtext}>
                  {imageError ? 'Failed to load image' : 'No image available'}
                </Text>
              </View>
            )}
          </View>
        </Card>

        {/* Incident Report Card */}
        <Card style={styles.incidentCard} mode="elevated">
          <Card.Content style={styles.incidentCardContent}>
            <View style={styles.incidentHeader}>
              <View style={styles.incidentTitleRow}>
                <View style={[styles.incidentIconContainer, { backgroundColor: `${violationColor}15` }]}>
                  <ViolationIcon size={24} color={violationColor} strokeWidth={2} />
                </View>
                <View style={styles.incidentTitleContainer}>
                  <Text style={styles.incidentLabel}>Violation Type</Text>
                  <Text style={[styles.incidentTitle, { color: violationColor }]}>
                    {violation.type}
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: status === 'Resolved' ? `${COLORS.success}15` : `${COLORS.warning}15`,
                  },
                ]}
              >
                {status === 'Resolved' ? (
                  <CheckCircle size={14} color={COLORS.success} />
                ) : (
                  <AlertTriangle size={14} color={COLORS.warning} />
                )}
                <Text
                  style={[
                    styles.statusText,
                    { color: status === 'Resolved' ? COLORS.success : COLORS.warning },
                  ]}
                >
                  {status}
                </Text>
              </View>
            </View>

            <Divider style={styles.divider} />

            {/* Description */}
            <View style={styles.descriptionSection}>
              <Text style={styles.descriptionLabel}>Description</Text>
              <Text style={styles.descriptionText}>{violation.description}</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Metadata Grid Card */}
        <Card style={styles.metadataCard} mode="elevated">
          <Card.Content style={styles.metadataCardContent}>
            <View style={styles.metadataSectionHeader}>
              <Shield size={18} color={COLORS.primary} />
              <Text style={styles.metadataSectionTitle}>Incident Metadata</Text>
            </View>

            <View style={styles.metadataGrid}>
              <MetadataItem
                icon={MapPin}
                label="Zone"
                value={violation.zone}
              />
              <MetadataItem
                icon={Calendar}
                label="Date"
                value={violation.date}
              />
              <MetadataItem
                icon={Clock}
                label="Timestamp"
                value={violation.time}
              />
              <MetadataItem
                icon={Gauge}
                label="Severity"
                value={violation.severity}
                valueColor={severityColor}
              />
              <MetadataItem
                icon={User}
                label="Detected By"
                value="AI System"
              />
              <MetadataItem
                icon={FileText}
                label="Report ID"
                value={`#${violation.id}`}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <Button
            mode="contained"
            onPress={handleMarkAsResolved}
            loading={isResolving}
            disabled={isResolving || status === 'Resolved'}
            style={[
              styles.resolveButton,
              status === 'Resolved' && styles.resolvedButton,
            ]}
            contentStyle={styles.resolveButtonContent}
            labelStyle={styles.resolveButtonLabel}
            icon={() =>
              status === 'Resolved' ? (
                <CheckCircle size={20} color="#ffffff" />
              ) : (
                <CheckCircle size={20} color="#ffffff" />
              )
            }
          >
            {status === 'Resolved' ? 'Already Resolved' : 'Mark as Resolved'}
          </Button>

          <Button
            mode="outlined"
            onPress={handleShareReport}
            style={styles.shareButton}
            contentStyle={styles.shareButtonContent}
            labelStyle={styles.shareButtonLabel}
            icon={() => <Share2 size={18} color={COLORS.primary} />}
          >
            Share Report
          </Button>
        </View>

        {/* Footer Info */}
        <View style={styles.footerInfo}>
          <ScanLine size={14} color={COLORS.secondary} />
          <Text style={styles.footerText}>
            Detected and analyzed by SafeSite AI v2.0
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default ViolationDetailScreen;
