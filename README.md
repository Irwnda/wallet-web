# Wallet Dashboard

This is the React version of dashboard for the e-wallet in [previous assignment](https://git.ecommchannels.com/chip-universe/chip12/assignments/achmad-irwanda/wallet-transaction-api).

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)

## Features

- Display the name of the user (hardcoded)
- Display balance, total deposit and total withdraw from transactions
- Display the history of the transactions
- Add transaction form in separated page
- Validation for transaction (insufficient balance or when the amount or type is not specified)
- You might add or edit the data by editing the [json file](wallet.json)

## Installation

To install and run this backend locally, follow these steps:

1. Clone the repository:

   ```bash
    git clone -b dev https://git.ecommchannels.com/chip-universe/chip12/assignments/achmad-irwanda/wallet-web.git
   ```

2. Install dependencies:

   ```bash
    cd wallet-web
    npm ci
   ```

## Usage

- To start the program, please run the `json-server` first with node:

    ```bash
    node server/server
    ```

    and then start the dashboard with:

    ```bash
    npm run dev
    ```

    ![Dashboard View](/documentation/dashboard-view.png)
    ![Transaction Form](/documentation/transaction-form.png)
    ![Insufficient Balance](/documentation/insufficient-balance.png)
    ![No Type Specified](/documentation/no-type-specified.png)
    ![Invalid Amount](/documentation/invalid-amount.png)

- Running the Tests

    ```bash
    npm run test
    ```

    ![Test Coverage](/documentation/test-coverage.png)
