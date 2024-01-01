import { createTheme } from "@mui/material";

const getCommonThemeConfig = () => ({
    components: {
        MuiSelect: {
            defaultProps: {
                inputProps: {
                    MenuProps: { disableScrollLock: true },
                },
            },
        },
    },
});

const commonThemeConfig = getCommonThemeConfig();

export const darkTheme = createTheme({
    palette: {
        mode: "dark",
        background: {
            default: "#242424",
            paper: "#1E1E1E",
        },
        primary: {
            main: "#90caf9", // Light blue for primary elements in dark theme
        },
    },
    typography: {
        h4: {
            fontSize: "2.5rem",
            fontWeight: 500,
            color: "#FAFAFA",
        },
        span: {
            color: "#FAFAFA",
        },
    },
    components: {
        MuiTabs: {
            styleOverrides: {
                root: {
                    backgroundColor: "#1E1E1E",
                    color: "#FAFAFA",
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    "&.Mui-selected": {
                        color: "#90caf9", // Light blue for selected tabs in dark theme
                    },
                },
            },
        },
    },
    ...commonThemeConfig,
});

export const lightTheme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#1976d2", // Deep blue for primary elements in light theme
        },
    },
    typography: {
        h4: {
            fontSize: "2.5rem",
            fontWeight: 500,
            color: "#363537",
        },
        span: {
            color: "#363537",
        },
    },
    components: {
        MuiTabs: {
            styleOverrides: {
                root: {
                    backgroundColor: "#fff", // White background for tabs in light theme
                    color: "#000", // Black text color for tabs in light theme
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    "&.Mui-selected": {
                        color: "#1976d2", // Deep blue for selected tabs in light theme
                    },
                },
            },
        },
    },
    ...commonThemeConfig,
});

export const PRIMARY_COLOR = "#3164b5c8";
export const SECONDARY_COLOR = "#6e4923cf";
export const TRIETARY_COLOR = "#8884d8";

export const NICE_COLORS = [
    "#ff9896",
    "#f7b6d2",
    "#9467bd",
    "#1f77b4",
    "#e377c2",
    "#ff7f0e",
    "#2ca02c",
    "#d62728",
    "#8c564b",
    "#7f7f7f",
    "#bcbd22",
    "#17becf",
    "#aec7e8",
    "#ffbb78",
    "#98df8a",
    "#c5b0d5",
    "#c49c94",
    "#c7c7c7",
    "#dbdb8d",
    "#9edae5",
];
