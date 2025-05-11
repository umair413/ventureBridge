import { io } from "socket.io-client";

const BASE_URL = 'https://venturebridge-backend-production.up.railway.app';
// const BASE_URL = 'http://localhost:5000';

const socket = io(BASE_URL);

export default socket