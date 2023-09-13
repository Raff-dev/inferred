import { transformPredictions } from "../PredictionTimeline";

const inputObject = [
    {
        start_timestamp: "t1",
        predictions: ["v11", "v12", "v13"],
    },
    {
        start_timestamp: "t2",
        predictions: ["v21", "v22", "v23"],
    },
    {
        start_timestamp: "t3",
        predictions: ["v31", "v32", "v33"],
    },
];

const expectedOutput = [
    {
        timestamp: "t1",
        p1: "v11",
    },
    {
        timestamp: "t2",
        p1: "v12",
        p2: "v21",
    },
    {
        timestamp: "t3",
        p1: "v13",
        p2: "v22",
        p3: "v31",
    },
    {
        timestamp: "t4",
        p2: "v23",
        p3: "v32",
    },
    {
        timestamp: "t5",
        p3: "v33",
    },
];

const output = transformPredictions(inputObject);

for (let i = 0; i < expectedOutput.length; i++) {
    console.log(
        JSON.stringify(expectedOutput[i]) === JSON.stringify(output[i]),
        expectedOutput[i],
        output[i]
    );
}
