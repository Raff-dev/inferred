import { Chip, MenuItem, Select } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";

const ModelSelection = ({ modelNames, selectedModels, onModelSelect }) => {
    const handleModelChange = (event) => {
        const newSelectedModels = event.target.value;

        // Check if unselecting would result in no models selected
        if (selectedModels.length > 1 || newSelectedModels.length > 0) {
            onModelSelect(event);
        }
    };

    return (
        <Box sx={{ minWidth: 120 }} marginTop={3}>
            <Select
                sx={{ width: "400px" }}
                multiple
                value={selectedModels}
                onChange={handleModelChange} // Use the custom handler
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
        </Box>
    );
};

export default ModelSelection;
