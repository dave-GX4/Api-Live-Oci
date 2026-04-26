import UUID from "../../../../core/valueobjects/UUID";
import { RequestStatus } from "./enums/Request.Status";

export default interface Friend {
  id: string
  requesterId: UUID;
  addresseeId: UUID;
  status: RequestStatus;
  createdAt?: Date;
  updatedAt?: Date;
}