import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Animated,
  Linking,
} from 'react-native';
import { Text, Button } from 'react-native-paper';
import { Camera, Shield, AlertCircle } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { styles } from './styles/CameraPermissionScreenStyles';

const CameraPermissionScreen = ({ onPermissionGranted, revokedFromSettings = false }) => {
  const [permissionStatus, setPermissionStatus] = useState(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Check initial permission status
    checkPermissionStatus();

    // Start animations
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // Pulse animation for camera icon
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoop.start();

    return () => pulseLoop.stop();
  }, []);

  const checkPermissionStatus = async () => {
    const { status } = await ImagePicker.getCameraPermissionsAsync();
    setPermissionStatus(status);
  };

  const handleRequestPermission = async () => {
    setIsRequesting(true);
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      setPermissionStatus(status);

      if (status === 'granted') {
        // Small delay for better UX
        setTimeout(() => {
          onPermissionGranted();
        }, 500);
      }
    } catch (error) {
      console.error('Permission request error:', error);
    } finally {
      setIsRequesting(false);
    }
  };

  const handleContinue = () => {
    // If permission is already granted, just proceed
    onPermissionGranted();
  };

  const openSettings = () => {
    Linking.openSettings();
  };

  const isGranted = permissionStatus === 'granted';
  const isDenied = permissionStatus === 'denied';

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Header Icon */}
        <Animated.View
          style={[
            styles.iconContainer,
            { transform: [{ scale: pulseAnim }] }
          ]}
        >
          <View style={styles.iconCircle}>
            <Camera size={60} color="#ffffff" strokeWidth={1.5} />
          </View>
        </Animated.View>

        {/* Title */}
        <Text style={styles.title}>Camera Access Required</Text>

        {/* Description */}
        <Text style={styles.description}>
          SafeSite AI needs camera access to detect safety violations and monitor
          workplace compliance in real-time.
        </Text>

        {/* Features List */}
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <Shield size={20} color="#10b981" />
            <Text style={styles.featureText}>Real-time safety monitoring</Text>
          </View>
          <View style={styles.featureItem}>
            <Shield size={20} color="#10b981" />
            <Text style={styles.featureText}>PPE violation detection</Text>
          </View>
          <View style={styles.featureItem}>
            <Shield size={20} color="#10b981" />
            <Text style={styles.featureText}>Instant safety alerts</Text>
          </View>
        </View>

        {/* Revoked from Settings Notice */}
        {revokedFromSettings && (
          <View style={styles.warningContainer}>
            <AlertCircle size={20} color="#f59e0b" />
            <Text style={styles.warningText}>
              Camera access was disabled from settings. Please re-enable camera permission to continue using the app.
            </Text>
          </View>
        )}

        {/* Permission Already Granted Notice - only show if NOT revoked from settings */}
        {isGranted && !revokedFromSettings && (
          <View style={styles.successContainer}>
            <Shield size={20} color="#10b981" />
            <Text style={styles.successText}>
              Camera permission is already granted. Tap continue to proceed.
            </Text>
          </View>
        )}

        {/* Permission Denied Warning - only show if NOT revoked from settings */}
        {isDenied && !revokedFromSettings && (
          <View style={styles.warningContainer}>
            <AlertCircle size={20} color="#f59e0b" />
            <Text style={styles.warningText}>
              Camera permission was denied. Please enable it in your device settings to continue.
            </Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          {revokedFromSettings ? (
            // When revoked from settings, always show "Enable Camera Access" button
            <Button
              mode="contained"
              onPress={handleRequestPermission}
              loading={isRequesting}
              disabled={isRequesting}
              style={styles.primaryButton}
              labelStyle={styles.buttonLabel}
              contentStyle={styles.buttonContent}
            >
              {isRequesting ? 'Requesting...' : 'Enable Camera Access'}
            </Button>
          ) : isGranted ? (
            <Button
              mode="contained"
              onPress={handleContinue}
              style={styles.primaryButton}
              labelStyle={styles.buttonLabel}
              contentStyle={styles.buttonContent}
            >
              Continue to App
            </Button>
          ) : isDenied ? (
            <Button
              mode="contained"
              onPress={openSettings}
              style={styles.primaryButton}
              labelStyle={styles.buttonLabel}
              contentStyle={styles.buttonContent}
            >
              Open Settings
            </Button>
          ) : (
            <Button
              mode="contained"
              onPress={handleRequestPermission}
              loading={isRequesting}
              disabled={isRequesting}
              style={styles.primaryButton}
              labelStyle={styles.buttonLabel}
              contentStyle={styles.buttonContent}
            >
              {isRequesting ? 'Requesting...' : 'Allow Camera Access'}
            </Button>
          )}
        </View>

        {/* Privacy Note */}
        <Text style={styles.privacyNote}>
          Your privacy is important to us. Camera footage is processed locally
          and only safety-relevant data is stored.
        </Text>
      </Animated.View>
    </View>
  );
};

export default CameraPermissionScreen;
