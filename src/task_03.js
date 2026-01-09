const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../public/data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

const granularity = process.argv[2] || 'Weekly';

const orders = data[granularity].orders;
const calls = data[granularity].calls;

const result = [];

for (let timeKey in orders) {
    if (!calls[timeKey]) continue;

    let totalCalls = 0;
    let matchedCustomers = 0;

    for (let phone in orders[timeKey]) {
        if (calls[timeKey][phone]) {
            totalCalls += calls[timeKey][phone].totalCalls || 0;
            matchedCustomers += 1;
        }
    }

    if (matchedCustomers > 0) {
        result.push({
            time: timeKey,
            matchedCustomers: matchedCustomers,
            totalCallDuration: totalCalls,
            avgCallDurationPerCustomer: Number(
                (totalCalls / matchedCustomers).toFixed(2)
            )
        });
    }
}

console.log(
    `Derived Metric: Average Call Duration per Ordering Customer (${granularity})`
);
console.table(result);
