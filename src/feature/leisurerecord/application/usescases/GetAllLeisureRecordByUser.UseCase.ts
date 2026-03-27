import UUID from "../../../../core/valueobjects/UUID";
import LeisureRecordRepository from "../../domain/LeisureRecord.Repository";
import GetLRDto from "../dto/GetLRDto";

export default class GetAllLeisureRecordByUserUseCase{
    constructor(
        private readonly repository : LeisureRecordRepository
    ){}

    async run(id: string): Promise<GetLRDto[]>{
        const idUser = UUID.validate(id);
        
        const results = await this.repository.getAllByUser(idUser.getValue());

        return results.map(result =>({
            uuid: result.uuid.getValue(),
            scheduleDate: result.scheduleDate!,
            startTime: result.startTime,
            endTime: result.endTime,
            durationMinutes: result.durationMinutes,
            satisfaction: result.satisfaction,
            status: result.status
        }));
    }
}