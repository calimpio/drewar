import { IDisciplineDTO } from "../../src/dto/disciplineDTO";
import ErrorMessageDTO from "../../src/dto/errorMessageDTO";
import IPage from "../model/page";
import { AuthService } from "./authService";

export namespace DisciplineService {
    export async function create(discipline: IDisciplineDTO) {       
        try {
            const response = await AuthService.post<IDisciplineDTO>("/disciplines", discipline);
            return response.data;
        } catch (err) {
            const response = err.response;
            if (response) {
                throw new ErrorMessageDTO(response.data);
            }
        }
    }

    export async function getAll(filter: string, limit: number) {
       
        try {
            const response = await AuthService.get<IPage<IDisciplineDTO>>(`/disciplines?filter=${encodeURIComponent(filter)}&limit=${limit}`);
            return response.data;
        } catch (err) {
            const response = err.response;
            if (response) {
                throw new ErrorMessageDTO(response.data);
            }
        }
    }

    export async function update(discipline: IDisciplineDTO) {        
        try {
            const response = await AuthService.put<IDisciplineDTO>("/disciplines/"+discipline.id, discipline);
            return response.data;
        } catch (err) {
            const response = err.response;
            if (response) {
                throw new ErrorMessageDTO(response.data);
            }
        }
    }
}