import { Grid } from "@mui/material";
import React from "react";
import ScalarMetricsRadarChart from "./ScalarMetricsRadarChart";
import ScalarMetricsTable from "./ScalarMetricsTable";

const Metrics = ({ modelNames, scalarMetricsData }) => {
    return (
        <>
            <Grid container alignItems="center" spacing={8} marginTop={1}>
                <Grid item xs={12} md={6}>
                    <ScalarMetricsRadarChart
                        scalarMetricsData={scalarMetricsData}
                        modelNames={modelNames}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <ScalarMetricsTable scalarMetricsData={scalarMetricsData} />
                </Grid>
            </Grid>
        </>
    );
};

export default Metrics;
