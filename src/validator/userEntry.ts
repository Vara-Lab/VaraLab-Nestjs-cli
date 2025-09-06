import * as z from "zod";

export const userEntrySchema = z.object({
    idlProgram: z.any(),
    nestjsPath: z.string(),
    contractClientPath: z.string(),
    outPath: z.string(),

    contractIdl: z.string(),
    contractId: z.string().trim().regex(/^0x[a-fA-F0-9]{0,}$/, { error: "Invalid address" }).transform((s) => s as `0x${string}`),
    rpcUrl: z.enum(['wss://testnet.vara.network', 'wss://rpc.vara.network', 'ws://localhost:9944']),
    nodeEnv: z.enum(['development', 'production']),
    port: z.coerce.number({ error: 'Receiver string, ' }),
    workerWaitingTime: z.coerce.number().transform((val) => String(val)),
    sponsorName: z.string().default(""),
    sponsorMnemonic: z.string().default(""),
    initialTokensForVoucher: z.coerce.number(),
    initialVoucherExpiration: z.coerce.number(),
    minTokensForVoucher: z.coerce.number(),
    tokensToAddToVOucher: z.coerce.number(),
    newVoucherExpiration: z.coerce.number()
})