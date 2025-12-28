import { StyleSheet } from 'react-native';

export const COLORS = {
  primary: '#0f172a',
  secondary: '#64748b',
  background: '#f8fafc',
  surface: '#ffffff',
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
};

export const styles = StyleSheet.create({
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  evidenceCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  evidenceImageContainer: {
    width: '100%',
    height: 240,
    backgroundColor: '#1a1a2e',
    position: 'relative',
  },
  evidenceImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  highlightBox: {
    position: 'absolute',
    borderWidth: 3,
    borderStyle: 'solid',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  highlightCorner: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderWidth: 4,
  },
  cornerTopLeft: {
    top: -3,
    left: -3,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  cornerTopRight: {
    top: -3,
    right: -3,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  cornerBottomLeft: {
    bottom: -3,
    left: -3,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  cornerBottomRight: {
    bottom: -3,
    right: -3,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  aiBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  aiBadgeText: {
    color: '#00ff88',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  violationBadgeOnImage: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 8,
  },
  violationBadgeText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 26, 46, 0.9)',
    zIndex: 10,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: COLORS.info,
    fontWeight: '500',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIconSurface: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  placeholderSubtext: {
    fontSize: 12,
    color: COLORS.secondary,
    marginTop: 4,
  },
  incidentCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    marginBottom: 16,
  },
  incidentCardContent: {
    padding: 20,
  },
  incidentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  incidentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  incidentIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  incidentTitleContainer: {
    marginLeft: 14,
    flex: 1,
  },
  incidentLabel: {
    fontSize: 12,
    color: COLORS.secondary,
    marginBottom: 2,
  },
  incidentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  divider: {
    marginVertical: 16,
    backgroundColor: '#f1f5f9',
  },
  descriptionSection: {
    marginTop: 4,
  },
  descriptionLabel: {
    fontSize: 12,
    color: COLORS.secondary,
    marginBottom: 6,
    fontWeight: '600',
  },
  descriptionText: {
    fontSize: 14,
    color: COLORS.primary,
    lineHeight: 22,
  },
  metadataCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    marginBottom: 20,
  },
  metadataCardContent: {
    padding: 20,
  },
  metadataSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  metadataSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  metadataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  metadataItem: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  metadataIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metadataTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  metadataLabel: {
    fontSize: 11,
    color: COLORS.secondary,
    marginBottom: 2,
  },
  metadataValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
  actionButtonsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  resolveButton: {
    backgroundColor: COLORS.success,
    borderRadius: 14,
  },
  resolvedButton: {
    backgroundColor: COLORS.secondary,
  },
  resolveButtonContent: {
    paddingVertical: 8,
  },
  resolveButtonLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginLeft: 8,
  },
  shareButton: {
    borderColor: COLORS.primary,
    borderWidth: 2,
    borderRadius: 14,
  },
  shareButtonContent: {
    paddingVertical: 6,
  },
  shareButtonLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: 8,
  },
  footerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.secondary,
  },
});

export default styles;
