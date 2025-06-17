# Nestestjs server

The nestjs server contains a `.env` file where you can find the jwt secrets key and the port.

To install all dependencies, use:

```bash
pnpm i
```

To run the server in development mode, use

```bash
pnpm run start:dev
```

## Server structure

### Modules:

- auth: this module contains all the login to register, login and manage the jwt tokens from the users, it contains some to protect all the apis 
  that need verification from the user.
- keyring: this module handles all the keyring methos from the keyring service in the contract, it creates all the user wallets, handles the keyring
  data, etc.

### Services:

- sailscallsService: this service gives the instance of SailsCalls, it helps you to send messages, queries, handle the vouchers and keyring accounts,
  you can use this service in all your module if you need to send messages to your contract.


### Nestjs url
Following are the available url for nestjs server based on the provided idl:
- Url for Green query in service TrafficLight: *https://localhost:8000/trafficlight/command/green*
- Url for RandomFuncCommand query in service TrafficLight: *https://localhost:8000/trafficlight/command/randomfunccommand*
- Url for Red query in service TrafficLight: *https://localhost:8000/trafficlight/command/red*
- Url for Yellow query in service TrafficLight: *https://localhost:8000/trafficlight/command/yellow*
- Url for ContractOwner command in service TrafficLight: *https://localhost:port/trafficlight/query/contractowner*
- Url for RandomFuncQuery command in service TrafficLight: *https://localhost:port/trafficlight/query/randomfuncquery*
- Url for TrafficLight command in service TrafficLight: *https://localhost:port/trafficlight/query/trafficlight*

<p align="center">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
</p>