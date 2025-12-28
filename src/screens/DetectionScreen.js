import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StatusBar,
  TouchableOpacity,
  Animated,
  Modal,
  TextInput,
} from 'react-native';
import {
  Text,
  Surface,
} from 'react-native-paper';
import {
  Camera,
  ArrowLeft,
  AlertTriangle,
  Cpu,
  Radio,
  Shield,
  Activity,
  Play,
  Scan,
  Crosshair,
  Power,
  MapPin,
  X,
  Check,
} from 'lucide-react-native';
import { styles, COLORS, CAMERA_HEIGHT } from './styles/DetectionScreenStyles';

const DetectionScreen = ({ navigation, onStopDetection }) => {
  // Scanning state - false means waiting to start, true means actively scanning
  const [isScanning, setIsScanning] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [recBlink, setRecBlink] = useState(true);
  const [confidence, setConfidence] = useState(96);
  const [latency, setLatency] = useState(24);
  const [fps, setFps] = useState(30);
  const [boundingBoxPos, setBoundingBoxPos] = useState({ top: 55, left: 35 });
  const [violationsCount, setViolationsCount] = useState(0);
  const [safeWorkersCount, setSafeWorkersCount] = useState(0);
  const [framesProcessed, setFramesProcessed] = useState(0);
  const [scanningProgress, setScanningProgress] = useState(0);
  const [showDetections, setShowDetections] = useState(false);
  const [deviceLocation, setDeviceLocation] = useState('');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [tempLocation, setTempLocation] = useState('');

  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.5)).current;
  const buttonPulseAnim = useRef(new Animated.Value(1)).current;
  const startButtonGlow = useRef(new Animated.Value(0)).current;

  // Button pulse animation when not scanning
  useEffect(() => {
    if (!isScanning) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(buttonPulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(buttonPulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();

      const glowAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(startButtonGlow, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(startButtonGlow, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      );
      glowAnimation.start();

      return () => {
        pulseAnimation.stop();
        glowAnimation.stop();
      };
    }
  }, [isScanning, buttonPulseAnim, startButtonGlow]);

  // Elapsed time counter - only when scanning
  useEffect(() => {
    let interval;
    if (isScanning && isRecording) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
        setFramesProcessed((prev) => prev + 30);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isScanning, isRecording]);

  // Blinking REC indicator - only when scanning
  useEffect(() => {
    let blinkInterval;
    if (isScanning) {
      blinkInterval = setInterval(() => {
        setRecBlink((prev) => !prev);
      }, 500);
    }
    return () => clearInterval(blinkInterval);
  }, [isScanning]);

  // Jitter effect for bounding box and confidence - only when scanning
  useEffect(() => {
    let jitterInterval;
    if (isScanning && showDetections) {
      jitterInterval = setInterval(() => {
        setConfidence(Math.floor(Math.random() * 5) + 94);
        setLatency(Math.floor(Math.random() * 15) + 18);
        setFps(Math.floor(Math.random() * 5) + 28);
        setBoundingBoxPos({
          top: 55 + Math.floor(Math.random() * 6) - 3,
          left: 35 + Math.floor(Math.random() * 6) - 3,
        });
      }, 800);
    }
    return () => clearInterval(jitterInterval);
  }, [isScanning, showDetections]);

  // Scanning progress simulation
  useEffect(() => {
    let progressInterval;
    if (isScanning && !showDetections) {
      progressInterval = setInterval(() => {
        setScanningProgress((prev) => {
          if (prev >= 100) {
            setShowDetections(true);
            setViolationsCount(3);
            setSafeWorkersCount(12);
            return 100;
          }
          return prev + 5;
        });
      }, 150);
    }
    return () => clearInterval(progressInterval);
  }, [isScanning, showDetections]);

  // Scanning line animation - only when scanning
  useEffect(() => {
    if (isScanning) {
      const scanAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(scanLineAnim, {
            toValue: 1,
            duration: 2500,
            useNativeDriver: true,
          }),
          Animated.timing(scanLineAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );
      scanAnimation.start();
      return () => scanAnimation.stop();
    }
  }, [isScanning, scanLineAnim]);

  // Pulse animation for detection box - only when showing detections
  useEffect(() => {
    if (showDetections) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.02,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();
      return () => pulseAnimation.stop();
    }
  }, [showDetections, pulseAnim]);

  // Glow animation - only when showing detections
  useEffect(() => {
    if (showDetections) {
      const glowAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.5,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      glowAnimation.start();
      return () => glowAnimation.stop();
    }
  }, [showDetections, glowAnim]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleBack = () => {
    if (navigation && navigation.goBack) {
      navigation.goBack();
    }
  };

  const handleStartScanning = () => {
    setIsScanning(true);
    setIsRecording(true);
    setScanningProgress(0);
    setShowDetections(false);
    setViolationsCount(0);
    setSafeWorkersCount(0);
    setElapsedTime(0);
    setFramesProcessed(0);
  };

  const handleStopMonitoring = () => {
    setIsScanning(false);
    setIsRecording(false);
    if (onStopDetection) {
      onStopDetection();
    }
    if (navigation && navigation.goBack) {
      navigation.goBack();
    }
  };

  const handleOpenLocationModal = () => {
    setTempLocation(deviceLocation);
    setShowLocationModal(true);
  };

  const handleSaveLocation = () => {
    setDeviceLocation(tempLocation.trim());
    setShowLocationModal(false);
  };

  const handleCancelLocation = () => {
    setTempLocation('');
    setShowLocationModal(false);
  };

  const scanLineTranslate = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, CAMERA_HEIGHT],
  });

  // Render the initial state with Start Scanning button
  const renderInitialState = () => (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ArrowLeft size={22} color={COLORS.white} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>AI DETECTION</Text>
          <View style={styles.sessionBadge}>
            <View style={styles.statusDotIdle} />
            <Text style={styles.sessionIdIdle}>STANDBY MODE</Text>
          </View>
        </View>

        <View style={styles.timerContainerIdle}>
          <Power size={18} color={COLORS.gray} />
        </View>
      </View>

      {/* Camera Preview Container */}
      <View style={styles.cameraContainer}>
        <Surface style={styles.cameraFeedIdle} elevation={0}>
          {/* Corner Brackets */}
          <View style={[styles.cornerBracket, styles.cornerBracketIdle, styles.cornerTL]} />
          <View style={[styles.cornerBracket, styles.cornerBracketIdle, styles.cornerTR]} />
          <View style={[styles.cornerBracket, styles.cornerBracketIdle, styles.cornerBL]} />
          <View style={[styles.cornerBracket, styles.cornerBracketIdle, styles.cornerBR]} />

          {/* Grid Overlay */}
          <View style={styles.gridContainer}>
            {[...Array(5)].map((_, i) => (
              <View key={`h-${i}`} style={[styles.gridLineH, styles.gridLineIdle, { top: `${(i + 1) * 16.66}%` }]} />
            ))}
            {[...Array(7)].map((_, i) => (
              <View key={`v-${i}`} style={[styles.gridLineV, styles.gridLineIdle, { left: `${(i + 1) * 12.5}%` }]} />
            ))}
          </View>

          {/* Center Content */}
          <View style={styles.idleCenterContent}>
            <View style={styles.cameraIconContainer}>
              <Camera size={50} color={COLORS.gray} />
            </View>
            <Text style={styles.idleTitle}>Camera Ready</Text>
            <Text style={styles.idleSubtitle}>Press the button below to start scanning</Text>
          </View>

          {/* Crosshair overlay */}
          <View style={styles.crosshairOverlay}>
            <Crosshair size={80} color="rgba(0, 212, 255, 0.2)" strokeWidth={1} />
          </View>

          {/* Bottom Status */}
          <View style={styles.idleBottomStatus}>
            <View style={styles.idleStatusItem}>
              <Cpu size={14} color={COLORS.gray} />
              <Text style={styles.idleStatusText}>YOLOv Ready</Text>
            </View>
          </View>
        </Surface>
      </View>

      {/* Info Cards */}
      <View style={styles.infoCardsContainer}>
        <View style={styles.infoCard}>
          <Scan size={24} color={COLORS.primary} />
          <Text style={styles.infoCardTitle}>Real-time Detection</Text>
          <Text style={styles.infoCardDesc}>AI-powered safety monitoring</Text>
        </View>
        <View style={styles.infoCard}>
          <Shield size={24} color={COLORS.success} />
          <Text style={styles.infoCardTitle}>PPE Compliance</Text>
          <Text style={styles.infoCardDesc}>Helmet & vest detection</Text>
        </View>
      </View>

      {/* Location Setting */}
      <TouchableOpacity
        style={styles.locationButton}
        onPress={handleOpenLocationModal}
        activeOpacity={0.8}
      >
        <View style={styles.locationButtonInner}>
          <MapPin size={20} color={deviceLocation ? COLORS.success : COLORS.gray} />
          <View style={styles.locationTextContainer}>
            <Text style={styles.locationLabel}>Device Location</Text>
            <Text style={[styles.locationValue, !deviceLocation && styles.locationPlaceholder]}>
              {deviceLocation || 'Tap to set location'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Start Scanning Button */}
      <View style={styles.startButtonContainer}>
        <Animated.View
          style={[
            styles.startButtonGlow,
            { opacity: startButtonGlow },
          ]}
        />
        <Animated.View style={{ transform: [{ scale: buttonPulseAnim }] }}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartScanning}
            activeOpacity={0.8}
          >
            <View style={styles.startButtonInner}>
              <View style={styles.startIconContainer}>
                <Play size={28} color={COLORS.white} fill={COLORS.white} />
              </View>
              <View style={styles.startButtonTextContainer}>
                <Text style={styles.startButtonTitle}>START SCANNING</Text>
                <Text style={styles.startButtonSubtitle}>Tap to begin AI detection</Text>
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Footer */}
      <View style={styles.footerStatus}>
        <Text style={styles.footerText}>SafeSite AI v2.0 | Neural Engine Ready</Text>
      </View>
    </View>
  );

  // Render the scanning state
  const renderScanningState = () => (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* Technical Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ArrowLeft size={22} color={COLORS.white} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>LIVE MONITORING</Text>
          <View style={styles.sessionBadge}>
            <Radio size={10} color={COLORS.primary} />
            <Text style={styles.sessionId}>ACTIVE</Text>
          </View>
        </View>

        <View style={styles.timerContainer}>
          <Text style={styles.timerLabel}>DURATION</Text>
          <Text style={styles.timerValue}>{formatTime(elapsedTime)}</Text>
        </View>
      </View>

      {/* Camera Feed Container */}
      <View style={styles.cameraContainer}>
        <Surface style={styles.cameraFeed} elevation={0}>
          {/* Corner Brackets */}
          <View style={[styles.cornerBracket, styles.cornerTL]} />
          <View style={[styles.cornerBracket, styles.cornerTR]} />
          <View style={[styles.cornerBracket, styles.cornerBL]} />
          <View style={[styles.cornerBracket, styles.cornerBR]} />

          {/* Grid Overlay */}
          <View style={styles.gridContainer}>
            {[...Array(5)].map((_, i) => (
              <View key={`h-${i}`} style={[styles.gridLineH, { top: `${(i + 1) * 16.66}%` }]} />
            ))}
            {[...Array(7)].map((_, i) => (
              <View key={`v-${i}`} style={[styles.gridLineV, { left: `${(i + 1) * 12.5}%` }]} />
            ))}
          </View>

          {/* Scanning Line Effect */}
          <Animated.View
            style={[
              styles.scanLine,
              { transform: [{ translateY: scanLineTranslate }] },
            ]}
          />

          {/* Camera Placeholder Background */}
          <View style={styles.cameraBackground}>
            <Camera size={60} color="rgba(0, 212, 255, 0.15)" />
            <Text style={styles.cameraPlaceholderText}>
              {showDetections ? 'LIVE FEED ACTIVE' : 'SCANNING AREA...'}
            </Text>
            {!showDetections && (
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${scanningProgress}%` }]} />
                </View>
                <Text style={styles.progressText}>{scanningProgress}%</Text>
              </View>
            )}
          </View>

          {/* HUD Overlay - Top */}
          <View style={styles.hudTop}>
            <View style={styles.hudLeft}>
              <View style={styles.recIndicator}>
                <View style={[styles.recDot, { opacity: recBlink ? 1 : 0.3 }]} />
                <Text style={styles.recText}>REC</Text>
              </View>
            </View>

            <View style={styles.hudCenter}>
              <View style={styles.hudItem}>
                <Cpu size={12} color={COLORS.primary} />
                <Text style={styles.hudLabel}>AI MODEL</Text>
                <Text style={styles.hudValue}>YOLO</Text>
              </View>
            </View>

            </View>

          {/* HUD Overlay - Bottom */}
          <View style={styles.hudBottom}>
            <View style={styles.hudBottomItem}>
              <Activity size={12} color={COLORS.success} />
              <Text style={styles.hudBottomText}>{fps} FPS</Text>
            </View>
            {deviceLocation ? (
              <View style={styles.hudBottomItem}>
                <MapPin size={12} color={COLORS.warning} />
                <Text style={styles.hudBottomText}>{deviceLocation}</Text>
              </View>
            ) : null}
          </View>

          {/* Detection Bounding Boxes - Only show after scanning complete */}
          {showDetections && (
            <>
              {/* Violation Box */}
              <Animated.View
                style={[
                  styles.boundingBox,
                  {
                    top: boundingBoxPos.top,
                    left: boundingBoxPos.left,
                    transform: [{ scale: pulseAnim }],
                  },
                ]}
              >
                <Animated.View style={[styles.bbCorner, styles.bbCornerTL, { opacity: glowAnim }]} />
                <Animated.View style={[styles.bbCorner, styles.bbCornerTR, { opacity: glowAnim }]} />
                <Animated.View style={[styles.bbCorner, styles.bbCornerBL, { opacity: glowAnim }]} />
                <Animated.View style={[styles.bbCorner, styles.bbCornerBR, { opacity: glowAnim }]} />

                <View style={styles.detectionLabel}>
                  <AlertTriangle size={12} color={COLORS.white} />
                  <Text style={styles.detectionLabelText}>NO HELMET ({confidence}%)</Text>
                </View>

                <View style={styles.crosshair}>
                  <View style={styles.crosshairH} />
                  <View style={styles.crosshairV} />
                </View>
              </Animated.View>

                          </>
          )}

          {/* AI Processing Badge */}
          <View style={styles.aiProcessingBadge}>
            <View style={[styles.aiProcessingDot, { backgroundColor: showDetections ? COLORS.success : COLORS.warning }]} />
            <Text style={[styles.aiProcessingText, { color: showDetections ? COLORS.success : COLORS.warning }]}>
              {showDetections ? 'AI ACTIVE' : 'ANALYZING'}
            </Text>
          </View>
        </Surface>
      </View>

      {/* Session Stats Bar */}
      <View style={styles.sessionStatsBar}>
        <View style={styles.statBox}>
          <View style={styles.statBoxHeader}>
            <AlertTriangle size={16} color={COLORS.error} />
            <Text style={styles.statBoxLabel}>VIOLATIONS</Text>
          </View>
          <Text style={[styles.statBoxValue, { color: COLORS.error }]}>{violationsCount}</Text>
          <Text style={styles.statBoxSub}>Detected</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statBox}>
          <View style={styles.statBoxHeader}>
            <Shield size={16} color={COLORS.success} />
            <Text style={styles.statBoxLabel}>SAFE</Text>
          </View>
          <Text style={[styles.statBoxValue, { color: COLORS.success }]}>{safeWorkersCount}</Text>
          <Text style={styles.statBoxSub}>Workers</Text>
        </View>

        </View>

      {/* Detection Info Panel - Only show when detections are visible */}
      {showDetections && (
        <View style={styles.detectionInfoPanel}>
          <View style={styles.infoPanelHeader}>
            <View style={styles.infoPanelDot} />
            <Text style={styles.infoPanelTitle}>ACTIVE DETECTION</Text>
          </View>
          <View style={styles.infoPanelContent}>
            <View style={styles.infoPanelRow}>
              <Text style={styles.infoPanelLabel}>Violation Type</Text>
              <Text style={styles.infoPanelValueError}>Missing Safety Helmet</Text>
            </View>
            <View style={styles.infoPanelRow}>
              <Text style={styles.infoPanelLabel}>Confidence Score</Text>
              <Text style={styles.infoPanelValue}>{confidence}% Match</Text>
            </View>
            <View style={styles.infoPanelRow}>
              <Text style={styles.infoPanelLabel}>Detection Zone</Text>
              <Text style={styles.infoPanelValue}>Zone A - Main Entry</Text>
            </View>
          </View>
        </View>
      )}

      {/* Stop Monitoring Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.stopButton}
          onPress={handleStopMonitoring}
          activeOpacity={0.8}
        >
          <View style={styles.stopButtonInner}>
            <View style={styles.stopIconSquare} />
            <Text style={styles.stopButtonText}>STOP MONITORING</Text>
          </View>
          <View style={styles.stopButtonGlow} />
        </TouchableOpacity>
      </View>

      {/* Footer Status */}
      <View style={styles.footerStatus}>
        <Text style={styles.footerText}>SafeSite AI v2.0 | Neural Engine Active</Text>
      </View>
    </View>
  );

  // Return based on scanning state
  return (
    <>
      {isScanning ? renderScanningState() : renderInitialState()}

      {/* Location Modal */}
      <Modal
        visible={showLocationModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelLocation}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Set Device Location</Text>
              <TouchableOpacity onPress={handleCancelLocation} style={styles.modalCloseButton}>
                <X size={22} color={COLORS.gray} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalContent}>
              <View style={styles.locationInputContainer}>
                <MapPin size={20} color={COLORS.primary} />
                <TextInput
                  style={styles.locationInput}
                  placeholder="Enter location (e.g., Site A - Main Gate)"
                  placeholderTextColor={COLORS.gray}
                  value={tempLocation}
                  onChangeText={setTempLocation}
                  autoFocus={true}
                />
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={handleCancelLocation}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveButton}
                onPress={handleSaveLocation}
              >
                <Check size={18} color={COLORS.white} />
                <Text style={styles.modalSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default DetectionScreen;
