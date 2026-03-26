export default interface GetScheduleResponseDto{
    uuid: string,
    title: string
    days: number[],
    startTime: string
    endTime: string
    active: boolean
    type: string
}