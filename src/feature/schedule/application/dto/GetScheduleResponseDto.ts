export default interface GetScheduleResponseDto{
    id: string,
    title: string
    days: number[],
    start_time: string
    end_time: string
    active: boolean
    type: string
}