export type NotificationArray = {
    type: NotificationType;
    title: string,
    content: string,
    datetime: Date,
    read: boolean,
}[];

export enum NotificationType {
    ERROR = 'ERROR',
    INFO = 'INFO'
}