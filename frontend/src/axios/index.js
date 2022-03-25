import axios from "axios"


const $api = axios.create({
    withCredentials: true,
    baseURL: "http://localhost:3000"
})

// $api.interceptors.response.use((config) => {
//     return config;
// }, async  (error) => {

//     console.log(error)

//     if (error.response.status === 500 && error.config) {
//         window.location.reload()
//     }
//     throw error;
// });


export default $api