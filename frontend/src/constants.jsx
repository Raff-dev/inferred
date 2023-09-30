export const DAY = 24 * 60 * 60;
export const HOUR = 60 * 60;
export const MINUTE = 60;

export const DATA_WINDOW_SIZE_DEFAULT = MINUTE;
export const DATA_WINDOW_SIZE_MIN = MINUTE;
export const DATA_WINDOW_SIZE_MAX = 120 * MINUTE;
export const DATA_WINDOW_STEP = MINUTE;
export const LOOKAHEAD = 100;
export const PREDICTION_INTERVAL = 1000;

export const DOMAIN_RANGE_EXTEND = 0.3;

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

const API_BASE = "http://localhost:8000/api/";

export const API = {
    dimensions: API_BASE + "dimensions/",
    granulation_methods: API_BASE + "sensor_reads/granulation_methods/",
    simulation_models: API_BASE + "simulation_models/",
    sensor_reads: API_BASE + "sensor_reads/",
    prediction_timeline: API_BASE + "prediction_timeline/",
    model_predictions_comparison: API_BASE + "model_predictions_comparison/",
};
