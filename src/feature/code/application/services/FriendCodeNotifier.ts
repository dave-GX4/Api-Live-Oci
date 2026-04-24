import FriendCodeUpdateDTO from "../dtos/FriendCodeUpdateDTO";

export default interface FriendCodeNotifier {
    notifyCodeUpdated(userId: string, payload: FriendCodeUpdateDTO): void;
}