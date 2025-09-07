# CLI IDL to NestJS

CLI that create a nestjs server from a given `.idl` file to interact with [Vara Network](https://vara.network/).

> Note: Your contract needs the `Keyring service` from [Vara Lab](https://github.com/Vara-Lab/Contracts-Services/tree/main/keyring-service) to build your nestjs server. 

## How to use

### Basic usage

Basic cli command to create the nestjs server, he server will be in the `generated-server` directory.

```bash
npx varalab-nestjs ./example.idl
```

### Use with specific directory

cli command to specify the directory where the nestjs server will be located, in both cases `my-server`:

```bash
npx varalab-nestjs ./example.idl --output my-server
npx varalab-nestjs ./example.idl -o my-server
```

### Instalation

You can install it to run locally the cli with the next command:

```bash
npm i -g varalab-nestjs
```