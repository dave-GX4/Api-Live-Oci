export default interface ActivityResponseDto{
    data?: {
        id: string,
        idActivity: string,
        idLR: string
    }
    message: string,
    status: number
}