import InvalidError from "../../../../core/errors/InvalidError";
import { NotFoundError } from "../../../../core/errors/NotFoundError";
import UUID from "../../../../core/valueobjects/UUID";
import ActivitiesRepository from "../../domain/Activities.Repository";
import ActivityResponseDto from "../dto/ActivityResponseDto";

export default class DeleteActivityUseCase{
    constructor(
        private readonly respository : ActivitiesRepository
    ){}

    async run(id: string): Promise<ActivityResponseDto>{
        const idValue = UUID.validate(id);

        const activity = await this.respository.getByIdActivity(idValue.getValue());

        if (!activity) {
            throw new NotFoundError("No existe la actividad");
        }

        if(id !== activity.id.getValue()){
            throw new InvalidError("Error en la actividad")
        }

        await this.respository.deleteActivity(idValue.getValue())

        return{
            message: "Se elimino la actividad correctamente",
            status: 200
        }
    }
}