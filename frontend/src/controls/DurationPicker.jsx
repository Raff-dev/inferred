import {
    Button,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";

const DurationPicker = ({ onConfirm }) => {
    const [selectedDate, setSelectedDate] = React.useState(new Date());
    const [selectedDuration, setSelectedDuration] = React.useState(5);

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    const handleDurationChange = (event) => {
        setSelectedDuration(event.target.value);
    };

    const handleConfirm = () => {
        onConfirm(selectedDate, selectedDuration);
    };

    return (
        <Box sx={{ minWidth: 120 }} marginTop={3}>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Pick a Date & Time"
                        type="datetime-local"
                        value={selectedDate}
                        onChange={handleDateChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <FormControl fullWidth>
                        <InputLabel>Duration</InputLabel>
                        <Select
                            value={selectedDuration}
                            onChange={handleDurationChange}
                        >
                            <MenuItem value={1}>1 min</MenuItem>
                            <MenuItem value={5}>5 min</MenuItem>
                            <MenuItem value={15}>15 min</MenuItem>
                            <MenuItem value={30}>30 min</MenuItem>
                            <MenuItem value={60}>1 hour</MenuItem>
                            <MenuItem value={120}>2 hours</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Button variant="contained" onClick={handleConfirm} fullWidth>
                        Confirm
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DurationPicker;
