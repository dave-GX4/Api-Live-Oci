import InvalidError from "../../../../core/errors/InvalidError";
import UUID from "../../../../core/valueobjects/UUID";
import LeisureRecordRepository from "../../domain/LeisureRecord.Repository";
import LeisureRecordResponseDto from "../dto/LeisureRecordResponseDto";

export default class DeleteLeisureRecordUseCase{
    constructor(
        private readonly repositroy : LeisureRecordRepository
    ){}

    async run(id: string): Promise<LeisureRecordResponseDto>{
        const idValue = UUID.validate(id);

        const result = await this.repositroy.getById(idValue.getValue());
        if(!result){
            throw new InvalidError("No se encontro ninguna actividad terminada")
        }
        if(idValue.getValue() !== result.id.getValue()){
            throw new InvalidError("No se podra eliminar esta actividad")
        }

        await this.repositroy.deleteActivityComplete(result.id.getValue());

        return{
            message: "Se a modificado el estado, puedes volver a realizar la actividad",
            status: 200
        }
    }
}