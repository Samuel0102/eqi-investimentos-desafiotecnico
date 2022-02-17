google.charts.load('current', {'packages':['corechart']});

const controller = new Controller();

controller.setIndicators();

document.getElementById("submit-btn").addEventListener("click", (e) => {
  controller.setSimulations();
});
