const canvas = document.getElementById('chartCanvas').getContext('2d');
let chart;

async function loadData() {
    const response = await fetch('data.json');
    const data = await response.json();
    return data;
}

function drawChart(data, granularity, dataView) {
    const labels = Object.keys(data[granularity][dataView]);
    const values = labels.map(label => {
        const items = data[granularity][dataView][label];
        return Object.values(items).reduce((sum, obj) => {
            if (dataView === 'orders') return sum + obj.totalAmount;
            if (dataView === 'sessions') return sum + obj.totalSeverity;
            if (dataView === 'calls') return sum + obj.totalCalls;
            return sum;
        }, 0);
    });

    if (chart) chart.destroy();

    chart = new Chart(canvas, {
        type: 'bar',
        data: { labels, datasets: [{ label: dataView, data: values, backgroundColor: 'rgba(75,192,192,0.6)' }] },
        options: { responsive: true, plugins: { legend: { display: true } } }
    });
}

document.getElementById('granularity').addEventListener('change', async () => {
    const gran = document.getElementById('granularity').value;
    const view = document.getElementById('dataView').value;
    const data = await loadData();
    drawChart(data, gran, view);
});

document.getElementById('dataView').addEventListener('change', async () => {
    const gran = document.getElementById('granularity').value;
    const view = document.getElementById('dataView').value;
    const data = await loadData();
    drawChart(data, gran, view);
});

(async () => {
    const data = await loadData();
    drawChart(data, 'Weekly', 'orders');
})();
