class Requisition {
  constructor() {
    this.url = "http://localhost:3000";
  }

  setUrl(endpoint, parameters) {
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
    this.formData = [];
  }

  validateForm() {}

  setDefaultFields(data) {}
}

class DataFormatter {
  constructor() {
    this.formattedData = [];
  }

  formatSimulationData(data) {
    data.then((result) => {
      this.formattedData = [["Meses", "Sem Aporte", "Com Aporte"]];
      for (let i in result[0]) {
        this.formattedData.push([i, values[0][i], values[1][i]]);
      }

      console.log(this.formattedData);
    });

    return this.formattedData;
  }

  formatIndicatorsData(data) {
    this.formattedData = data.then((result) => {
      let indicators = [["name", "value"]];
      for (let i in result[0]) {
        indicators.push([result[0][i], result[1][i]]);
      }
      return this.indicators;
    });

    return this.formattedData
  }
}

class Chart {
  constructor() {
    this.chartOptions = {};
    this.chartData = {};
  }

  setChartData(data) {}

  setChartOptions() {}

  drawChart() {
    this.setChartData();
    this.setChartOptions();
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

let requisition = new Requisition();
let formatter = new DataFormatter();

const response = requisition.makeRequisition("/indicadores", "");
console.log(formatter.formatIndicatorsData(response));
