"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPromo = createPromo;
exports.listPromos = listPromos;
exports.getPromoById = getPromoById;
exports.updatePromo = updatePromo;
exports.deletePromo = deletePromo;
exports.validatePromo = validatePromo;
const prisma_1 = require("../config/prisma");
async function createPromo(data) {
    return prisma_1.prisma.promo.create({ data });
}
async function listPromos(activeOnly = false) {
    const where = {};
    if (activeOnly) {
        where.isActive = true;
        where.endDate = { gte: new Date() };
        where.startDate = { lte: new Date() };
    }
    return prisma_1.prisma.promo.findMany({ where, orderBy: { createdAt: 'desc' } });
}
async function getPromoById(id) {
    return prisma_1.prisma.promo.findUnique({ where: { id } });
}
async function updatePromo(id, data) {
    return prisma_1.prisma.promo.update({ where: { id }, data });
}
async function deletePromo(id) {
    return prisma_1.prisma.promo.delete({ where: { id } });
}
async function validatePromo(code, spend) {
    const promo = await prisma_1.prisma.promo.findUnique({ where: { code } });
    if (!promo)
        throw new Error('Promo not found');
    if (!promo.isActive)
        throw new Error('Promo is inactive');
    if (new Date() < promo.startDate)
        throw new Error('Promo not started yet');
    if (new Date() > promo.endDate)
        throw new Error('Promo expired');
    if (promo.maxUses && promo.usedCount >= promo.maxUses)
        throw new Error('Promo usage limit reached');
    if (promo.minSpend && spend < promo.minSpend)
        throw new Error(`Minimum spend ${promo.minSpend} required`);
    let discount = 0;
    if (promo.discountType === 'PERCENTAGE') {
        discount = spend * (promo.discountValue / 100);
    }
    else {
        discount = promo.discountValue;
    }
    return { promo, discount };
}
//# sourceMappingURL=promo.service.js.map