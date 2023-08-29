import {
    Button,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
} from "@mui/material";
import Box from "@mui/material/Box";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import React, { useState } from "react";

const DurationPicker = ({ onConfirm }) => {
    const values = Object.keys(VALUES);
    const defaultDuration = values[values.length - 1];
    const currentDate = dayjs(Date.now() - defaultDuration * 1000);

    const [selectedDate, setSelectedDate] = useState(currentDate);
    const [selectedDuration, setSelectedDuration] = useState(defaultDuration);

    const handleDurationChange = (event) => {
        setSelectedDuration(event.target.value);
    };

    const handleConfirm = () => {
        const isoDate = selectedDate.toISOString();
        onConfirm(isoDate, selectedDuration);
    };

    return (
        <Box sx={{ minWidth: 120 }} marginTop={3}>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={6}>
                    <DateTimePicker
                        label="Pick a Date & Time"
                        value={selectedDate}
                        onChange={(newValue) => setSelectedDate(newValue)}
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <FormControl fullWidth>
                        <InputLabel>Duration</InputLabel>
                        <Select
                            value={selectedDuration}
                            onChange={handleDurationChange}
                        >
                            {Object.entries(VALUES).map(([value, label]) => (
                                <MenuItem key={value} value={value}>
                                    {label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Button
                        variant="contained"
                        onClick={handleConfirm}
                        fullWidth
                    >
                        Confirm
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DurationPicker;
