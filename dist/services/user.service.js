"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.listUsers = listUsers;
exports.getUserById = getUserById;
exports.updateUser = updateUser;
const prisma_1 = require("../config/prisma");
const password_1 = require("../utils/password");
async function createUser(data) {
    const existing = await prisma_1.prisma.user.findUnique({ where: { email: data.email } });
    if (existing)
        throw new Error('Email already exists');
    const hashed = await (0, password_1.hashPassword)(data.password);
    const user = await prisma_1.prisma.user.create({
        data: {
            email: data.email,
            password: hashed,
            name: data.name,
            phone: data.phone,
            role: data.role,
        },
        select: { id: true, email: true, name: true, role: true, phone: true, createdAt: true },
    });
    return user;
}
async function listUsers(role) {
    const where = role ? { role } : {};
    return prisma_1.prisma.user.findMany({
        where,
        select: { id: true, email: true, name: true, role: true, phone: true, avatar: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
    });
}
async function getUserById(id) {
    return prisma_1.prisma.user.findUnique({
        where: { id },
        include: {
            barberProfile: true,
            customerData: true,
        },
    });
}
async function updateUser(id, data) {
    return prisma_1.prisma.user.update({
        where: { id },
        data,
        select: { id: true, email: true, name: true, role: true, phone: true, avatar: true },
    });
}
//# sourceMappingURL=user.service.js.map