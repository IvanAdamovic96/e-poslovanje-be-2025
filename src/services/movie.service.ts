import axios from "axios";

const client = axios.create({
    baseURL: 'https://movie.pequla.com/api',
    headers: {
        'Accept': 'application/json',
        'X-name': 'PSEP_2025'
    },
    validateStatus: (status: number) => {
        return status === 200
    }
})


export class MovieService{

    static async getMovieById(id: number){
        return await client.get(`/movie/${id}`);
    }
    




}








