import axios from "axios";
import ExternalApiError from "../../../../core/errors/ExternalApiError";
import { IBoredService } from "../../application/externalprovider/IBored.Service";
import Bored from "../../domain/entity/Bored";

export default class BoredService implements IBoredService{
    constructor(
        private readonly env: string
    ){}
    
    async getRandomActivity(): Promise<Bored> {
        try {
            const response = await axios.get(`${this.env}/random`);
            return response.data;
        } catch (error: any) {
            throw new ExternalApiError("Bored-API", error.message);
        }
    }
    
    async getFilterActivities(type?: string, participants?: number): Promise<Bored[]> {
        try {
            const params = new URLSearchParams();
            if (type) params.append('type', type);
            if (participants) params.append('participants', participants.toString());

            const response = await axios.get(`${this.env}/filter?${params.toString()}`);
            
            return Array.isArray(response.data) ? response.data : [response.data];
        } catch (error: any) {
            throw new ExternalApiError("Bored-API", error.message);
        }
    }

    async getActivityByKey(key: number): Promise<Bored> {
        try {
            const response = await axios.get(`${this.env}/activity/${key}`);
            return response.data;
        } catch (error: any) {
            throw new ExternalApiError("Bored-API", error.message);
        }
    }
}