"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCustomer = registerCustomer;
exports.login = login;
exports.getMe = getMe;
const prisma_1 = require("../config/prisma");
const password_1 = require("../utils/password");
const jwt_1 = require("../utils/jwt");
async function registerCustomer(data) {
    const existing = await prisma_1.prisma.user.findUnique({ where: { email: data.email } });
    if (existing)
        throw new Error('Email already registered');
    const hashed = await (0, password_1.hashPassword)(data.password);
    const user = await prisma_1.prisma.user.create({
        data: {
            email: data.email,
            password: hashed,
            name: data.name,
            phone: data.phone,
            role: 'CUSTOMER',
            customerData: { create: {} },
        },
        select: { id: true, email: true, name: true, role: true, phone: true },
    });
    const token = (0, jwt_1.generateToken)({ id: user.id, email: user.email, name: user.name, role: user.role });
    return { user, token };
}
async function login(data) {
    const user = await prisma_1.prisma.user.findUnique({ where: { email: data.email } });
    if (!user)
        throw new Error('Invalid credentials');
    const valid = await (0, password_1.comparePassword)(data.password, user.password);
    if (!valid)
        throw new Error('Invalid credentials');
    const token = (0, jwt_1.generateToken)({ id: user.id, email: user.email, name: user.name, role: user.role });
    return {
        user: { id: user.id, email: user.email, name: user.name, role: user.role, phone: user.phone },
        token,
    };
}
async function getMe(userId) {
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, name: true, role: true, phone: true, avatar: true, createdAt: true },
    });
    if (!user)
        throw new Error('User not found');
    return user;
}
//# sourceMappingURL=auth.service.js.map