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
- contract: this module handles all the calls to the tourii service in the contract, it uses the guards from the auth module.
- keyring: this module handles all the keyring methos from the keyring service in the contract, it creates all the user wallets, handles the keyring
  data, etc.

### Services:

- sailscallsService: this service gives the instance of SailsCalls, it helps you to send messages, queries, handle the vouchers and keyring accounts,
  you can use this service in all your module if you need to send messages to your contract.

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
</p>