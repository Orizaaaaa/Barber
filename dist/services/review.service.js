"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReview = createReview;
exports.listReviews = listReviews;
exports.getReviewByBookingId = getReviewByBookingId;
const prisma_1 = require("../config/prisma");
async function createReview(data) {
    const booking = await prisma_1.prisma.booking.findUnique({ where: { id: data.bookingId } });
    if (!booking)
        throw new Error('Booking not found');
    if (booking.status !== 'COMPLETED')
        throw new Error('Only completed bookings can be reviewed');
    return prisma_1.prisma.review.create({
        data,
    });
}
async function listReviews(barberId) {
    const where = {};
    if (barberId) {
        where.booking = { barberId };
    }
    return prisma_1.prisma.review.findMany({
        where,
        include: {
            booking: {
                select: {
                    customerId: true,
                    barberId: true,
                    service: { select: { name: true } },
                    customer: { select: { name: true } },
                },
            },
        },
        orderBy: { createdAt: 'desc' },
    });
}
async function getReviewByBookingId(bookingId) {
    return prisma_1.prisma.review.findUnique({
        where: { bookingId },
        include: {
            booking: {
                select: {
                    customerId: true,
                    barberId: true,
                    service: { select: { name: true } },
                    customer: { select: { name: true } },
                },
            },
        },
    });
}
//# sourceMappingURL=review.service.js.map