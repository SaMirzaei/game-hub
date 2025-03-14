import axios from "axios"

export default axios.create({
    baseURL: 'https://api.rawg.io/api',
    params: {
        key: '609c406a992648298d5447723ca633bf'
    }
});