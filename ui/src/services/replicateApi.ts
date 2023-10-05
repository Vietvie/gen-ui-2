import axios from 'axios';

const baseURL = 'http://localhost:3232/replicate';
const replicateAxios = axios.create({
    baseURL,
});

const replicateApi = {
    createPrompt(data: { prompt: string; system_prompt: string }) {
        const baseURL = '/create';
        return replicateAxios.post(baseURL, data);
    },
};

export default replicateApi;
