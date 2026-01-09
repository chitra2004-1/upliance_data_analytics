const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const fpath = path.join(__dirname, '../data/Data Analytics Intern Assignment - Data Set.xlsx');
const workbook = XLSX.readFile(fpath);

const orders = XLSX.utils.sheet_to_json(workbook.Sheets['Orders_Raw']);
const sessions = XLSX.utils.sheet_to_json(workbook.Sheets['Sessions_Raw']);
const calls = XLSX.utils.sheet_to_json(workbook.Sheets['Calls_Raw']);

function excelDtToJSDt(serial) {
    const utc_days = serial - 25569;
    const utc_value = utc_days * 86400 * 1000;
    return new Date(utc_value);
}

function formatDate(date) {
    return date.toISOString().split('T')[0];
}

function getISOWeek(date) {
    const tempDt = new Date(date.valueOf());
    const dayNum = (date.getDay() + 6) % 7;
    tempDt.setDate(tempDt.getDate() - dayNum + 3);
    const firstThursday = new Date(tempDt.getFullYear(), 0, 4);
    const weekNum =
        1 +
        Math.round(
            ((tempDt - firstThursday) / 86400000 - 3 + ((firstThursday.getDay() + 6) % 7)) / 7
        );
    return `${tempDt.getFullYear()}-${weekNum.toString().padStart(2, '0')}`;
}

function aggregateData(data, granularity, entityKey, metrics) {
    const result = {};
    data.forEach(row => {
        let dateCol = row['Order Date'] || row['Session Date'] || row['Call Date'];
        const date = excelDtToJSDt(dateCol);

        let key;
        if (granularity === 'Daily') key = formatDate(date);
        else if (granularity === 'Weekly') key = getISOWeek(date);
        else if (granularity === 'Monthly')
            key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;

        const entity = row[entityKey].toString();

        if (!result[key]) result[key] = {};
        if (!result[key][entity]) {
            result[key][entity] = {};
            metrics.forEach(m => (result[key][entity][m.name] = 0));
        }

        metrics.forEach(m => {
            result[key][entity][m.name] += Number(row[m.col]) || 0;
        });
    });
    return result;
}

const granularities = ['Daily', 'Weekly', 'Monthly'];
const finalOutput = {};

granularities.forEach(gran => {
    finalOutput[gran] = {
        orders: aggregateData(orders, gran, 'Phone', [
            { name: 'totalAmount', col: 'Amount' },
            { name: 'orderCount', col: 'Amount' }
        ]),
        sessions: aggregateData(sessions, gran, 'Device ID', [
            { name: 'totalSeverity', col: 'Severity' },
            { name: 'sessionsCount', col: 'Severity' }
        ]),
        calls: aggregateData(calls, gran, 'Phone', [{ name: 'totalCalls', col: 'Duration (sec)' }])
    };
});

const outputDir = path.join(__dirname, '../public');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

const outputPath = path.join(outputDir, 'data.json');
fs.writeFileSync(outputPath, JSON.stringify(finalOutput, null, 2));

console.log('Aggregated data exported to', outputPath);
console.log('--- Aggregated Orders, Sessions, Calls for Daily, Weekly, Monthly ---');
console.log(JSON.stringify(finalOutput, null, 2));

