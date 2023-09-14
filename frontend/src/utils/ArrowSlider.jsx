import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Slider from "@mui/material/Slider";
import React from "react";

const ArrowSlider = ({ value, setValue, min, max, label }) => {
    const handleDecrement = () => {
        if (value > min) {
            setValue(value - 1);
        }
    };

    const handleIncrement = () => {
        if (value < max) {
            setValue(value + 1);
        }
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <FormControl fullWidth>
            <Grid container alignItems="center" spacing={2}>
                <Grid item>
                    <IconButton
                        onClick={handleDecrement}
                        aria-label="Decrement"
                        size="large"
                    >
                        <ArrowLeftIcon fontSize="large" />
                    </IconButton>
                </Grid>
                <Grid item xs>
                    <Slider
                        value={value}
                        onChange={handleChange}
                        valueLabelDisplay="auto"
                        marks={true}
                        min={min}
                        max={max}
                        track={false}
                    />
                </Grid>
                <Grid item>
                    <IconButton
                        onClick={handleIncrement}
                        aria-label="Increment"
                        size="large"
                    >
                        <ArrowRightIcon fontSize="large" />
                    </IconButton>
                </Grid>
            </Grid>
            <FormHelperText>
                {label}: {value}
            </FormHelperText>
        </FormControl>
    );
};

export default ArrowSlider;
