import type { BalanceCheckSetting } from "@/types/operator-settings";

export const checkBalance = async (settings: Partial<BalanceCheckSetting>) => {
    const secret = process.env.NEXT_PUBLIC_BIPSMS_API_SECRET;
    const baseUrl = process.env.NEXT_PUBLIC_BIPSMS_API_BASE_URL;

    if (!secret || !baseUrl) {
        throw new Error("API credentials are not configured in environment variables.");
    }
    
    if (!settings.device || !settings.simSlot || !settings.code) {
        throw new Error("Incomplete settings for balance check. Please provide Device, SIM Slot, and Code.");
    }

    const params = new URLSearchParams({
        secret,
        device: settings.device,
        sim: settings.simSlot,
        code: settings.code,
    });

    const url = `${baseUrl}?${params.toString()}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "An unknown error occurred.");
        }
        
        return data;
    } catch (error) {
        console.error("BIPSMS API Error:", error);
        if (error instanceof Error) {
            // Re-throw with a more user-friendly message
            throw new Error(error.message);
        }
        throw new Error("An unknown error occurred while checking balance.");
    }
};
