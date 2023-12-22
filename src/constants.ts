export const DEBUG = false;
const TEST_SERVER = false;
const HTTPS = true;
const BASE_URL = TEST_SERVER ? "localhost:8000" : "telethu-backend-secoder-E8A.app.secoder.net";
export const BASE_API_URL = `http${HTTPS ? 's' : ''}://` + BASE_URL + '/';
export const BASE_WS_URL = `ws${HTTPS ? 's' : ''}://` + BASE_URL + "/";

export const LANGUAGE = "zh-cn";
export const AZURE_SPEECH_KEY = "c58688bdfbf54beab8079fda18950c81";
export const AZURE_REGION = "eastasia";
export const AZURE_TRANSLATE_KEY = "b00c29d290814b74b3c0f1499a680374";