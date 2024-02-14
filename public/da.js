const sample = [
    {
        time: '9am',
        value: 15,
        color: '#000000'
    },
    {
        time: '10am',
        value: 20,
        color: '#000000'
    },
    {
        time: '11am',
        value: 25,
        color: '#00a2ee'
    },
    {
        time: '12pm',
        value: 40,
        color: '#fbcb39'
    },
    {
        time: '1pm',
        value: 45,
        color: '#007bc8'
    },
    {
        time: '2pm',
        value: 47,
        color: '#65cedb'
    },
    {
        time: '3pm',
        value: 30,
        color: '#fd2901'
    },
    {
        time: '4pm',
        value: 20,
        color: '#f9de3f'
    },
    {
        time: '5pm',
        value: 25,
        color: '#5d2f8e'
    },
    {
        time: '6pm',
        value: 45,
        color: '#008fc9'
    },
    {
        time: '7pm',
        value: 40,
        color: '#507dca'
    },
    {
        time: '8pm',
        value: 30,
        color: '#507dca'
    },
    {
        time: '9pm',
        value: 13,
        color: '#507dca'
    }

];

const svg = d3.select('svg');
const svgContainer = d3.select('#container');

const margin = 80;
const width = 700 - 2 * margin;
const height = 500 - 2 * margin;

const chart = svg.append('g')
    .attr('transform', `translate(${margin}, ${margin})`);

const xScale = d3.scaleBand()
    .range([0, width])
    .domain(sample.map((s) => s.time))
    .padding(0.3)

const yScale = d3.scaleLinear()
    .range([height, 0])
    .domain([0, 100]);

// vertical grid lines
// const makeXLines = () => d3.axisBottom()
//   .scale(xScale)

const makeYLines = () => d3.axisLeft()
    .scale(yScale)

chart.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(xScale));

chart.append('g')
    .call(d3.axisLeft(yScale));

// vertical grid lines
// chart.append('g')
//   .attr('class', 'grid')
//   .attr('transform', `translate(0, ${height})`)
//   .call(makeXLines()
//     .tickSize(-height, 0, 0)
//     .tickFormat('')
//   )

chart.append('g')
    .attr('class', 'grid')
    .call(makeYLines()
        .tickSize(-width, 0, 0)
        .tickFormat('')
    )

const barGroups = chart.selectAll()
    .data(sample)
    .enter()
    .append('g')

barGroups
    .append('rect')
    .attr('class', 'bar')
    .attr('x', (g) => xScale(g.time))
    .attr('y', (g) => yScale(g.value))
    .attr('height', (g) => height - yScale(g.value))
    .attr('width', xScale.bandwidth())
    .on('mouseenter', function (event, d) {
        d3.selectAll('.value')
            .attr('opacity', 0)
            .attr('fill', '#ffffff');

        d3.select(this)
            .transition()
            .duration(300)
            .attr('opacity', 0.6)
            .attr('x', (a) => xScale(a.time) - 5)
            .attr('width', xScale.bandwidth() + 10);

        const y = yScale(d.value);

        line = chart.append('line')
            .attr('id', 'limit')
            .attr('x1', 0)
            .attr('y1', y)
            .attr('x2', width)
            .attr('y2', y);

        barGroups.append('text')
            .attr('class', 'divergence')
            .attr('x', (a) => xScale(a.time) + xScale.bandwidth() / 2)
            .attr('y', (a) => yScale(a.value) + 30)
            .attr('text-anchor', 'middle')
            .html((a) => {
                const divergence = (a.value - d.value).toFixed(1);
                let text = '';
                if (divergence > 0) {
                    text += '+';
                    text += divergence;
                    return `<tspan fill="green">${text}</tspan>`;
                } else if (divergence < 0) {
                    text += divergence;
                    return `<tspan fill="red">${text}</tspan>`;
                } else {
                    return text;
                }
            });

    })
    .on('mouseleave', function (event, d) {
        d3.selectAll('.value')
            .attr('opacity', 1);

        d3.select(this)
            .transition()
            .duration(300)
            .attr('opacity', 1)
            .attr('x', (a) => xScale(a.time))
            .attr('width', xScale.bandwidth());

        chart.selectAll('#limit').remove();
        chart.selectAll('.divergence').remove();
    });


barGroups
    .append('text')
    .attr('class', 'value')
    .attr('x', (a) => xScale(a.time) + xScale.bandwidth() / 2)
    .attr('y', (a) => yScale(a.value) + 30)
    .attr('text-anchor', 'middle')
    .text((a) => `${a.value}`)

svg
    .append('text')
    .attr('class', 'label')
    .attr('x', -(height / 2) - margin)
    .attr('y', margin / 2.4)
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'middle')
    .text('Number of Visitors')

svg.append('text')
    .attr('class', 'label')
    .attr('x', width / 2 + margin)
    .attr('y', height + margin * 1.7)
    .attr('text-anchor', 'middle')
    .text('Time')

svg.append('text')
    .attr('class', 'title')
    .attr('x', width / 2 + margin)
    .attr('y', 40)
    .attr('text-anchor', 'middle')
    .text('Traffic vs Time')

svg.append('text')
    .attr('class', 'source')
    .attr('x', width - margin / 2)
    .attr('y', height + margin * 1.7)
    .attr('text-anchor', 'start')