import type { NotificationMessage } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale'; // For Indonesian locale

interface NotificationItemProps {
  notification: NotificationMessage;
  onMarkAsRead?: (id: string) => void;
}

const notificationTypeStyles = {
  info: {
    iconColor: "text-sky-500",
    bgColor: "bg-sky-500/10",
    borderColor: "border-sky-500/50",
  },
  warning: {
    iconColor: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/50",
  },
  critical: {
    iconColor: "text-red-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/50",
  },
};

export default function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
  const Icon = notification.icon;
  const styles = notificationTypeStyles[notification.type];
  const timeAgo = formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true, locale: id });

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all hover:shadow-md rounded-lg mb-3",
        styles.bgColor,
        styles.borderColor,
        !notification.read && "border-l-4",
        !notification.read ? styles.borderColor : "border-border"
      )}
      onClick={onMarkAsRead ? () => onMarkAsRead(notification.id) : undefined}
      role={onMarkAsRead ? "button" : undefined}
      tabIndex={onMarkAsRead ? 0 : undefined}
    >
      <CardContent className="p-4 flex items-start space-x-3">
        <Icon className={cn("h-6 w-6 shrink-0 mt-0.5", styles.iconColor)} />
        <div className="flex-grow">
          <p className={cn("text-sm font-medium", styles.iconColor.replace('text-', 'text-'))}>
            {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
          </p>
          <p className="text-sm text-foreground/90">{notification.message}</p>
          <p className="text-xs text-muted-foreground mt-1">{timeAgo}</p>
        </div>
        {!notification.read && (
          <span className={cn("h-2.5 w-2.5 rounded-full shrink-0 mt-1", styles.iconColor.replace('text-', 'bg-'))} aria-label="Unread"></span>
        )}
      </CardContent>
    </Card>
  );
}
