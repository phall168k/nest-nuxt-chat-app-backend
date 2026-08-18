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
    }
}