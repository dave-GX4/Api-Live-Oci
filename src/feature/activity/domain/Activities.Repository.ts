import Activity from "./entity/Activity";

export default interface ActivitiesRepository{
    createActivity(activity: Activity): Promise<void>
    getAllActivitiesByUser(id_user: string): Promise<Activity[]>
    getByIdActivity(id: string): Promise<Activity | null>
    deleteActivity(id: string): Promise<void>
}