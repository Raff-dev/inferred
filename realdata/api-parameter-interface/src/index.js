import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";

const DEVICES = [
    { value: "68656-U31DVD7X4Z8", label: "68656-U31DVD7X4Z8" },
    { value: "68654-U31DTZZJXTE", label: "68654-U31DTZZJXTE" },
    { value: "10064-u333fgggh7k", label: "10064-u333fgggh7k" },
];

const INTERVAL_VALUES = [
    { value: "PT1S", label: "1 Second" },
    { value: "PT5S", label: "5 Seconds" },
    { value: "PT15S", label: "15 Seconds" },
    { value: "PT30S", label: "30 Seconds" },
    { value: "PT1M", label: "1 Minute" },
    { value: "PT5M", label: "5 Minutes" },
    { value: "PT15M", label: "15 Minutes" },
    { value: "PT30M", label: "30 Minutes" },
    { value: "PT1H", label: "1 Hour" },
    { value: "PT5H", label: "5 Hours" },
    { value: "PT15H", label: "15 Hours" },
    { value: "PT24H", label: "24 Hours" },
];

function App() {
    const [device, setDevice] = useState(DEVICES[0].value);
    const [dateTime, setDateTime] = useState("");
    const [interval, setInterval] = useState(INTERVAL_VALUES[0].value);
    const [recordCount, setRecordCount] = useState(100);
    const [output, setOutput] = useState("");

    useEffect(() => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const year = yesterday.getFullYear();
        const month = String(yesterday.getMonth() + 1).padStart(2, "0");
        const day = String(yesterday.getDate()).padStart(2, "0");
        const hours = String(yesterday.getHours()).padStart(2, "0");
        const minutes = String(yesterday.getMinutes()).padStart(2, "0");

        const dateTimeString = `${year}-${month}-${day}T${hours}:${minutes}`;
        setDateTime(dateTimeString);
    }, []);

    const fetchData = () => {
        const base_url =
            "https://api.opensensorweb.de/v0/networks/luftdaten-info/devices";
        const full_url = `${base_url}/${device}/sensors/pressure/measurements?interval=R${recordCount}/${dateTime}Z/${interval}&includeLatest=true`;

        fetch(full_url)
            .then((response) => response.json())
            .then((data) => setOutput(JSON.stringify(data, null, 2)))
            .catch((error) => setOutput(`An error occurred: ${error}`));
    };

    return (
        <div className="App">
            <h1>API Parameter Interface</h1>

            <label>Select Device:</label>
            <select onChange={(e) => setDevice(e.target.value)} value={device}>
                {DEVICES.map((device) => (
                    <option key={device.value} value={device.value}>
                        {device.label}
                    </option>
                ))}
            </select>

            <br />
            <br />

            <label>Select Datetime:</label>
            <input
                type="datetime-local"
                onChange={(e) => setDateTime(e.target.value)}
                value={dateTime}
            />

            <br />
            <br />

            <label>Select Interval:</label>
            <select
                onChange={(e) => setInterval(e.target.value)}
                value={interval}
            >
                {INTERVAL_VALUES.map((interval) => (
                    <option key={interval.value} value={interval.value}>
                        {interval.label}
                    </option>
                ))}
            </select>

            <br />
            <br />

            <label>Record Count (Rn):</label>
            <input
                type="number"
                onChange={(e) => setRecordCount(e.target.value)}
                value={recordCount}
            />
            <button onClick={fetchData}>Fetch Data</button>
            <div>
                <pre>{output}</pre>
            </div>
        </div>
    );
}

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
