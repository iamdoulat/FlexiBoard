'use server';

import type { BalanceCheckSetting } from "@/types/operator-settings";
import { db } from "@/lib/firebase";
import { collection, doc, setDoc } from "firebase/firestore";

export const checkBalance = async (settings: Partial<BalanceCheckSetting>): Promise<{ message: string; [key: string]: any }> => {
    const secret = process.env.BIPSMS_API_SECRET;
    const baseUrl = process.env.BIPSMS_API_BASE_URL;

    if (!secret || !baseUrl) {
        throw new Error("API credentials are not configured in environment variables.");
    }
    
    if (!settings.device || !settings.simSlot || !settings.code) {
        throw new Error("Incomplete settings for balance check. Please provide Device, SIM Slot, and Code.");
    }

    const body = new URLSearchParams({
        secret,
        device: settings.device,
        sim: settings.simSlot,
        code: settings.code,
    });

    try {
        const response = await fetch(baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: body,
        });

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

export const getUssdHistory = async (options: { limit?: number; page?: number } = {}): Promise<{ status: number, message: string, data: any[] }> => {
    const secret = process.env.BIPSMS_API_SECRET;
    const baseUrl = process.env.BIPSMS_API_BASE_GET_URL;

    if (!secret || !baseUrl) {
        throw new Error("API credentials for getting history are not configured in environment variables.");
    }

    const { limit = 200, page = 1 } = options;

    const queryParams = new URLSearchParams({
        secret,
        limit: limit.toString(),
        page: page.toString(),
    });

    try {
        const response = await fetch(`${baseUrl}?${queryParams.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "An unknown error occurred while fetching USSD history.");
        }
        
        if (data.status !== 200) {
            throw new Error(data.message || `API returned status ${data.status}`);
        }

        if (data.data && Array.isArray(data.data)) {
            const historyCollectionRef = collection(db, 'ussdHistory');
            const savePromises = data.data.map((item: any) => {
                if(item.id) {
                    const docRef = doc(historyCollectionRef, item.id.toString());
                    const cleanItem = Object.fromEntries(Object.entries(item).filter(([_, v]) => v !== undefined && v !== null));
                    return setDoc(docRef, cleanItem, { merge: true });
                }
                return Promise.resolve();
            });
            await Promise.all(savePromises);
        }

        return data;
    } catch (error) {
        console.error("BIPSMS GET API Error:", error);
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("An unknown error occurred while fetching USSD history.");
    }
};
