// utils/jwtUtils.js
export function decodeJWT(token) {
    try {
        // JWT có cấu trúc: header.payload.signature
        const base64Url = token.split('.')[1]; // Lấy phần payload
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Chuyển base64Url sang base64 chuẩn
        
        // Giải mã base64 và parse thành object JSON
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Invalid token', error);
        return null;
    }
}