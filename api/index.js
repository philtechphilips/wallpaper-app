import axios from "axios";

const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/?key=${process.env.EXPO_PUBLIC_API_KEY}`

const formatUrl = (params) => {
    let url = API_URL + "&per_page=25&safesearch=true&editors_choice=true"

    if(!params) return url;

    let paramsKey = Object.keys(params);
    paramsKey.map(key => {
        let value = key == 'q' ? encodeURIComponent(params[key]) : params[key];
        url += `&${key}=${value}`;
    });

    console.log(url)
    return url;
}

export const apiCall = async (params) => {
    try {
        const response = await axios.get(formatUrl(params));
        const { data } = response;
        return { success: true, data }
    } catch (error) {
        return { success: false, msg: error.message }
    }
}