import axios from 'axios';

const baseURL = 'http://localhost:3232';
const genUiAxiosClient = axios.create({
    baseURL,
});

const genUiApi = {
    generateUi(data: { layouts: string[]; page: string }) {
        const baseURL = '/generate';
        return genUiAxiosClient.post<{
            status: number;
        }>(baseURL, data);
    },
    getLayouts() {
        const baseURL = '/layouts';
        return genUiAxiosClient.get<{
            tailwindLayouts: string[];
        }>(baseURL);
    },
};

export default genUiApi;
