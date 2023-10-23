export const DEBUG = true;
export const TEST_SERVER = false;
const BASE_URL = TEST_SERVER ? "localhost:8000" : "telethu-backend-secoder-E8A.app.secoder.net";
export const BASE_API_URL = 'http://' + BASE_URL + '/';
export const BASE_WS_URL = "ws://" + BASE_URL + "/";

export const LANGUAGE = "zh-cn";