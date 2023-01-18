import { HttpClient, HttpResponse } from "./http";

export class RestService {

    http: HttpClient;
    baseURL: string;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
        this.http =  new HttpClient({ baseURL: this.baseURL });
    }

    public async getShifts() {
       const shifts = await this.http.get<HttpResponse<Response[]>>('/shifts') as unknown as Record<string, any>[];

       return shifts?.map(shift => ({
        ...shift,
        shift_date: new Date(shift.shift_date),
       }));
    }

    public async getShiftsOverlap(shifts: string[]) {
        const qs = { shift1: shifts[0], shift2: shifts[1] };
        return this.http.get<HttpResponse<Response[]>>('/shifts-overlap', qs);
    }

    public async getRemainingSpots() {
        return this.http.get<HttpResponse<Response[]>>('/remaining-spots');
    }

    public async getMatchingJobs() {
        return this.http.get<HttpResponse<Response[]>>('/matching-jobs');
    }

    public async getCoWorkers(nurseId: number) {
        return this.http.get<HttpResponse<Response[]>>('/coworkers', { nurse_id: nurseId });
    }

    public async getNurses() {
        return this.http.get<HttpResponse<Response[]>>('/nurses');
    }
}

const service = new RestService(process.env.REACT_APP_API || 'http://localhost:4000');

export default service;