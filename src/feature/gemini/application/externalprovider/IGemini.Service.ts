import GeminiResponseDto from "../../../gemini/application/dtos/GeminiResponseDto";

export default interface IGeminiService {
    generateCustomActivity(promptData: any): Promise<GeminiResponseDto>;
}