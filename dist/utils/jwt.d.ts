export declare function generateToken(payload: {
    id: number;
    email: string;
    name: string;
    role: string;
}): string;
export declare function verifyToken(token: string): {
    id: number;
    email: string;
    name: string;
    role: string;
};
//# sourceMappingURL=jwt.d.ts.map