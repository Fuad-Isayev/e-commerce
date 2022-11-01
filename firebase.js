import axios from 'axios';

export default axios.create({
    baseURL: "https://e-commerce-b33a7-default-rtdb.firebaseio.com",
    headers: {
        "Content-type": "application/json"
    }
})