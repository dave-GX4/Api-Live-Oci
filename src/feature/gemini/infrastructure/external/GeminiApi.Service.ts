import axios from "axios";
import GeminiResponseDto from "../../application/dtos/GeminiResponseDto";
import IGeminiService from "../../application/externalprovider/IGemini.Service";
import ExternalApiError from "../../../../core/errors/ExternalApiError";

export default class GeminiService implements IGeminiService {
    constructor(private readonly evn: string) {}

    async generateCustomActivity(promptData: any): Promise<GeminiResponseDto> {
        try {
            const response = await axios.post(`${this.evn}/activity/generate`, promptData);
            return response.data;
        } catch (error: any) {
            throw new ExternalApiError(
                "Gemini-Python-Service", 
                error.response?.data?.message || error.message
            );
        }
    }
}