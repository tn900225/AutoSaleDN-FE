export const getApiBaseUrl = () => {
    if (import.meta.env.DEV) {
        console.log("dev ne");
        return "/api";
    }
    console.log("prod ne");
    return import.meta.env.VITE_API_URL;
};