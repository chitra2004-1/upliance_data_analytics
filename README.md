This project aggregates Orders, Sessions, and Calls data
from an Excel dataset using Node.js and visualizes the
aggregated results using Chart.js.



## Task 1: Data Aggregation

In Task 1, raw data from the Excel file is aggregated using Node.js.

### Features
- Aggregates **Orders**, **Sessions**, and **Calls**
- Supports multiple time granularities:
  - Daily
  - Weekly
  - Monthly
- Aggregation is grouped using appropriate normalized keys:
  - Phone number for Orders and Calls
  - Device ID for Sessions
- Output is stored in a single JSON file for reuse

### Run Task 1
       node src/task_01.js
This generates the file:
public/data.json


## Task 2: Data Visualization

Task 2 visualizes the aggregated data using Chart.js.
## Features
Interactive bar charts
Dropdowns to switch:
Time granularity (Daily / Weekly / Monthly)
Data view (Orders / Sessions / Calls)
Uses the aggregated data from data.json

## Run Task 2 (Visualization)
           cd public
           npx serve .
Open the browser and visit:
        http://localhost:3000
This displays the interactive dashboard.


## Task 3: Cross-Table Matching & Derived Metrics

In Task 3, aggregated results from Task 1 are matched across datasets
to compute a meaningful derived metric.

Matching Logic
- Datasets matched: Orders and Calls
- Normalized key used: Phone Number
Matching respects the same selected time granularity

Derived Metric:
- Average Call Duration per Ordering Customer
This metric represents the average total call duration (in seconds)
made by customers who placed at least one order in a given time period.
Output Fields:
- Time period
- Number of matched customers
- Total call duration
- Average call duration per customer

## Run Task 3
   node src/task_03.js Weekly
   node src/task_03.js Monthly
   node src/task_03.js Daily

The derived metrics are displayed directly in the console.