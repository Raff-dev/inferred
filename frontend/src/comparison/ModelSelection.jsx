import { Chip, MenuItem, Select } from "@mui/material";
import FormControl from "@mui/material/FormControl";
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
        <FormControl sx={{ minWidth: 400 }}>
            <Select
                multiple
                value={selectedModels}
                onChange={handleModelChange}
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
        </FormControl>
    );
};

export default ModelSelection;
