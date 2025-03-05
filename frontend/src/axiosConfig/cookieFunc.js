import Cookies from "universal-cookie";

const cookies = new Cookies(null, { path: '/' });

export const setCookie = (key, value) => {
    cookies.set(key, value, { path: '/' });
}

export const getCookie = (key) => { 
    

    return cookies.get(key);
}

export const removeCookie = (key) => {
    cookies.remove(key, { path: '/' });
}