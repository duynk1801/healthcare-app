import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { IScheduleReminderParams } from '../services/notificationService';
import { NotificationService } from '../services/notificationService';

// ─── Types ──────────────────────────────────────────────

interface INotificationData {
  type?: string;
  screen?: string;
  appointmentId?: string;
  [key: string]: unknown;
}

export interface IUseNotificationsReturn {
  /** Expo push token for this device */
  expoPushToken: string | undefined;
  /** Latest received notification */
  notification: Notifications.Notification | undefined;
  /** Unread badge count */
  badgeCount: number;
  /** Schedule an appointment reminder */
  scheduleReminder: (params: IScheduleReminderParams) => Promise<string>;
  /** Clear badge and mark all as read */
  clearBadge: () => Promise<void>;
  /** Send a test notification (dev only) */
  sendTest: () => Promise<void>;
}

// ─── Hook ───────────────────────────────────────────────

export const useNotifications = (): IUseNotificationsReturn => {
  const router = useRouter();

  const [expoPushToken, setExpoPushToken] = useState<string | undefined>(undefined);
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);
  const [badgeCount, setBadgeCount] = useState(0);

  const notificationListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  // ── Register push token ──
  const registerToken = useCallback(async () => {
    const token = await NotificationService.registerForPushNotifications();
    setExpoPushToken(token);
  }, []);

  // ── Handle notification tap → deep link ──
  const handleNotificationResponse = useCallback(
    (response: Notifications.NotificationResponse) => {
      const data = response.notification.request.content.data as INotificationData;

      if (__DEV__) {
        console.log('👆 Notification tapped:', data);
      }

      // Navigate to the screen specified in notification data
      if (data?.screen) {
        setTimeout(() => {
          router.push(data.screen as never);
        }, 30);
      }
    },
    [router],
  );

  // ── Setup listeners ──
  useEffect(() => {
    registerToken();

    // Load initial badge count
    NotificationService.getBadgeCount().then(setBadgeCount);

    // Foreground: khi nhận notification trong app
    notificationListener.current = Notifications.addNotificationReceivedListener((notif) => {
      setNotification(notif);
      setBadgeCount((prev) => prev + 1);
    });

    // User tap notification → navigate
    responseListener.current = Notifications.addNotificationResponseReceivedListener(handleNotificationResponse);

    // Check if app was opened from a notification (cold start)
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) {
        handleNotificationResponse(response);
      }
    });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, [registerToken, handleNotificationResponse]);

  // ── Exposed callbacks ──
  const scheduleReminder = useCallback(async (params: IScheduleReminderParams) => {
    return NotificationService.scheduleAppointmentReminder(params);
  }, []);

  const clearBadge = useCallback(async () => {
    await NotificationService.clearBadge();
    setBadgeCount(0);
  }, []);

  const sendTest = useCallback(async () => {
    await NotificationService.sendTestNotification();
  }, []);

  return {
    expoPushToken,
    notification,
    badgeCount,
    scheduleReminder,
    clearBadge,
    sendTest,
  };
};
