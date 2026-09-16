import axiosClient from "./axiosClient";

const scanApi = {
    createScan:(data) => axiosClient.post('/scan/create',data),
    scanFilePdf:(formData) => axiosClient.post('/scan/scan-pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getScans:() => axiosClient.get('/scan/history')
}

export default scanApi;