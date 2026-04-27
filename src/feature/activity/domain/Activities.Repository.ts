import Activity from "./entity/Activity";

export default interface ActivitiesRepository{
    createActivity(activity: Activity): Promise<void>
    getByIdActivity(id: string): Promise<Activity | null>
    deleteActivity(id: string): Promise<void>
}