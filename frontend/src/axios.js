import axios from 'axios';
import Cookies from 'js-cookie';

axios.defaults.baseURL = "http://localhost:3000/"

export default axios
export const withAccessToken = axios.create({
    baseUrl: "http://localhost:3000/",
});

export const setAccessTokenToAxios = () => {
    withAccessToken.interceptors.request.use((config) => {
        const token = Cookies.get("jwt-access-token");
        console.log("setting new access token in config", token ? token : "")
        config.headers.Authorization = token ? "Bearer " + token : "";
        return config;
    });
    console.log("in set Access token function")
}
setAccessTokenToAxios()

export const withRefreshToken = axios.create({
    baseURL: "http://localhost:3000/",
});

