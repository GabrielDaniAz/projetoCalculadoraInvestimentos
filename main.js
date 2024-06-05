import { generateReturnArray } from "./src/investmentGoals";
import { Chart } from "chart.js/auto";
import { createTable } from "./src/table";

const calculateButton = document.getElementById('calculate-results');
const clearFormButton = document.getElementById('clear-form');
const form = document.getElementById('investment-form');

const finalMoneyChart = document.getElementById('final-money-distribution');
const progressionChart = document.getElementById('progression');
let doughnutChartReference = {};
let progressionChartReference = {};

const columnsArray = [
    { columnLabel: "Mês", accessor: "month" },
    { columnLabel: "Total investido", accessor: "investedAmount", format: numberInfo => formatCurrency(numberInfo) },
    { columnLabel: "Rendimento mensal", accessor: "interestReturns", format: numberInfo => formatCurrency(numberInfo) },
    { columnLabel: "Rendimento total", accessor: "totalInterestReturns", format: numberInfo => formatCurrency(numberInfo) },
    { columnLabel: "Quantia total", accessor: "totalAmount", format: numberInfo => formatCurrency(numberInfo) },
];

function formatCurrency(value){
    return value.toLocaleString("pt-BR", {style: 'currency', currency: 'BRL'});
}

function renderProgression(e){
    e.preventDefault();

    if(document.querySelector('.error')){
        return;
    }

    resetCharts();

    const startingAmount = Number(document.getElementById('starting-amount').value.replace(",","."));
    const additionalContribuition = Number(document.getElementById('additional-contribuition').value.replace(",","."));
    const timeAmount = Number(document.getElementById('time-amount').value);
    const timeAmountPeriod = document.getElementById('time-amount-period').value;
    const returnRate = Number(document.getElementById('return-rate').value.replace(",","."));
    const returnRatePeriod = document.getElementById('evaluation-period').value;
    const taxRate = Number(document.getElementById('tax-rate').value.replace(",","."));

    const returnsArray = generateReturnArray(
        startingAmount, 
        timeAmount, 
        timeAmountPeriod,
        additionalContribuition,
        returnRate,
        returnRatePeriod
    );

    const finalInvestmentObject = returnsArray[returnsArray.length - 1];

    // doughnutChartReference = new Chart(finalMoneyChart, {
    //     type: 'doughnut',
    //     data: {
    //         labels: ['Total Investido','Rendimento','Imposto'],
    //         datasets: [{
    //           data: [
    //             formatCurrency(finalInvestmentObject.investedAmount), 
    //             formatCurrency(finalInvestmentObject.totalInterestReturns*(1 - taxRate/100)), 
    //             formatCurrency(finalInvestmentObject.totalInterestReturns*(taxRate/100))
    //             ],
    //           backgroundColor: [
    //             'rgb(255, 99, 132)',
    //             'rgb(54, 162, 235)',
    //             'rgb(255, 205, 86)'
    //           ],
    //           hoverOffset: 4
    //         }]
    //       }
    // }); 

    // progressionChartReference = new Chart(progressionChart, {
    //     type: 'bar',
    //     data: {
    //         labels: returnsArray.map(investmentObject => investmentObject.month),
    //         datasets: [
    //             {
    //             label: 'Total Investido',
    //             data: returnsArray.map((investimentObject) => formatCurrency(investimentObject.investedAmount)),
    //             backgroundColor: 'rgb(255, 99, 132)',
    //             },
    //             {
    //             label: 'Retorno de Investimento',
    //             data: returnsArray.map((investimentObject) => formatCurrency(investimentObject.interestReturns)),
    //             backgroundColor: 'rgb(54, 162, 235)',
    //             },
    //         ]
    //     },
    //     options: {
    //         responsive: true,
    //         scales: {
    //           x: {
    //             stacked: true,
    //           },
    //           y: {
    //             stacked: true
    //           }
    //         }
    //       }
    // });

    createTable(columnsArray, returnsArray, 'results-table');
}

function validateInput(e){
    if(e.target.value === ''){
        return;
    }

    const {parentElement} = e.target;
    const grandParentElement = e.target.parentElement.parentElement;
    const inputValue = e.target.value.replace(",",".");

    if((isNaN(inputValue) || Number(inputValue) <= 0) && !parentElement.classList.contains("error")){
        const errorTextElement = document.createElement('p');
        errorTextElement.classList.add('text-red-500');
        errorTextElement.innerText = "Insira um valor numérico maior que zero.";

        parentElement.classList.add('error');
        grandParentElement.appendChild(errorTextElement);
    } else if(parentElement.classList.contains("error") && !isNaN(inputValue) && Number(inputValue) > 0){
        parentElement.classList.remove('error');
        grandParentElement.querySelector('p').remove();
    }
}

function clearForm(){
    form['starting-amount'].value = '';
    form['additional-contribuition'].value = '';
    form['time-amount'].value = '';
    form['return-rate'].value = '';
    form['tax-rate'].value = '';

    resetCharts();

    const errorInputs = document.querySelectorAll('.error');
    errorInputs.forEach(element => {
        element.classList.remove('error');
        element.parentElement.querySelector('p').remove();
    });
}

function isObjectEmpty(obj){
    return Object.keys(obj).length === 0;
}

function resetCharts(){
    if(
        !isObjectEmpty(doughnutChartReference) && 
        !isObjectEmpty(progressionChartReference)){
        doughnutChartReference.destroy();
        progressionChartReference.destroy();
    }
}

for(const formElement of form){
    if(formElement.tagName === 'INPUT' && formElement.hasAttribute('name')){
        formElement.addEventListener('blur', validateInput);
    }
}

form.addEventListener('submit', renderProgression);
clearFormButton.addEventListener('click', clearForm);
