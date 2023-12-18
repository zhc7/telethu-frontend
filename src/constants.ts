export const DEBUG = true;
const TEST_SERVER = true;
const HTTPS = false;
const BASE_URL = TEST_SERVER ? "localhost:8000" : "telethu-backend-secoder-E8A.app.secoder.net";
export const BASE_API_URL = `http${HTTPS ? 's' : ''}://` + BASE_URL + '/';
export const BASE_WS_URL = `ws${HTTPS ? 's' : ''}://` + BASE_URL + "/";

export const LANGUAGE = "zh-cn";