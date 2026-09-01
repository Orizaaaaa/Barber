"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSettings = getSettings;
exports.upsertSettings = upsertSettings;
const prisma_1 = require("../config/prisma");
async function getSettings() {
    const settings = await prisma_1.prisma.businessSettings.findFirst();
    return settings;
}
async function upsertSettings(data) {
    const existing = await prisma_1.prisma.businessSettings.findFirst();
    if (existing) {
        return prisma_1.prisma.businessSettings.update({
            where: { id: existing.id },
            data,
        });
    }
    return prisma_1.prisma.businessSettings.create({ data });
}
//# sourceMappingURL=businessSettings.service.js.map