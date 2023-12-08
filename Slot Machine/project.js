/**
 * Hank Heiselbetz 
 * 12/6/2023
 * Create a Functioning Slot Machine 
 */


// 1. Deposit money
// 2. Determine number of lines to bet on
// 3. Collect a bet amount
// 4. Spin the slot machine
// 5. Check if the user won
// 6. Give user winnings 
// 7. Play Again 

const prompt = require("prompt-sync")();


//Defining the number of rows and columns for the slot machine
const ROWS = 3;
const COLS = 3;

//Allows Keys associateed with values
const SYMBOLS_COUNT = {
    A: 2,
    B: 4,
    C: 6,
    D: 8
};

const SYMBOL_VALUES = {
    A: 5,
    B: 4,
    C: 3,
    D: 2
};


/**
 * Gets a user inpute for amount deposited
 * @returns numberDepositAmount
 */
const deposit = () => {
    while(true){
        //Allows user input for amount to deposit
        const depositAmount = prompt("Enter a deposit amount: ");
        //Converts string to a float
        const numberDepositAmount = parseFloat(depositAmount);

        //Checks if deposit number is allowed
        //isNan function checks if the input is a number
        if(isNaN(numberDepositAmount) || numberDepositAmount <= 0){
            console.log("Invalid Deposit Amount, try again");
        }
        else{return numberDepositAmount;}
    }
};

/**
 * This function gets the user's number of lines for a spin
 * @returns numberOfLines
 */
const getNumberOfLines = () => {
    while(true){
        //Allows user input for amount of lines
        const linesAmount = prompt("Enter the number of lines to bet (1-3): ");
        //Converts string to a float
        const numberOfLines = parseInt(linesAmount);

        //Checks if lines amount number is allowed
        //isNan function checks if the input is a number
        if(isNaN(numberOfLines) || numberOfLines > 3 || numberOfLines < 1){
            console.log("Invalid Lines Amount, try again");
        }
        else{return numberOfLines;}
    }
};

/**
 * gets the users bet amount 
 * @param {*} balance 
 * @param {*} numberOfLines 
 * @returns numberBet
 */
const getBet = (balance, numberOfLines) => {
    while(true){
        //Allows user input for amount to bet per line
        const bet = prompt("Enter the total bet per line: ");
        //Converts string to a float
        const numberBet = parseFloat(bet);

        //Checks if bet number is allowed
        //isNan function checks if the input is a number
        if(isNaN(numberBet) || numberBet <= 0 || numberBet * numberOfLines > balance){
            console.log("Invalid bet, try again.");
        }
        else{return numberBet;}
    }
};

/**
 * Spins the slot machine
 * @returns array of reels
 */
const spin = () => {
    //Allows things to be added to array
    const symbols = [];

    //The number of each symbol is added to the array 
    //Ex: The array contains ['A', 'A', 'B', 'B', 'B', 'B', etc...]
    for(const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for(let i = 0; i < count; i++){
            symbols.push(symbol); //Adds the symbol to the array
        }
    }

    //creates an array for the entire slot machine, represented with Reels
    const reels = [];
    for(let i = 0; i < COLS; i++){
        //pushes an array inside an array of reels
        reels.push([]);
        //copies the symbols available in symbols
        //need this to be able to remove a symbol from a certain row
        const reelSymbols = [...symbols]; 
        for(let j = 0; j < ROWS; j++){
            //selects a random number
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            //Gets a symbol from reelSymbols
            const selectedSymbol = reelSymbols[randomIndex];
            //pushes that Chacter onto the slot machine at i
            reels[i].push(selectedSymbol);
            //removes the number from the row
            reelSymbols.splice(randomIndex, 1);
        }
    }
    return reels;
};

/**
 * This function converts the columns to rows to better understand a winner
 * @param {*} reels 
 * @returns transposed rows
 */
const transpose = (reels) => {
    //create a new array to conver to 
    const rows = [];

    //nested for loop to get the reels location changed from COLS to ROWS
    //From: [[A, A, A], [B, B, B], [C, C, C]] to: [[A,B,C],[A,B,C],[A,B,C]]
    for(let i = 0; i < ROWS; i++){
        rows.push([]);
        for(let j = 0; j < COLS; j++){
            rows[i].push(reels[j][i]);
        }
    }

    return rows;
};

/**
 * Prints out the Slot Machine 
 * @param {*} rows 
 */
const printRows = (rows) => {
    //int row : rows
    for(const row of rows){
        let rowString = "";

        //iterates through both the index and the element in the row
        for(const [i, symbol] of row.entries()){
            rowString += symbol;
            //checks if it is the last element, if not adds a divider between elements
            if(i != row.length -1){
                rowString += " | ";
            }
        }
        //prints the row
        console.log(rowString);
    }
};

/**
 * Checks each row to see if all are same, adds to winnings, 
 * does for each line that is bet, and returns the winnings.
 * @param {*} rows 
 * @param {*} bet 
 * @param {*} lines 
 * @returns Slot Machine winnings
 */
const getWinnings = (rows, bet, lines) =>{
    //total user winnings
    let winnings = 0;

    //Iterate through rows, considering the number of lines bet
    for(let row = 0; row < lines; row++){
        //set symbols to the row
        const symbols = rows[row];
        let allSame = true;

        //iterate through symbols, comparing each value to the first
        //break this for loop if symbols are not the same
        for(const symbol of symbols){
            if(symbol != symbols[0]){
                allSame = false;
                break;
            }
        } 

        //finds the multiplier and multiplies the bet by the symbol value
        //adding it to the total winnings
        if(allSame) {
            winnings += bet * SYMBOL_VALUES[symbols[0]];
        }
    }

    return winnings;
};

/**
 * Main Function where the game is ran
 * Asks for user input and rolls a slot machine
 * Determines if the user wins, and counts their total money
 * Asks the user if they want to play again
 */
const main = () => {
    let balance = deposit();

    while(true){
        console.log("You have a balance of $" + balance);

        const numberOfLines = getNumberOfLines();
        const bet = getBet(balance, numberOfLines);

        //Subtracts the balance by the bet and the number of lines
        balance -= bet * numberOfLines;

        const reels = spin();
        const rows = transpose(reels);
        printRows(rows);

        const winnings = getWinnings(rows, bet, numberOfLines);
        //adds the winnings to the balance
        balance += winnings;
        console.log("you won $" + winnings.toString() + "!");

        //Checks the balance if = to 0 than the game is over.
        if(balance == 0){
            console.log("You ran out of money!");
            break;
        }

        //Asks the user if the want to play again
        const playAgain = prompt("Do you want to play again (y/n)? ");
        if(playAgain == "n" || playAgain == "N") break;

    }
};

main();