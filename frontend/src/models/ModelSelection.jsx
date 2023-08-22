import { Chip, MenuItem, Select } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
const ModelSelection = ({ modelNames, selectedModels, onModelSelect }) => {
    return (
        <Box sx={{ minWidth: 120 }} marginTop={3}>
            <Select
                sx={{ width: "400px" }}
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
        </Box>
    );
};

export default ModelSelection;
