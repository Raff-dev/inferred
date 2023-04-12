import json


def add2(prev_data, new_data):
    lookahead = 2

    if not prev_data:
        prev_data = [{} for _ in range(lookahead)]
        prediction_n = 0
    else:
        prev_data.append({})
        prediction_n = len(prev_data) - lookahead

    for sensor, values in new_data["sensors"].items():
        new_value = values["value"]

        prev_data[-lookahead] = prev_data[-lookahead] or {}
        prev_data[-lookahead][sensor] = prev_data[-lookahead].get(sensor) or {}
        prev_data[-lookahead][sensor]["value"] = new_value

        for i, prediction in enumerate(values["prediction"], start=0):
            new_data = {f"prediction_{prediction_n}": prediction}
            prev_data[-lookahead + i][sensor] = (
                prev_data[-lookahead + i].get(sensor) or {}
            )
            prev_data[-lookahead + i][sensor].update(new_data)

    return prev_data


def add(prev_data, new_data):
    lookahead = 2
    sensors = new_data["sensors"]

    def new_entry():
        return {sensor: {} for sensor in sensors.keys()}

    if not prev_data:
        prev_data = [new_entry() for _ in range(lookahead)]
    else:
        prev_data.append(new_entry())

    prediction_n = len(prev_data) - lookahead
    for sensor, values in sensors.items():
        prev_data[-lookahead][sensor]["value"] = values["value"]

        for i, prediction in enumerate(values["prediction"]):
            new_data = {f"prediction_{prediction_n}": prediction}
            prev_data[-lookahead + i][sensor].update(new_data)

    return prev_data


data1 = [
    {"sensor_0": {"value": 1, "prediction_0": 1}},
    {"sensor_0": {"value": None, "prediction_0": 1}},
]
data2 = []

add_data = {"sensors": {"sensor_0": {"value": 0, "prediction": [0, 3]}}}


res1 = add(data1, add_data)
print(json.dumps(res1, indent=4))
res2 = add(data2, add_data)
print(json.dumps(res2, indent=4))
should1 = [
    {"sensor_0": {"value": 1, "prediction_0": 1}},
    {
        "sensor_0": {
            "value": 0,
            "prediction_0": 1,
            "prediction_1": 0,
        }
    },
    {"sensor_0": {"prediction_1": 3}},
]


should2 = [
    {"sensor_0": {"value": 0, "prediction_0": 0}},
    {
        "sensor_0": {
            "prediction_0": 3,
        }
    },
]

assert res1 == should1
assert res2 == should2
