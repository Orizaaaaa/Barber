"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createResource = createResource;
exports.listResources = listResources;
exports.getResourceById = getResourceById;
exports.updateResource = updateResource;
exports.deleteResource = deleteResource;
const prisma_1 = require("../config/prisma");
async function createResource(data) {
    return prisma_1.prisma.resource.create({ data });
}
async function listResources(activeOnly = false) {
    const where = {};
    if (activeOnly) {
        where.isActive = true;
    }
    return prisma_1.prisma.resource.findMany({ where, orderBy: { createdAt: 'desc' } });
}
async function getResourceById(id) {
    return prisma_1.prisma.resource.findUnique({ where: { id } });
}
async function updateResource(id, data) {
    return prisma_1.prisma.resource.update({ where: { id }, data });
}
async function deleteResource(id) {
    return prisma_1.prisma.resource.delete({ where: { id } });
}
//# sourceMappingURL=resource.service.js.map