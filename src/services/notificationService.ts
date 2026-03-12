import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// ─── Types ──────────────────────────────────────────────

export interface IScheduleReminderParams {
  /** Unique identifier for deduplication */
  appointmentId: string;
  /** Doctor's name */
  doctorName: string;
  /** e.g. "Cardiology Consultation" */
  specialty: string;
  /** Trigger date/time */
  date: Date;
}

// ─── Foreground Handler ─────────────────────────────────
// Cấu hình cách thông báo hiển thị khi App đang mở (Foreground)

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// ─── Service ────────────────────────────────────────────

export const NotificationService = {
  /**
   * Đăng ký lấy Expo Push Token.
   * - Tạo Android notification channel (required SDK 26+)
   * - Request permission
   * - Return token string
   */
  registerForPushNotifications: async (): Promise<string | undefined> => {
    let token: string | undefined;

    // Android: phải tạo channel trước
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#2196F3',
      });

      // Channel cho appointment reminders
      await Notifications.setNotificationChannelAsync('appointments', {
        name: 'Appointment Reminders',
        description: 'Reminders for upcoming medical appointments',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#4CAF50',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('⚠️ Push notification permission not granted');
        return undefined;
      }

      const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;

      token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;

      if (__DEV__) {
        console.log('📱 Expo Push Token:', token);
      }
    } else {
      console.log('ℹ️ Push notifications require a physical device');
    }

    return token;
  },

  /**
   * Schedule a local notification as an appointment reminder.
   * Triggers at (appointment time - 30 minutes).
   */
  scheduleAppointmentReminder: async (params: IScheduleReminderParams): Promise<string> => {
    const { appointmentId, doctorName, specialty, date } = params;

    // Cancel existing reminder for this appointment (dedup)
    await NotificationService.cancelReminder(appointmentId);

    // Schedule 30 minutes before appointment
    const triggerDate = new Date(date.getTime() - 30 * 60 * 1000);
    const now = new Date();

    // If trigger time already passed, schedule 5 seconds from now (for demo)
    const secondsUntilTrigger = Math.max(Math.floor((triggerDate.getTime() - now.getTime()) / 1000), 5);

    const notificationId = await Notifications.scheduleNotificationAsync({
      identifier: `appointment-${appointmentId}`,
      content: {
        title: '🏥 Upcoming Appointment',
        body: `You have an appointment with ${doctorName} (${specialty}) in 30 minutes`,
        data: {
          type: 'appointment_reminder',
          appointmentId,
          screen: '/doctors',
        },
        ...(Platform.OS === 'android' && { channelId: 'appointments' }),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: secondsUntilTrigger,
      },
    });

    if (__DEV__) {
      console.log(`⏰ Reminder scheduled: "${doctorName}" in ${secondsUntilTrigger}s (id: ${notificationId})`);
    }

    return notificationId;
  },

  /**
   * Cancel a previously scheduled reminder by appointmentId.
   */
  cancelReminder: async (appointmentId: string): Promise<void> => {
    await Notifications.cancelScheduledNotificationAsync(`appointment-${appointmentId}`);
  },

  /**
   * Cancel ALL scheduled notifications.
   */
  cancelAllReminders: async (): Promise<void> => {
    await Notifications.cancelAllScheduledNotificationsAsync();
  },

  /**
   * Get the current badge count.
   */
  getBadgeCount: async (): Promise<number> => {
    return Notifications.getBadgeCountAsync();
  },

  /**
   * Reset badge count to 0.
   */
  clearBadge: async (): Promise<void> => {
    await Notifications.setBadgeCountAsync(0);
  },

  /**
   * Send a test local notification (development only).
   */
  sendTestNotification: async (): Promise<void> => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🔔 Test Notification',
        body: 'Healthcare App notifications are working!',
        data: { type: 'test', screen: '/' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 2,
      },
    });
  },
};
