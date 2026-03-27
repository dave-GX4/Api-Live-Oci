import { NotFoundError } from "../../../../core/errors/NotFoundError";
import UUID from "../../../../core/valueobjects/UUID";
import ActivitiesRepository from "../../../activity/domain/Activities.Repository";
import LeisureRecordRepository from "../../domain/LeisureRecord.Repository";
import LeisureRecordResponseDto from "../dto/LeisureRecordResponseDto";

export default class DeleteLeisureRecordUseCase{
    constructor(
        private readonly leisureRepository: LeisureRecordRepository,
        private readonly activityRepository: ActivitiesRepository
    ){}

    async run(uuidLeisureRecord: string): Promise<LeisureRecordResponseDto>{
        const leisureId = UUID.validate(uuidLeisureRecord);

        const leisureRecord = await this.leisureRepository.getById(leisureId.getValue());
        if (!leisureRecord) {
            throw new NotFoundError("Registro de ocio", uuidLeisureRecord, "UUID");
        }

        const activity = await this.activityRepository.getByIdActivity(
            leisureRecord.uuidActivity.getValue()
        );

        if (!activity) {
            throw new NotFoundError("Actividad", leisureRecord.uuidActivity.getValue(), "UUID");
        }

        await this.leisureRepository.deleteActivityComplete(leisureId.getValue());

        await this.activityRepository.deleteActivity(activity.uuid.getValue());

        return {
            message: "Actividad y registro de ocio eliminados correctamente",
            status: 200
        };
    }
}