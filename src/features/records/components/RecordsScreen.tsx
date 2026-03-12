import { Calendar, Download, FileText, Pill, Stethoscope } from 'lucide-react-native';
import React, { useCallback } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { IRecordSummary, IVisit, IVisitCardProps } from '../types';

const SCREEN_WIDTH = Dimensions.get('window').width;

// ─── Mock Data ───

const SUMMARIES: IRecordSummary[] = [
  { id: 'visits', label: 'Total Visits', value: 5, color: '#2196F3' },
  { id: 'prescriptions', label: 'Prescriptions', value: 4, color: '#4CAF50' },
  { id: 'doctors', label: 'Doctors', value: 3, color: '#FF9800' },
];

const VISITS: IVisit[] = [
  {
    id: '1',
    title: 'Routine Cardiac Checkup',
    date: 'March 11, 2026',
    type: 'Routine',
    doctor: { name: 'Dr. Sarah Johnson', specialty: 'Cardiology' },
    prescription: { medication: 'Amlodipine 5mg', dosage: 'Daily' },
    notes: 'Blood pressure within normal range. Continue current medication.',
  },
  {
    id: '2',
    title: 'Annual Physical Examination',
    date: 'February 28, 2026',
    type: 'Routine',
    doctor: { name: 'Dr. Michael Chen', specialty: 'General Practice' },
    prescription: { medication: 'Multivitamin', dosage: 'Daily' },
    notes: 'Overall health is good. Recommended more physical exercise.',
  },
  {
    id: '3',
    title: 'Follow-up Blood Work',
    date: 'February 10, 2026',
    type: 'Follow-up',
    doctor: { name: 'Dr. Sarah Johnson', specialty: 'Cardiology' },
    notes: 'Blood work results are within normal limits. No changes to treatment.',
  },
];

// ─── Summary Cards ───

const SummaryCard: React.FC<{ item: IRecordSummary }> = React.memo(({ item }) => (
  <View style={[styles.summaryCard, { backgroundColor: item.color }]}>
    <Text style={styles.summaryValue}>{item.value}</Text>
    <Text style={styles.summaryLabel}>{item.label}</Text>
  </View>
));

SummaryCard.displayName = 'SummaryCard';

// ─── Visit Card ───

const BADGE_COLORS: Record<string, { bg: string; text: string }> = {
  Routine: { bg: '#4CAF50', text: '#FFFFFF' },
  Emergency: { bg: '#F44336', text: '#FFFFFF' },
  'Follow-up': { bg: '#2196F3', text: '#FFFFFF' },
  Specialist: { bg: '#9C27B0', text: '#FFFFFF' },
};

const VisitCard: React.FC<IVisitCardProps> = React.memo(({ visit, onViewDetails, onDownload }) => {
  const handleViewDetails = useCallback(() => onViewDetails?.(visit.id), [visit.id, onViewDetails]);
  const handleDownload = useCallback(() => onDownload?.(visit.id), [visit.id, onDownload]);

  const badgeColor = BADGE_COLORS[visit.type] ?? BADGE_COLORS.Routine;

  return (
    <View style={styles.timelineRow}>
      {/* Timeline icon */}
      <View style={styles.timelineIconCol}>
        <View style={styles.timelineIcon}>
          <Stethoscope size={16} color='#FFFFFF' />
        </View>
        <View style={styles.timelineLine} />
      </View>

      {/* Card */}
      <View style={styles.visitCard}>
        {/* Badge */}
        <View style={[styles.badge, { backgroundColor: badgeColor.bg }]}>
          <Text style={[styles.badgeText, { color: badgeColor.text }]}>{visit.type}</Text>
        </View>

        {/* Title */}
        <Text style={styles.visitTitle}>{visit.title}</Text>

        {/* Date */}
        <View style={styles.dateRow}>
          <Calendar size={13} color='#9E9E9E' />
          <Text style={styles.dateText}>{visit.date}</Text>
        </View>

        {/* Doctor info card */}
        <View style={styles.doctorCard}>
          <Text style={styles.doctorName}>{visit.doctor.name}</Text>
          <Text style={styles.doctorSpecialty}>{visit.doctor.specialty}</Text>
        </View>

        {/* Prescription (if any) */}
        {visit.prescription && (
          <View style={styles.prescriptionCard}>
            <View style={styles.prescriptionHeader}>
              <Pill size={14} color='#4CAF50' />
              <Text style={styles.prescriptionTitle}>Prescription</Text>
            </View>
            <Text style={styles.prescriptionDetail}>
              {visit.prescription.medication} - {visit.prescription.dosage}
            </Text>
          </View>
        )}

        {/* Notes */}
        {visit.notes && (
          <>
            <Text style={styles.notesLabel}>Doctor's Notes:</Text>
            <Text style={styles.notesText}>{visit.notes}</Text>
          </>
        )}

        {/* Actions */}
        <View style={styles.actionsRow}>
          <Pressable
            onPress={handleViewDetails}
            style={({ pressed }) => [styles.viewDetailsBtn, pressed && styles.viewDetailsBtnPressed]}
            accessibilityRole='button'
            accessibilityLabel={`View details for ${visit.title}`}
          >
            <FileText size={16} color='#FFFFFF' />
            <Text style={styles.viewDetailsBtnText}>View Details</Text>
          </Pressable>
          <Pressable
            onPress={handleDownload}
            style={({ pressed }) => [styles.downloadBtn, pressed && styles.downloadBtnPressed]}
            accessibilityRole='button'
            accessibilityLabel={`Download ${visit.title}`}
          >
            <Download size={18} color='#2196F3' />
          </Pressable>
        </View>
      </View>
    </View>
  );
});

VisitCard.displayName = 'VisitCard';

// ─── RecordsScreen ───

export const RecordsScreen: React.FC = React.memo(() => {
  const handleViewDetails = useCallback((id: string) => {
    console.log('View details:', id);
  }, []);

  const handleDownload = useCallback((id: string) => {
    console.log('Download:', id);
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Title */}
        <Text style={styles.screenTitle}>Medical Records</Text>

        {/* Summary Cards */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.summaryRow}>
          {SUMMARIES.map((item) => (
            <SummaryCard key={item.id} item={item} />
          ))}
        </ScrollView>

        {/* Visit History */}
        <Text style={styles.sectionTitle}>Visit History</Text>

        {VISITS.map((visit) => (
          <VisitCard key={visit.id} visit={visit} onViewDetails={handleViewDetails} onDownload={handleDownload} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
});

RecordsScreen.displayName = 'RecordsScreen';

// ─── Styles ───

const SUMMARY_CARD_WIDTH = (SCREEN_WIDTH - 20 * 2 - 10 * 2) / 3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#212121',
    paddingHorizontal: 20,
    paddingTop: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
    paddingHorizontal: 20,
    marginBottom: 16,
  },

  // Summary Cards
  summaryRow: {
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 24,
  },
  summaryCard: {
    width: SUMMARY_CARD_WIDTH,
    borderRadius: 16,
    padding: 16,
    justifyContent: 'flex-end',
    minHeight: SUMMARY_CARD_WIDTH * 0.7,
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.85)',
  },

  // Timeline
  timelineRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  timelineIconCol: {
    alignItems: 'center',
    marginRight: 12,
    width: 32,
  },
  timelineIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: '#E0E0E0',
    marginVertical: 4,
  },

  // Visit Card
  visitCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  visitTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 6,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateText: {
    fontSize: 13,
    color: '#9E9E9E',
    marginLeft: 6,
  },

  // Doctor info
  doctorCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  doctorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 2,
  },
  doctorSpecialty: {
    fontSize: 12,
    color: '#9E9E9E',
  },

  // Prescription
  prescriptionCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  prescriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  prescriptionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2E7D32',
    marginLeft: 6,
  },
  prescriptionDetail: {
    fontSize: 12,
    color: '#616161',
    marginLeft: 20,
  },

  // Notes
  notesLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 13,
    color: '#757575',
    lineHeight: 19,
    marginBottom: 14,
  },

  // Actions
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  viewDetailsBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 6,
  },
  viewDetailsBtnPressed: {
    backgroundColor: '#1E87E0',
  },
  viewDetailsBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  downloadBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  downloadBtnPressed: {
    backgroundColor: '#F5F5F5',
  },
});
