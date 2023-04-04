// import {
//     CategoryScale,
//     Chart as ChartJS,
//     Legend,
//     LineElement,
//     LinearScale,
//     PointElement,
//     Title,
//     Tooltip,
// } from 'chart.js';
// import React, { useEffect, useState } from 'react';
// import { Line } from 'react-chartjs-2';

// ChartJS.register(
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
//     Title,
//     Tooltip,
//     Legend
// );

// export const options = {
//     responsive: true,
//     plugins: {
//         legend: {
//             position: 'top',
//         },
//         title: {
//             display: true,
//             text: 'Chart.js Line Chart',
//         },
//     },
// };

// const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

// export const data_ = {
//     labels,
//     datasets: [
//         {
//             label: 'Dataset 1',
//             data: labels.map(() => Array.from({ length: 100 }, () => Math.floor(Math.random() * 100))),
//             borderColor: 'rgb(255, 99, 132)',
//             backgroundColor: 'rgba(255, 99, 132, 0.5)',
//         },
//         {
//             label: 'Dataset 2',
//             data: labels.map(() => Array.from({ length: 100 }, () => Math.floor(Math.random() * 100))),
//             borderColor: 'rgb(53, 162, 235)',
//             backgroundColor: 'rgba(53, 162, 235, 0.5)',
//         },
//     ],
// };

// const Graph = () => {
//     const [socket, setSocket] = useState(null);
//     const [message, setMessage] = useState(null);
//     const [data, setData] = useState(data_);

//     const onNewData = newData => {
//         console.log(newData);
//         setData(prevData => {
//             const newDatasets = prevData.datasets.map((dataset, i) => {
//                 return {
//                     label: dataset.label,
//                     data: [...dataset.data, newData[dataset.label]],
//                     borderColor: 'rgb(53, 162, 235)',
//                     backgroundColor: 'rgba(53, 162, 235, 0.5)',
//                 };
//             });

//             const newLabels = [...prevData.labels, new Date().toLocaleTimeString()];
//             return {
//                 labels: newLabels,
//                 datasets: newDatasets
//             };
//         });
//     }

//     useEffect(() => {
//         if (!socket) return;

//         socket.onmessage = event => {
//             const message = JSON.parse(event.data);
//             console.log(event);
//             setMessage(message);
//         };
//     }, [socket]);

//     useEffect(() => {
//         const ws = new WebSocket('ws://localhost:8000/ws/sensors/');
//         console.log(ws);
//         setSocket(ws);
//         return () => {
//             ws.close();
//         };
//     }, []);

//     const handleClick = () => {
//         const message = { text: 'Hello, server!' };
//         socket.send(JSON.stringify(message));
//     };

//     return (
//         <div>
//             <button onClick={handleClick}>Send message</button>
//             <p>{message ? message.text : 'No message yet'}</p>
//             <Line data={data} />
//         </div>
//     );
// };

import { LineChart, XAxis, YAxis } from 'recharts';

import React, { useEffect, useState } from 'react';
import { Line } from 'recharts';

const Chart = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8000/ws/sensors/');

        ws.onmessage = (event) => {
            const newData = JSON.parse(event.data);
            setData((prevData) => [...prevData.slice(-100), newData]);
        };

        return () => {
            ws.close();
        };
    }, []);

    const parseDate = (value) => {
        const date = new Date(value);
        return date.getSeconds() + ":" + Math.round(date.getMilliseconds()/10);
    }

    return (
        <LineChart width={1000} height={400} data={data}>
            {/* <CartesianGrid strokeDasharray="1 1" /> */}
            <XAxis dataKey="timestamp" tickFormatter={parseDate} angle={-30} />
            <YAxis />
            {/* <Tooltip /> */}
            {/* <Legend /> */}
            <Line type="monotone" isAnimationActive={false} dot={false} dataKey="sensors.sensor_0.value" stroke="#ff0000" />
            <Line type="monotone" isAnimationActive={false} dot={false} dataKey="sensors.sensor_2.value" stroke="#3164b5" />
            {/* <Line type="monotone" dataKey="sensors.sensor_0.prediction" stroke="#0000ff" /> */}
        </LineChart>
    );
};

export default Chart;

