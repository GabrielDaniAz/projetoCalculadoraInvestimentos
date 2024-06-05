import { generateReturnArray } from "./src/investmentGoals";

const calculateButton = document.getElementById('calculate-results');
const form = document.getElementById('investment-form');

function renderProgression(e){
    e.preventDefault();
    const startingAmount = Number(document.getElementById('starting-amount').value);
    const additionalContribuition = Number(document.getElementById('additional-contribuition').value);
    const timeAmount = Number(document.getElementById('time-amount').value);
    const returnRate = Number(document.getElementById('return-rate').value);
    const taxRate = Number(document.getElementById('tax-rate').value);
    const timeAmountPeriod = document.getElementById('time-amount-period').value;
    const returnRatePeriod = document.getElementById('evaluation-period').value;

    const returnsArray = generateReturnArray(
        startingAmount, 
        timeAmount, 
        timeAmountPeriod,
        additionalContribuition,
        returnRate,
        returnRatePeriod
    );

    console.log(returnsArray);     
}

form.addEventListener('submit', renderProgression);