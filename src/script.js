document.getElementById('simulator-form').addEventListener('click', (e) => {
    e.preventDefault();
    fetchApi();

})

google.charts.load("current", { packages: ["corechart"] });

const fetchApi = () => {
  const url = "http://localhost:3000/simulacoes?tipoIndexacao=pre&tipoRendimento=liquido";

  fetch(url)
    .then(response => response.json())
    .then(result => {
      const {semAporte, comAporte} = result[0].graficoValores;
      formatApiReturn([semAporte, comAporte]);
    })
}

function formatApiReturn(values){
  let graphValues = [['Meses', 'Sem Aporte', 'Com Aporte']];

  for(let i in values[0]){
    graphValues.push([i, values[0][i], values[1][i]]);
  }

  drawChart(graphValues);
}

function drawChart(values) {
  let data = new google.visualization.arrayToDataTable(values);

  // Set chart options
  var optionsCol = {
    isStacked: true,
    legend: "bottom",
    width: '85%',
    height: 200,
    colors: ["#000000", "#ED8E53"],
    chartArea: {
        left: 60,
        width: '85%'
    },
    bar: { groupWidth: "85%" },
    hAxis: {
      title: "Tempo (em meses)",
    },
    vAxis: {
      title: "Valor (R$)",
    },
  };

  // Set chart options
  var optionsBar = {
    isStacked: true,
    legend: "bottom",
    width: '100%',
    height: 400,
    colors: ["#000000", "#ED8E53"],
    bar: { groupWidth: "85%" },
    vAxis: {
      title: "Tempo (em meses)",
    },
    hAxis: {
      title: "Valor (R$)",
    },
  };

  // Instantiate and draw our chart, passing in some options.
  var chartCol = new google.visualization.ColumnChart(
    document.getElementById("graph-column")
  );

  var chartBar = new google.visualization.BarChart(
    document.getElementById("graph-bar")
  );

  chartCol.draw(data, optionsCol);
  chartBar.draw(data, optionsBar);
}
