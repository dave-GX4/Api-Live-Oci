import LeisureRecord from "./entitie/LeisureRecord"

export default interface LeisureRecordRepository{
    addCompleteActivity(leisureRecord: LeisureRecord): Promise<void>
    getAllByUser(id_user:string): Promise<LeisureRecord[]>
    getById(id: string): Promise<LeisureRecord | null>
    deleteActivityComplete(id: string): Promise<void>
}