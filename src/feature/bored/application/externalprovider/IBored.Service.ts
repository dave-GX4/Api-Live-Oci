import Bored from "../../domain/entity/Bored";

export interface IBoredService {
    getRandomActivity(): Promise<Bored>;
    getFilterActivities(type: string, participants: number): Promise<Bored[]>
    getActivityByKey(key:number): Promise<Bored>
}