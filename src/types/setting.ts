export type PushDataArray = {
    status: PushDataStatus;
    devices: string[];
    message: string,
    time: string,
}[];

export enum PushDataStatus {
    SENDED = 'SENDED',
    SCHEDULE = 'SCHEDULE'
}