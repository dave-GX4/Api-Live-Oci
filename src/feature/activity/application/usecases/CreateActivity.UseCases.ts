import InvalidError from "../../../../core/errors/InvalidError";
import UuidService from "../../../../core/services/interface/uuidService";
import UUID from "../../../../core/valueobjects/UUID";
import ActivitiesRepository from "../../domain/Activities.Repository";
import Activity from "../../domain/entitie/Activity";
import ActivityResponseDto from "../dto/ActivityResponseDto";

export default class CreateActivityUseCase{
    constructor(
        private readonly repository : ActivitiesRepository,
        private readonly serviceUuid: UuidService
    ){}

    async run(
        id_user: string, 
        name: string, 
        description: string, 
        type: string, 
        category: string, 
        duration_minutes: number, 
        social_type: string
    ): Promise<ActivityResponseDto>{
        const newId = await this.serviceUuid.generate();
        const newIdValue = UUID.validate(newId);
        const userId = UUID.validate(id_user);

        if(id_user == null || name == null 
            || description == null 
            || type == null || category == null 
            || duration_minutes == null 
            || social_type == null
        ){
            throw new InvalidError("Algun dato no esta completo o esta vacio")
        }

        const activity : Activity = {
            id: newIdValue,
            id_user: userId,
            name: name,
            description: description,
            type: type,
            category: category,
            duration_minutes: duration_minutes,
            social_type: social_type
        }
        
        await this.repository.createActivity(activity)

        return{
            data:{
                id: newIdValue.getValue(),
                id_user: userId.getValue()
            } ,
            message: "Se guardo la actividad correctamente",
            status: 200
        }
    }
} 