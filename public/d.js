const data = {
    labels: [
        'Red',
        'Blue',
        'Yellow'
    ],
    datasets: [{
        label: 'My First Dataset',
        data: [300, 50, 100],
        backgroundColor: [
            'rgb(255, 99, 132,0.5)',
            'rgb(54, 162, 235,0.5)',
            'rgb(255, 205, 86,0.5)'
        ],
        hoverOffset: 4

    }]
};

// Chart Configuration
const config = {
    type: 'doughnut',
    data: data,
    options: {
        responsive: true
    }
};

// Create Chart
const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, config,);