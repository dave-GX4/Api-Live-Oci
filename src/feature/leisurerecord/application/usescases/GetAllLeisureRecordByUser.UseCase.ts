import UUID from "../../../../core/valueobjects/UUID";
import LeisureRecordRepository from "../../domain/LeisureRecord.Repository";
import GetLRDto from "../dto/GetLRDto";

export default class GetAllLeisureRecordByUserUseCase{
    constructor(
        private readonly repository : LeisureRecordRepository
    ){}

    async run(id_user: string): Promise<GetLRDto[]>{
        const idUser = UUID.validate(id_user);
        
        const results = await this.repository.getAllByUser(idUser.getValue());

        return results.map(result =>({
            id: result.id.getValue(),
            schedule_date: result.schedule_date!,
            start_time: result.start_time,
            end_time: result.end_time,
            duration_minutes: result.duration_minutes,
            saticfaction: result.saticfaction,
            status: result.status
        }));
    }
}