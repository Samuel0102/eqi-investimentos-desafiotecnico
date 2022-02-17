class Requisition {
  constructor() {
    this.url = "http://localhost:3000";
  }

  setUrl(endpoint, parameters) {
    this.url = "http://localhost:3000";
    this.url += endpoint + parameters;
  }

  makeRequisition(endpoint = "/indicadores", parameters = "") {
    this.setUrl(endpoint, parameters);

    return fetch(this.url).then((response) => response.json());
  }
}

class Form {
  constructor() {
    this.isValid = false;
    this.inputs = document.getElementsByClassName("form");
    this.formData = [];
  }

  validateForm() {
    let errorCounter = 0; 

    for (let element of this.inputs) {
      element.classList.remove("invalid-input");
      element.nextElementSibling.innerText = "";

      if (isNaN(element.value)) {
        element.classList.add("invalid-input");
        element.nextElementSibling.innerText =
          "Valor inválido! Apenas números!";
        errorCounter++;
      }

      if (element.value === "" || element.value === " "){
        element.classList.add("invalid-input");
        element.nextElementSibling.innerText =
          "O campo não pode ser vazio!";
        errorCounter++;
      }

    }

    this.isValid = errorCounter > 0 ? false : true;
  }

  getFormData() {
    this.validateForm();

    const radiosIndexing = document.getElementsByName("indexing");
    const radiosYield = document.getElementsByName("yield");
    this.formData = [["tipoRendimento", "tipoIndexacao"]];

    if (this.isValid) {
      let choosed = [];

      for (let element of radiosYield) {
        if (element.checked) {
          choosed.push(element.value);
        }
      }
      for (let element of radiosIndexing) {
        if (element.checked) {
          choosed.push(element.value);
        }
      }
      this.formData.push(choosed);

      return this.formData;
    }
  }

  setDefaultFields(data) {
    for (let field of data) {
      document.getElementById(field[0]).defaultValue = field[1] + "%";
    }
  }
}

class DataFormatter {
  constructor() {
    this.form = new Form();
    this.chart = new Chart();
    this.view = new View();
  }

  formatGraphData(data) {
    return data.then((result) => {
      let graphData = [["Meses", "Sem Aporte", "Com Aporte"]];
      const { semAporte, comAporte } = result[0].graficoValores;

      for (let i in comAporte) {
        graphData.push([i, semAporte[i], comAporte[i]]);
      }

      this.chart.drawChart(graphData);
    });
  }

  formatIndicatorsData(data) {
    data.then((result) => {
      let indicators = [];
      for (let i in result) {
        indicators.push([result[i]["nome"], result[i]["valor"]]);
      }

      this.form.setDefaultFields(indicators);
    });
  }

  formatSimulationInfoData(data) {
    data.then((result) => {
      const {
        valorFinalBruto,
        aliquotaIR,
        valorPagoIR,
        valorTotalInvestido,
        valorFinalLiquido,
        ganhoLiquido,
      } = result[0];

      let info = [
        "R$ " + valorFinalBruto,
        aliquotaIR + " %",
        "R$ " + valorPagoIR,
        "R$ " + valorFinalLiquido,
        "R$ " + valorTotalInvestido,
        "R$ " + ganhoLiquido,
      ];

      this.view.setSimulationInfoHTML(info);
    });
  }
}

class Chart {
  constructor() {
    this.chartOptions = {};
    this.chartData = {};
  }

  setChartData(data) {
    this.chartData = google.visualization.arrayToDataTable(data);
  }

  setChartOptions() {
    let optionsCol = {
      isStacked: true,
      legend: "bottom",
      width: "85%",
      height: 200,
      colors: ["#000000", "#ED8E53"],
      chartArea: {
        left: 60,
        width: "85%",
      },
      bar: { groupWidth: "85%" },
      hAxis: {
        title: "Tempo (em meses)",
      },
      vAxis: {
        title: "Valor (R$)",
      },
    };

    let optionsBar = {
      isStacked: true,
      legend: "bottom",
      width: "100%",
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

    this.chartOptions = [optionsBar, optionsCol];
  }

  drawChart(data) {
    this.setChartData(data);
    this.setChartOptions();

    // Instantiate and draw our chart, passing in some options.
    let chartCol = new google.visualization.ColumnChart(
      document.getElementById("graph-column")
    );

    let chartBar = new google.visualization.BarChart(
      document.getElementById("graph-bar")
    );

    chartBar.draw(this.chartData, this.chartOptions[0]);
    chartCol.draw(this.chartData, this.chartOptions[1]);
  }
}

class View {
  setSimulationInfoHTML(data) {
    const infoHTML = document.querySelectorAll(".info > span");

    for (const [index, element] of infoHTML.entries()) {
      element.innerText = data[index];
    }
  }
}

class Controller {
  constructor() {
    this.requisition = new Requisition();
    this.form = new Form();
    this.dataFormatter = new DataFormatter();
    this.chart = new Chart();
    this.view = new View();
  }

  getFormData() {
    return this.form.getFormData();
  }

  setIndicators(endpoint = "/indicadores", parameters = "") {
    const response = this.requisition.makeRequisition(endpoint, parameters);
    this.dataFormatter.formatIndicatorsData(response);
  }

  setSimulation() {
    const formData = this.getFormData();
    const parameters = `?tipoRendimento=${formData[1][0]}&tipoIndexacao=${formData[1][1]}`;
    const response = this.requisition.makeRequisition(
      "/simulacoes",
      parameters
    );

    this.dataFormatter.formatGraphData(response);
    this.dataFormatter.formatSimulationInfoData(response);
  }
}
