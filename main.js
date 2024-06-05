import { generateReturnArray } from "./src/investmentGoals";

const calculateButton = document.getElementById('calculate-results');
const clearFormButton = document.getElementById('clear-form');
const form = document.getElementById('investment-form');

function renderProgression(e){
    e.preventDefault();

    if(document.querySelector('.error')){
        return;
    }

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

    console.log(returnsArray);     
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

    const errorInputs = document.querySelectorAll('.error');
    errorInputs.forEach(element => {
        element.classList.remove('error');
        element.parentElement.querySelector('p').remove();
    });
}

for(const formElement of form){
    if(formElement.tagName === 'INPUT' && formElement.hasAttribute('name')){
        formElement.addEventListener('blur', validateInput);
    }
}

form.addEventListener('submit', renderProgression);
clearFormButton.addEventListener('click', clearForm);
