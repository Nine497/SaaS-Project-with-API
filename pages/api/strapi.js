import Strapi from 'strapi-sdk-javascript/build/main';

const apiUrl = process.env.API_URL || 'http://localhost:1337/api/';
const strapi = new Strapi(apiUrl);

export default strapi;

export const login = (username, password) => {
    return strapi.login(username, password);
};

export const getCurrentUser = (token) => {
    return strapi.getEntry('users', 'me', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
