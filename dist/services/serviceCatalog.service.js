"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createService = createService;
exports.listServices = listServices;
exports.getServiceById = getServiceById;
exports.updateService = updateService;
exports.deleteService = deleteService;
const prisma_1 = require("../config/prisma");
async function createService(data) {
    return prisma_1.prisma.service.create({ data });
}
async function listServices(activeOnly = true) {
    return prisma_1.prisma.service.findMany({
        where: activeOnly ? { isActive: true } : undefined,
        orderBy: { createdAt: 'desc' },
    });
}
async function getServiceById(id) {
    return prisma_1.prisma.service.findUnique({ where: { id } });
}
async function updateService(id, data) {
    return prisma_1.prisma.service.update({ where: { id }, data });
}
async function deleteService(id) {
    return prisma_1.prisma.service.delete({ where: { id } });
}
//# sourceMappingURL=serviceCatalog.service.js.map