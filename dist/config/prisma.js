"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const adapter_libsql_1 = require("@prisma/adapter-libsql");
const client_2 = require("@libsql/client");
const globalForPrisma = global;
const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;
function createPrismaClient() {
    if (tursoUrl && tursoAuthToken) {
        const libsql = (0, client_2.createClient)({
            url: tursoUrl,
            authToken: tursoAuthToken,
        });
        const adapter = new adapter_libsql_1.PrismaLibSQL(libsql);
        return new client_1.PrismaClient({
            adapter: adapter,
            log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
        });
    }
    return new client_1.PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
}
exports.prisma = globalForPrisma.prisma || createPrismaClient();
if (process.env.NODE_ENV !== 'production')
    globalForPrisma.prisma = exports.prisma;
//# sourceMappingURL=prisma.js.map