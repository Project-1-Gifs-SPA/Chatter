import { GIPHY_API_KEY, GIPHY_BASE_URL } from "../common/constants";

export const getSearchGifs = (searchTerm = '') =>
    fetch(generateFetchLink('search', { 'q': `${searchTerm}`, 'limit': 16, 'rating': 'g' }))
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return response.json();
        })
        .then(data => data.data)
        .catch(e => console.error(e.message));

export const getTrendingGifs = () =>
    fetch(generateFetchLink('trending', { limit: 16, rating: 'g' }))
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return response.json();
        })
        .then((data) => data.data)
        .catch(e => console.error(e.message));

export const generateFetchLink = (endpoint, fetchDataToRequest) => {
    let link = `${GIPHY_BASE_URL}${endpoint}?api_key=${GIPHY_API_KEY}`;

    Object.keys(fetchDataToRequest).map(key => {
        if (fetchDataToRequest[key]) {
            link += `&${key}=${fetchDataToRequest[key]}`;
        }
    });

    return link;
}
