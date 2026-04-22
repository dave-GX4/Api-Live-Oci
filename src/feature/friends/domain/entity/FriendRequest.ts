import UUID from "../../../../core/valueobjects/UUID";
import { RequestStatus } from "./enums/Request.Status";

interface FriendRequest {
  id: UUID
  requester_id: UUID;
  addressee_id: UUID;
  status: RequestStatus;
  created_at: Date;
  updated_at: Date;
}