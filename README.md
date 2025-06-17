# CLI IDL to NestJS

CLI that create a nestjs server from a `.idl`.

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

## Tests

```bash
pnpm i
pnpm run test
```
