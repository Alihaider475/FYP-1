import React, { useEffect, useRef } from 'react';
import {View,StatusBar,Dimensions,Animated,Image} from 'react-native';
import { Text, Button } from 'react-native-paper';
import {Shield,HardHat,Scan,ChevronRight,CheckCircle} from 'lucide-react-native';
import styles from './styles/WelcomeScreenStyles';
import { COLORS } from './styles/colors';

const { width, height } = Dimensions.get('window');

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

export default WelcomeScreen;
