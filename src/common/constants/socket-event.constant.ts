export const SOCKET_EVENTS = {
    USER: {
        ONLINE: 'user.online',
        OFFLINE: 'user.offline',
        STATUS_CHANGE: 'user.status.changed',
    },

    MESSAGE: {
        SEND: 'message.send',
        CREATED: 'message.created',
        RECEIVED: 'message.received',
        UPDATED: 'message.updated',
        DELETED: 'message.deleted',
        READ: 'message.read',
        TYPING: 'message.typing',
        STOP_TYPING: 'message.stop_typing',
        MESSAGE_READ_UPDATE: 'message.read.update',
        MESSAGE_IS_READ: 'message.is.read',
    },

    TASK: {
        CREATE: 'task.create',
        CREATED: 'task.created',
        UPDATE: 'task.update',
        UPDATED: 'task.updated',
        DELETE: 'task.delete',
        DELETED: 'task.deleted',
    },

    NOTIFICATION: {
        LIVE: 'notification.live',
    },
}