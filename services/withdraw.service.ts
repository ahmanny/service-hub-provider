import API from "@/lib/axios";

export interface WithdrawalRequest {
    _id: string;
    amount: number;
    status: "pending" | "completed" | "failed";
    reference: string;
    description: string;
    createdAt: string;
}

export interface WithdrawalHistoryResponse {
    withdrawals: WithdrawalRequest[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

export const requestWithdrawal = async (amount: number) => {
    const { data } = await API.post("/provider/withdraw", { amount });
    return data;
};

export const getWithdrawalHistory = async (page: number = 1, limit: number = 20) => {
    const { data } = await API.get("/provider/withdrawals", {
        params: { page, limit },
    });
    return data;
};