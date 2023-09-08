import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Slider from "@mui/material/Slider";
import React from "react";

function HorizonSlider({ horizon, setHorizon }) {
    const handleDecrement = () => {
        if (horizon > 1) {
            setHorizon(horizon - 1);
        }
    };

    const handleIncrement = () => {
        if (horizon < 100) {
            setHorizon(horizon + 1);
        }
    };

    const handleChange = (event, newValue) => {
        setHorizon(newValue);
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
                        value={horizon}
                        onChange={handleChange}
                        valueLabelDisplay="auto"
                        marks={true}
                        min={1}
                        max={100}
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
            <FormHelperText>horizon: {horizon}</FormHelperText>
        </FormControl>
    );
}

export default HorizonSlider;
