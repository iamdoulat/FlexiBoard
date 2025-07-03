import { collection, doc, setDoc, onSnapshot, Unsubscribe, QuerySnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { RechargeSetting, BalanceCheckSetting } from "@/types/operator-settings";

const rechargeCollection = "rechargeOperatorSettings";
const balanceCheckCollection = "balanceCheckSettings";

export const saveRechargeSetting = async (operatorId: string, data: Partial<RechargeSetting>) => {
    const docRef = doc(db, rechargeCollection, operatorId.toUpperCase());
    await setDoc(docRef, data, { merge: true });
};

export const saveBalanceCheckSetting = async (operatorId: string, data: Partial<BalanceCheckSetting>) => {
    const docRef = doc(db, balanceCheckCollection, operatorId.toUpperCase());
    await setDoc(docRef, data, { merge: true });
};

export const onRechargeSettingsUpdate = (callback: (data: Record<string, RechargeSetting>) => void): Unsubscribe => {
    const q = collection(db, rechargeCollection);
    return onSnapshot(q, (querySnapshot: QuerySnapshot) => {
        const settings: Record<string, RechargeSetting> = {};
        querySnapshot.forEach((doc) => {
            settings[doc.id] = doc.data() as RechargeSetting;
        });
        callback(settings);
    });
};

export const onBalanceCheckSettingsUpdate = (callback: (data: Record<string, BalanceCheckSetting>) => void): Unsubscribe => {
    const q = collection(db, balanceCheckCollection);
    return onSnapshot(q, (querySnapshot) => {
        const settings: Record<string, BalanceCheckSetting> = {};
        querySnapshot.forEach((doc) => {
            settings[doc.id] = doc.data() as BalanceCheckSetting;
        });
        callback(settings);
    });
};
