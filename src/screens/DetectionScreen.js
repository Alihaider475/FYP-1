import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Surface,
  Button,
} from 'react-native-paper';
import {
  Camera,
  Circle,
  ArrowLeft,
  AlertTriangle,
  Zap,
  Cpu,
} from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CAMERA_ASPECT_RATIO = 4 / 3;
const CAMERA_WIDTH = SCREEN_WIDTH - 32;
const CAMERA_HEIGHT = CAMERA_WIDTH / CAMERA_ASPECT_RATIO;

const COLORS = {
  primary: '#0f172a',
  secondary: '#64748b',
  background: '#f8fafc',
  surface: '#ffffff',
  success: '#10b981',
  error: '#ef4444',
  dark: '#0f172a',
  darkSurface: '#1e293b',
};

const DetectionScreen = ({ navigation, onStopDetection }) => {
  const [isRecording, setIsRecording] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [detectionCount, setDetectionCount] = useState(1);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const handleBack = () => {
    if (navigation && navigation.goBack) {
      navigation.goBack();
    }
  };

  const handleStopDetection = () => {
    setIsRecording(false);
    if (onStopDetection) {
      onStopDetection();
    }
    if (navigation && navigation.goBack) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.dark} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ArrowLeft size={24} color={COLORS.surface} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>AI Detection</Text>
          <View style={styles.liveIndicator}>
            <Circle
              size={8}
              color={COLORS.error}
              fill={COLORS.error}
              strokeWidth={0}
            />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.timerText}>{formatTime(elapsedTime)}</Text>
        </View>
      </View>

      {/* Camera View Placeholder */}
      <View style={styles.cameraContainer}>
        <Surface style={styles.cameraPlaceholder} elevation={0}>
          {/* Grid overlay */}
          <View style={styles.gridOverlay}>
            <View style={styles.gridLine} />
            <View style={[styles.gridLine, styles.gridLineVertical]} />
          </View>

          {/* Camera icon placeholder */}
          <View style={styles.cameraIconContainer}>
            <Camera size={48} color="rgba(255, 255, 255, 0.3)" />
            <Text style={styles.cameraPlaceholderText}>
              Live Camera Feed
            </Text>
          </View>

          {/* Detection Bounding Box */}
          <View style={styles.boundingBox}>
            <View style={styles.boundingBoxCornerTL} />
            <View style={styles.boundingBoxCornerTR} />
            <View style={styles.boundingBoxCornerBL} />
            <View style={styles.boundingBoxCornerBR} />

            {/* Detection Label */}
            <View style={styles.detectionLabel}>
              <AlertTriangle size={14} color={COLORS.surface} />
              <Text style={styles.detectionLabelText}>
                NO HELMET (98%)
              </Text>
            </View>
          </View>

          {/* AI Processing Indicator */}
          <View style={styles.aiIndicator}>
            <Cpu size={14} color={COLORS.success} />
            <Text style={styles.aiIndicatorText}>AI Processing</Text>
          </View>
        </Surface>
      </View>

      {/* Detection Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{detectionCount}</Text>
          <Text style={styles.statLabel}>Violations</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>Zone A</Text>
          <Text style={styles.statLabel}>Current Zone</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <View style={styles.fpsContainer}>
            <Zap size={16} color={COLORS.success} />
            <Text style={styles.statValue}>30</Text>
          </View>
          <Text style={styles.statLabel}>FPS</Text>
        </View>
      </View>

      {/* Detection Info Card */}
      <Surface style={styles.infoCard} elevation={2}>
        <View style={styles.infoHeader}>
          <AlertTriangle size={20} color={COLORS.error} />
          <Text style={styles.infoTitle}>Active Detection</Text>
        </View>
        <View style={styles.infoContent}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Violation Type:</Text>
            <Text style={styles.infoValueError}>No Helmet Detected</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Confidence:</Text>
            <Text style={styles.infoValue}>98%</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Location:</Text>
            <Text style={styles.infoValue}>Zone A - Entry Gate</Text>
          </View>
        </View>
      </Surface>

      {/* Stop Detection Button */}
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleStopDetection}
          style={styles.stopButton}
          contentStyle={styles.stopButtonContent}
          labelStyle={styles.stopButtonLabel}
          buttonColor={COLORS.error}
          icon={() => (
            <View style={styles.stopIcon}>
              <View style={styles.stopIconSquare} />
            </View>
          )}
        >
          Stop Detection
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.darkSurface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.surface,
    marginBottom: 4,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.error,
    marginLeft: 4,
  },
  headerRight: {
    backgroundColor: COLORS.darkSurface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  timerText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.surface,
    fontVariant: ['tabular-nums'],
  },
  cameraContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  cameraPlaceholder: {
    width: CAMERA_WIDTH,
    height: CAMERA_HEIGHT,
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridLine: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  gridLineVertical: {
    width: 1,
    height: '100%',
  },
  cameraIconContainer: {
    alignItems: 'center',
  },
  cameraPlaceholderText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.3)',
    marginTop: 8,
  },
  boundingBox: {
    position: 'absolute',
    top: 60,
    left: 40,
    width: 120,
    height: 160,
    borderWidth: 2,
    borderColor: COLORS.error,
    borderRadius: 4,
  },
  boundingBoxCornerTL: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 16,
    height: 16,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: COLORS.error,
    borderTopLeftRadius: 4,
  },
  boundingBoxCornerTR: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: COLORS.error,
    borderTopRightRadius: 4,
  },
  boundingBoxCornerBL: {
    position: 'absolute',
    bottom: -2,
    left: -2,
    width: 16,
    height: 16,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: COLORS.error,
    borderBottomLeftRadius: 4,
  },
  boundingBoxCornerBR: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: COLORS.error,
    borderBottomRightRadius: 4,
  },
  detectionLabel: {
    position: 'absolute',
    top: -28,
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.error,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  detectionLabelText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.surface,
    marginLeft: 4,
  },
  aiIndicator: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  aiIndicatorText: {
    fontSize: 11,
    color: COLORS.success,
    marginLeft: 6,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.darkSurface,
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.surface,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.secondary,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  fpsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoCard: {
    marginHorizontal: 16,
    backgroundColor: COLORS.darkSurface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.surface,
    marginLeft: 8,
  },
  infoContent: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 13,
    color: COLORS.secondary,
  },
  infoValue: {
    fontSize: 13,
    color: COLORS.surface,
    fontWeight: '500',
  },
  infoValueError: {
    fontSize: 13,
    color: COLORS.error,
    fontWeight: '600',
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    marginTop: 'auto',
  },
  stopButton: {
    borderRadius: 12,
  },
  stopButtonContent: {
    paddingVertical: 12,
  },
  stopButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  stopIcon: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopIconSquare: {
    width: 12,
    height: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 2,
  },
});

export default DetectionScreen;
