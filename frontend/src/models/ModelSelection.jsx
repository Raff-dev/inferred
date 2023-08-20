import { Chip, MenuItem, Select, ThemeProvider, createTheme } from "@mui/material";
import React from "react";

const darkTheme = createTheme({
    palette: {
        mode: "dark", // Set the theme mode to dark
    },
});

const ModelSelection = ({ modelNames, selectedModels, onModelSelect }) => {
    return (
        <ThemeProvider theme={darkTheme}>
            <Select
                multiple
                value={selectedModels}
                onChange={onModelSelect}
                renderValue={(selected) => (
                    <div>
                        {selected.map((model) => (
                            <Chip key={model} label={model} />
                        ))}
                    </div>
                )}
            >
                {modelNames.map((model) => (
                    <MenuItem key={model} value={model}>
                        {model}
                    </MenuItem>
                ))}
            </Select>
        </ThemeProvider>
    );
};

export default ModelSelection;
