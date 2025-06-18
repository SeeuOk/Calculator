// Calculator variables
let display = document.getElementById('display');
let history = document.getElementById('history');
let currentInput = '0';
let previousInput = '';
let operator = '';
let shouldResetDisplay = false;

// Update the display
function updateDisplay() {
    display.textContent = currentInput;
}

// Input number function
function inputNumber(num) {
    if (shouldResetDisplay) {
        currentInput = '';
        shouldResetDisplay = false;
    }
    
    if (currentInput === '0' && num !== '.') {
        currentInput = num;
    } else if (num === '.' && currentInput.includes('.')) {
        return; // Don't add multiple decimal points
    } else {
        currentInput += num;
    }
    
    updateDisplay();
}

// Input operator function
function inputOperator(op) {
    if (previousInput !== '' && currentInput !== '' && operator !== '' && !shouldResetDisplay) {
        calculate();
    }
    
    previousInput = currentInput;
    operator = op;
    shouldResetDisplay = true;
    
    // Show the operation in history
    history.textContent = `${previousInput} ${operator}`;
}

// Calculate function
function calculate() {
    if (previousInput === '' || currentInput === '' || operator === '') {
        return;
    }
    
    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    
    if (isNaN(prev) || isNaN(current)) {
        showError();
        return;
    }
    
    try {
        switch (operator) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                if (current === 0) {
                    throw new Error('Division by zero');
                }
                result = prev / current;
                break;
            default:
                return;
        }
        
        // Round to avoid floating point precision issues
        result = Math.round(result * 100000000) / 100000000;
        
        // Show calculation in history
        history.textContent = `${previousInput} ${operator} ${currentInput} =`;
        
        currentInput = result.toString();
        previousInput = '';
        operator = '';
        shouldResetDisplay = true;
        
        // Remove error class if it exists
        display.classList.remove('error');
        
    } catch (error) {
        showError();
    }
    
    updateDisplay();
}

// Show error function
function showError() {
    currentInput = 'Error';
    display.classList.add('error');
    shouldResetDisplay = true;
    history.textContent = '';
    previousInput = '';
    operator = '';
    updateDisplay();
    
    // Remove error after 2 seconds
    setTimeout(() => {
        if (currentInput === 'Error') {
            clearAll();
        }
    }, 2000);
}

// Clear all function
function clearAll() {
    currentInput = '0';
    previousInput = '';
    operator = '';
    shouldResetDisplay = false;
    history.textContent = '';
    display.classList.remove('error');
    updateDisplay();
}

// Clear entry function
function clearEntry() {
    currentInput = '0';
    display.classList.remove('error');
    updateDisplay();
}

// Backspace function
function backspace() {
    if (currentInput === 'Error') {
        clearAll();
        return;
    }
    
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    
    updateDisplay();
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    // Prevent default behavior for calculator keys
    if ('0123456789+-*/.=Enter'.includes(key) || key === 'Backspace' || key === 'Escape') {
        event.preventDefault();
    }
    
    if (key >= '0' && key <= '9') {
        inputNumber(key);
    } else if (key === '.') {
        inputNumber(key);
    } else if (key === '+') {
        inputOperator('+');
    } else if (key === '-') {
        inputOperator('-');
    } else if (key === '*') {
        inputOperator('*');
    } else if (key === '/') {
        inputOperator('/');
    } else if (key === 'Enter' || key === '=') {
        calculate();
    } else if (key === 'Escape') {
        clearAll();
    } else if (key === 'Backspace') {
        backspace();
    }
});

// Initialize display
updateDisplay();