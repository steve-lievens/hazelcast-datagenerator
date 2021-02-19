#!/usr/bin/env node

const yargs = require("yargs");
const axios = require("axios");

// --------------------------------------------------------------------------
// Setup command line params
// --------------------------------------------------------------------------

const options = yargs
  .usage("Usage: -n <number_of_transactions> -i <interval>")
  .option("n", {
    alias: "number_of_transactions",
    describe: "Total number of transactions that will be generated",
    type: "integer",
    demandOption: true,
  })
  .option("i", {
    alias: "interval",
    describe: "interval between transactions in seconds",
    type: "integer",
    demandOption: true,
  }).argv;

// --------------------------------------------------------------------------
// Read environment variables
// --------------------------------------------------------------------------

// When not present in the system environment variables, dotenv will take them
// from the local file
require("dotenv-defaults").config({
  path: "my.env",
  encoding: "utf8",
  defaults: "my.env.defaults",
});

// App ENV
var REST_ENDPOINT = process.env.REST_ENDPOINT;
var PAYLOAD_ROW_START = process.env.PAYLOAD_ROW_START;
var PAYLOAD_ROW_INCREMENT = process.env.PAYLOAD_ROW_INCREMENT;
var PAYLOAD_CLIENT_ID = process.env.PAYLOAD_CLIENT_ID;
var PAYLOAD_ACCOUNT_ID = process.env.PAYLOAD_ACCOUNT_ID;
var PAYLOAD_TRANS_ID_START = process.env.PAYLOAD_TRANS_ID_START;
var PAYLOAD_TRANS_ID_INCREMENT = process.env.PAYLOAD_TRANS_ID_INCREMENT;
var PAYLOAD_DATE = process.env.PAYLOAD_DATE;
var PAYLOAD_BALANCE_START = process.env.PAYLOAD_BALANCE_START;

console.log(
  "Creating " +
    options.number_of_transactions.toString() +
    " transactions every " +
    options.interval.toString() +
    " seconds."
);

// --------------------------------------------------------------------------
// Values for the operation column
// --------------------------------------------------------------------------
var creditOps = ["CREDIT_IN_CASH","COLLECTION_FROM_BANK"];
var debitOps = ["REMITTANCE_TO_BANK","CASH_WITHDRAWAL","CREDIT_CD_WITHDRAWAL"];

// --------------------------------------------------------------------------
// Create the transactions
// --------------------------------------------------------------------------
var createTransactions;
var transactionCount = 0;
var row = parseInt(PAYLOAD_ROW_START);
var rowIncrement = parseInt(PAYLOAD_ROW_INCREMENT);
var clientID = parseInt(PAYLOAD_CLIENT_ID);
var accountID = parseInt(PAYLOAD_ACCOUNT_ID);
var transID = parseInt(PAYLOAD_TRANS_ID_START);
var transIDIncrement = parseInt(PAYLOAD_TRANS_ID_INCREMENT);
var transDate = parseInt(PAYLOAD_DATE);
var balanceStart = parseInt(PAYLOAD_BALANCE_START);

createTransactions = setInterval(createTransaction, options.interval * 1000);

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function createTransaction() {
  if (transactionCount > options.number_of_transactions - 1) {
    // Stop the loop if we reach the desired number of transactions
    clearInterval(createTransactions);
  } else {
    // Amount and Balance, Credit or Debit
    var amount = randomIntFromInterval(100,1000);
    
    var randomBoolean = Math.random() < 0.5;
    var type = "";
    var operation = "";
    var opsindex = 0;
    if(randomBoolean){
        type = "CREDIT";
        opsindex = randomIntFromInterval(1,creditOps.length) - 1;
        operation = creditOps[opsindex];
    } else {
        type = "DEBIT";
        amount = amount * -1;
        opsindex = randomIntFromInterval(1,debitOps.length) - 1;
        operation = debitOps[opsindex];
    }
    var balance = balanceStart + amount;
    balanceStart = balance;

    // create a new payload object
    var payload = {
      ROW: row,
      CLIENT_ID: clientID,
      ACCOUNT_ID: accountID,
      TRANS_ID: transID,
      DATE: transDate,
      TYPE: type,
      OPERATION: operation,
      K_SYMBOL: "",
      AMOUNT: amount,
      BALANCE: balance,
    };

    // and post it
    axios
      .post(REST_ENDPOINT, payload, { headers: { Accept: "application/json" } })
      .then(
        (res) => {
          console.log("Created transaction with row " + row.toString() + ", amount :" + amount.toString());
        },
        (error) => {
          console.log(error);
        }
      );

    // Increment the counters
    transactionCount++;
    row = row + rowIncrement;
    transID = transID + transIDIncrement;
  }
}
