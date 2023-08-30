export const DAY = 24 * 60 * 60;
export const HOUR = 60 * 60;
export const MINUTE = 60;

export const DATA_WINDOW_SIZE_DEFAULT = MINUTE;
export const DATA_WINDOW_SIZE_MIN = MINUTE;
export const DATA_WINDOW_SIZE_MAX = 120 * MINUTE;
export const DATA_WINDOW_STEP = MINUTE;
export const LOOKAHEAD = 100;
export const PREDICTION_INTERVAL = 1000;

export const WEB_SOCKET_URL = "ws://localhost:8000/ws/sensors/";
export const API_LOGIN_URL = "http://localhost:8000/api-token-auth/";

export const DURATION_VALUES = {
    60: "1 min",
    300: "5 min",
    600: "10 min",
    900: "15 min",
    1800: "30 min",
    3600: "1 hour",
    7200: "2 hours",
};
