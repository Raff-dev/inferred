import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import React from "react";
import { darkTheme } from "../themes.jsx"; // Import the dark theme

const ScalarMetricsTable = ({ scalarMetricsData }) => {
    const modelNames = Object.keys(scalarMetricsData);
    const metrics = Object.keys(scalarMetricsData[modelNames[0]]);

    return (
        <TableContainer
            component={Paper}
            style={{ backgroundColor: darkTheme.palette.background.default }}
        >
            <Table aria-label="Scalar Metrics Table" fixedHeader={true}>
                <TableHead>
                    <TableRow>
                        <TableCell />
                        {metrics.map((metric) => (
                            <TableCell
                                key={metric}
                                align="center"
                                style={{ color: darkTheme.palette.text.primary }}
                            >
                                {metric}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {modelNames.map((model) => (
                        <TableRow key={model}>
                            <TableCell
                                component="th"
                                scope="row"
                                style={{ color: darkTheme.palette.text.primary }}
                            >
                                <strong>{model}</strong>
                            </TableCell>
                            {metrics.map((metric) => (
                                <TableCell
                                    key={metric}
                                    align="center"
                                    style={{ color: darkTheme.palette.text.primary }}
                                >
                                    {scalarMetricsData[model][metric]}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ScalarMetricsTable;
