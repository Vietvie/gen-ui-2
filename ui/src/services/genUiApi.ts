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
    deleteLayout(data: { page: string }) {
        const baseURL = '/delete';
        return genUiAxiosClient.post<{ status: string }>(baseURL, data);
    },
    readLayout(data: { page: string; section: string }) {
        const baseURL = '/readlayout';
        return genUiAxiosClient.post<any>(baseURL, data);
    },
};

export default genUiApi;
