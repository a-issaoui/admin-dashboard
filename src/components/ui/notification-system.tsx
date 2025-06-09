import { X, CheckCircle, AlertCircle, Info, AlertTriangle as Warning } from 'lucide-react'
import { toast } from 'sonner'

export interface NotificationOptions {
    title?: string
    description?: string
    action?: {
        label: string
        onClick: () => void
    }
    duration?: number
    persistent?: boolean
}

class NotificationSystem {
    private notifications: Map<string, any> = new Map()

    success(message: string, options?: NotificationOptions) {
        const id = toast.success(message, {
            description: options?.description,
            duration: options?.duration || 4000,
            action: options?.action ? {
                label: options.action.label,
                onClick: options.action.onClick
            } : undefined,
            icon: <CheckCircle className="h-4 w-4" />,
            className: 'notification-success'
        })

        if (options?.persistent) {
            this.notifications.set(String(id), { type: 'success', message, options })
        }

        return id
    }

    error(message: string, options?: NotificationOptions) {
        const id = toast.error(message, {
            description: options?.description,
            duration: options?.duration || 6000,
            action: options?.action ? {
                label: options.action.label,
                onClick: options.action.onClick
            } : undefined,
            icon: <AlertCircle className="h-4 w-4" />,
            className: 'notification-error'
        })

        if (options?.persistent) {
            this.notifications.set(String(id), { type: 'error', message, options })
        }

        return id
    }

    warning(message: string, options?: NotificationOptions) {
        const id = toast.warning(message, {
            description: options?.description,
            duration: options?.duration || 5000,
            action: options?.action ? {
                label: options.action.label,
                onClick: options.action.onClick
            } : undefined,
            icon: <Warning className="h-4 w-4" />,
            className: 'notification-warning'
        })

        if (options?.persistent) {
            this.notifications.set(String(id), { type: 'warning', message, options })
        }

        return id
    }

    info(message: string, options?: NotificationOptions) {
        const id = toast.info(message, {
            description: options?.description,
            duration: options?.duration || 4000,
            action: options?.action ? {
                label: options.action.label,
                onClick: options.action.onClick
            } : undefined,
            icon: <Info className="h-4 w-4" />,
            className: 'notification-info'
        })

        if (options?.persistent) {
            this.notifications.set(String(id), { type: 'info', message, options })
        }

        return id
    }

    dismiss(id: string | number) {
        toast.dismiss(id)
        this.notifications.delete(String(id))
    }

    dismissAll() {
        toast.dismiss()
        this.notifications.clear()
    }
}

export const notifications = new NotificationSystem()