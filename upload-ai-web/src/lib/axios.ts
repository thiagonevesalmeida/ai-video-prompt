import axios from "axios";

export const api = axios.create({
	baseURL: 'http://localhst:3333', //backend server adress

})