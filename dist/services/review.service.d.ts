export declare function createReview(data: {
    bookingId: number;
    rating: number;
    comment?: string;
}): Promise<{
    id: number;
    createdAt: Date;
    bookingId: number;
    rating: number;
    comment: string | null;
}>;
export declare function listReviews(barberId?: number): Promise<({
    booking: {
        service: {
            name: string;
        };
        barberId: number;
        customerId: number;
        customer: {
            name: string;
        };
    };
} & {
    id: number;
    createdAt: Date;
    bookingId: number;
    rating: number;
    comment: string | null;
})[]>;
export declare function getReviewByBookingId(bookingId: number): Promise<({
    booking: {
        service: {
            name: string;
        };
        barberId: number;
        customerId: number;
        customer: {
            name: string;
        };
    };
} & {
    id: number;
    createdAt: Date;
    bookingId: number;
    rating: number;
    comment: string | null;
}) | null>;
//# sourceMappingURL=review.service.d.ts.map