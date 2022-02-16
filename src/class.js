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

      if (!parseFloat(element.value)) {
        element.classList.add("invalid-input");
        element.nextElementSibling.innerText =
          "Valor inválido! Apenas números!";
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
    for (let field of JSON.parse(data)) {
      document.getElementById(field[0]).defaultValue = field[1] + "%";
    }
  }
}

class DataFormatter {
  formatSimulationData(data) {
    data.then((result) => {
      let simulations = [["Meses", "Sem Aporte", "Com Aporte"]];
      const { semAporte, comAporte } = result[0].graficoValores;

      for (let i in comAporte) {
        simulations.push([i, semAporte[i], comAporte[i]]);
      }

      localStorage.setItem("simulations", JSON.stringify(simulations));
    });
  }

  formatIndicatorsData(data) {
    data.then((result) => {
      let indicators = [];
      for (let i in result) {
        indicators.push([result[i]["nome"], result[i]["valor"]]);
      }

      localStorage.setItem("indicators", JSON.stringify(indicators));
    });
  }
}

class Chart {
  constructor() {
    this.chartOptions = {};
    this.chartData = {};
  }

  setChartData() {
    this.chartData = new google.visualization.arrayToDataTable(
      JSON.parse(localStorage["simulations"])
    );
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

  drawChart() {
    this.setChartData();
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

class Controller {
  constructor() {
    this.requisition = Requisition();
    this.form = Form();
    this.dataFormatter = DataFormatter();
    this.chart = Chart();
  }

  validateForm() {}

  makeRequisition(endpoint = "/indicadores", parameters) {}

  formatData(data) {}

  drawChart() {}
}
