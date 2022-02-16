class Requisition{constructor(){this.url="http://localhost:3000"}setUrl(t,e){this.url+=t+e}makeRequisition(t="/indicadores",e=""){return this.setUrl(t,e),fetch(this.url).then((t=>t.json()))}}class Form{constructor(){this.isValid=!1,this.formData=[]}validateForm(){}setDefaultFields(t){}}class DataFormatter{constructor(){this.formattedData=[]}formatSimulationData(t){return t.then((t=>{this.formattedData=[["Meses","Sem Aporte","Com Aporte"]];for(let e in t[0])this.formattedData.push([e,values[0][e],values[1][e]]);console.log(this.formattedData)})),this.formattedData}formatIndicatorsData(t){return this.formattedData=t.then((t=>{let e=[["name","value"]];for(let a in t[0])e.push([t[0][a],t[1][a]]);return this.indicators})),this.formattedData}}class Chart{constructor(){this.chartOptions={},this.chartData={}}setChartData(t){}setChartOptions(){}drawChart(){this.setChartData(),this.setChartOptions()}}class Controller{constructor(){this.requisition=Requisition(),this.form=Form(),this.dataFormatter=DataFormatter(),this.chart=Chart()}validateForm(){}makeRequisition(t="/indicadores",e){}formatData(t){}drawChart(){}}let requisition=new Requisition,formatter=new DataFormatter;const response=requisition.makeRequisition("/indicadores","");console.log(formatter.formatIndicatorsData(response)),document.getElementById("simulator-form").addEventListener("submit",(t=>{t.preventDefault(),drawChart()})),window.addEventListener("resize",drawChart),google.charts.load("current",{packages:["corechart"]});const fetchApi=()=>{fetch("http://localhost:3000/simulacoes?tipoIndexacao=pre&tipoRendimento=liquido").then((t=>t.json())).then((t=>{const{semAporte:e,comAporte:a}=t[0].graficoValores;formatApiReturn([e,a]),console.log("a")}))};function formatApiReturn(t){let e=[["Meses","Sem Aporte","Com Aporte"]];for(let a in t[0])e.push([a,t[0][a],t[1][a]]);localStorage.setItem("graphValues",JSON.stringify(e)),drawChart()}function drawChart(){localStorage.graphValues||fetch("http://localhost:3000/simulacoes?tipoIndexacao=pre&tipoRendimento=liquido").then((t=>t.json())).then((t=>{const{semAporte:e,comAporte:a}=t[0].graficoValores;formatApiReturn([e,a]),console.log("a")}));const t=localStorage.getItem("graphValues");let e=new google.visualization.arrayToDataTable(JSON.parse(t));var a=new google.visualization.ColumnChart(document.getElementById("graph-column")),o=new google.visualization.BarChart(document.getElementById("graph-bar"));a.draw(e,{isStacked:!0,legend:"bottom",width:"85%",height:200,colors:["#000000","#ED8E53"],chartArea:{left:60,width:"85%"},bar:{groupWidth:"85%"},hAxis:{title:"Tempo (em meses)"},vAxis:{title:"Valor (R$)"}}),o.draw(e,{isStacked:!0,legend:"bottom",width:"100%",height:400,colors:["#000000","#ED8E53"],bar:{groupWidth:"85%"},vAxis:{title:"Tempo (em meses)"},hAxis:{title:"Valor (R$)"}})}