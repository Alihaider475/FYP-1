import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Dimensions,
  Animated,
  Image,
} from 'react-native';
import { Text, Button } from 'react-native-paper';
import {
  Shield,
  HardHat,
  Scan,
  ChevronRight,
  CheckCircle,
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const COLORS = {
  primary: '#0f172a',
  secondary: '#64748b',
  background: '#f8fafc',
  surface: '#ffffff',
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  accent: '#3b82f6',
};

const WelcomeScreen = ({ onGetStarted }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleGetStarted = () => {
    if (onGetStarted) {
      onGetStarted();
    }
  };

  const features = [
    { icon: Scan, text: 'AI-Powered Detection' },
    { icon: HardHat, text: 'Safety Monitoring' },
    { icon: CheckCircle, text: 'Real-time Alerts' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Background */}
      <View style={styles.background}>
        <View style={styles.circleTop} />
        <View style={styles.circleBottom} />
      </View>

      {/* Content */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Worker Illustration */}
        <Animated.View
          style={[
            styles.illustrationContainer,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          <View style={styles.workerIllustration}>
            {/* Hard Hat */}
            <View style={styles.hardHat}>
              <View style={styles.hardHatTop} />
              <View style={styles.hardHatBrim} />
            </View>

            {/* Face */}
            <View style={styles.face}>
              <View style={styles.eyeLeft} />
              <View style={styles.eyeRight} />
            </View>

            {/* Body with Vest */}
            <View style={styles.body}>
              <View style={styles.vestStripe} />
              <View style={styles.vestStripeRight} />
            </View>

            {/* Safety Badge */}
            <View style={styles.safetyBadge}>
              <Shield size={20} color={COLORS.surface} />
            </View>
          </View>

          {/* Scanning Effect */}
          <View style={styles.scanRing}>
            <View style={styles.scanRingInner} />
          </View>
        </Animated.View>

        {/* App Logo & Title */}
        <View style={styles.branding}>
          <View style={styles.logoContainer}>
            <Shield size={32} color={COLORS.accent} strokeWidth={2.5} />
          </View>
          <Text style={styles.appName}>SafeSite AI</Text>
          <Text style={styles.tagline}>
            Intelligent Workplace Safety Monitoring
          </Text>
        </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <feature.icon size={18} color={COLORS.accent} />
              </View>
              <Text style={styles.featureText}>{feature.text}</Text>
            </View>
          ))}
        </View>

        {/* Get Started Button */}
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleGetStarted}
            style={styles.getStartedButton}
            contentStyle={styles.getStartedButtonContent}
            labelStyle={styles.getStartedButtonLabel}
            buttonColor={COLORS.accent}
            icon={() => <ChevronRight size={20} color={COLORS.surface} />}
          >
            Get Started
          </Button>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Protecting workers with AI technology
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  circleTop: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
  },
  circleBottom: {
    position: 'absolute',
    bottom: -150,
    left: -100,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 80,
    paddingBottom: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  workerIllustration: {
    width: 140,
    height: 180,
    alignItems: 'center',
    position: 'relative',
  },
  hardHat: {
    alignItems: 'center',
    zIndex: 2,
  },
  hardHatTop: {
    width: 70,
    height: 35,
    backgroundColor: COLORS.warning,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
  },
  hardHatBrim: {
    width: 85,
    height: 10,
    backgroundColor: COLORS.warning,
    borderRadius: 5,
    marginTop: -2,
  },
  face: {
    width: 60,
    height: 50,
    backgroundColor: '#fbbf24',
    borderRadius: 30,
    marginTop: -5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
    paddingTop: 10,
  },
  eyeLeft: {
    width: 8,
    height: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  eyeRight: {
    width: 8,
    height: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  body: {
    width: 80,
    height: 70,
    backgroundColor: COLORS.success,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginTop: -5,
    position: 'relative',
    overflow: 'hidden',
  },
  vestStripe: {
    position: 'absolute',
    left: 15,
    top: 10,
    width: 8,
    height: 50,
    backgroundColor: COLORS.warning,
    borderRadius: 4,
  },
  vestStripeRight: {
    position: 'absolute',
    right: 15,
    top: 10,
    width: 8,
    height: 50,
    backgroundColor: COLORS.warning,
    borderRadius: 4,
  },
  safetyBadge: {
    position: 'absolute',
    bottom: 20,
    right: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  scanRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanRingInner: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  branding: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.surface,
    letterSpacing: 1,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 25,
    gap: 8,
  },
  featureIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 12,
    color: COLORS.surface,
    fontWeight: '500',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 24,
  },
  getStartedButton: {
    borderRadius: 16,
  },
  getStartedButtonContent: {
    paddingVertical: 10,
    flexDirection: 'row-reverse',
  },
  getStartedButtonLabel: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  footer: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
  },
});

export default WelcomeScreen;
