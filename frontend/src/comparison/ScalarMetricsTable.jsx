import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import React from "react";

const ScalarMetricsTable = ({ scalarMetricsData }) => {
    const modelNames = Object.keys(scalarMetricsData);
    let metrics = [];

    if (modelNames.length) {
        metrics = Object.keys(scalarMetricsData[modelNames[0]]);
    }

    return (
        <Box height={400} overflow="auto">
            <TableContainer component={Paper}>
                <Table aria-label="Scalar Metrics Table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            {metrics.map((metric) => (
                                <TableCell key={metric} align="center">
                                    {metric}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {modelNames.map((model) => (
                            <TableRow key={model}>
                                <TableCell component="th" scope="row">
                                    <strong>{model}</strong>
                                </TableCell>
                                {metrics.map((metric) => (
                                    <TableCell key={metric} align="center">
                                        {scalarMetricsData[model][metric]}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default ScalarMetricsTable;
