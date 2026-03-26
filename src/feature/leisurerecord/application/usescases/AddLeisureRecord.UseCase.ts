import InvalidError from "../../../../core/errors/InvalidError";
import UuidService from "../../../../core/services/interface/uuidService";
import UUID from "../../../../core/valueobjects/UUID";
import LeisureRecord from "../../domain/entitie/LeisureRecord";
import LeisureRecordRepository from "../../domain/LeisureRecord.Repository";
import LeisureRecordResponseDto from "../dto/LeisureRecordResponseDto";

export default class AddLeisureRecordUseCase{
    constructor(
        private readonly repository : LeisureRecordRepository,
        private readonly serviceUuid : UuidService
    ){}

    async run(
        id_user: string, 
        id_activitie: string, 
        start_time: string, 
        end_time: string, 
        duration_minutes: number, 
        saticfaction: number,
        status: string
    ): Promise<LeisureRecordResponseDto>{
        const idUser = UUID.validate(id_user);
        const idActivity = UUID.validate(id_activitie);

        const newId = await this.serviceUuid.generate();
        const newIdLR = UUID.validate(newId);

        if( idUser == null || idActivity == null
            || start_time == null || end_time == null
            || duration_minutes == null || saticfaction == null
            || status == null
        ){
            throw new InvalidError("Falta de datos para poder hacer el cambio de estado de la actividad")
        }

        const leisureRecord : LeisureRecord = {
            id: newIdLR, 
            id_user: idUser, 
            id_activitie: idActivity, 
            start_time: start_time, 
            end_time: end_time, 
            duration_minutes: duration_minutes, 
            saticfaction: saticfaction, 
            status: status
        }

        await this.repository.addCompleteActivity(leisureRecord);
            
        return{
            message: "Sea completado y movido con exito",
            status: 200
        }
    }
}