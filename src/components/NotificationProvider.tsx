import React, { createContext, useContext } from 'react';

import type { IUseNotificationsReturn } from '../hooks/useNotifications';
import { useNotifications } from '../hooks/useNotifications';

// ─── Context ────────────────────────────────────────────

const NotificationContext = createContext<IUseNotificationsReturn | null>(null);

// ─── Provider ───────────────────────────────────────────

interface INotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<INotificationProviderProps> = React.memo(({ children }) => {
  const notifications = useNotifications();

  return <NotificationContext.Provider value={notifications}>{children}</NotificationContext.Provider>;
});

NotificationProvider.displayName = 'NotificationProvider';

// ─── Consumer Hook ──────────────────────────────────────

/**
 * Access notification state anywhere in the app.
 * Must be used within <NotificationProvider>.
 */
export const useNotificationContext = (): IUseNotificationsReturn => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error('useNotificationContext must be used within <NotificationProvider>');
  }

  return context;
};
