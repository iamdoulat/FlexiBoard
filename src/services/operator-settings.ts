import { collection, doc, setDoc, onSnapshot, Unsubscribe, QuerySnapshot, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { RechargeSetting, BalanceCheckSetting, UssdHistoryItem } from "@/types/operator-settings";

const rechargeCollection = "rechargeOperatorSettings";
const balanceCheckCollection = "balanceCheckSettings";
const historyCollection = "ussdHistory";

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

export const onUssdHistoryUpdate = (
    onNext: (data: UssdHistoryItem[]) => void,
    onError: (error: Error) => void
): Unsubscribe => {
    const q = query(collection(db, historyCollection), orderBy("created", "desc"), limit(200));
    return onSnapshot(q, (querySnapshot) => {
        const history: UssdHistoryItem[] = [];
        querySnapshot.forEach((doc) => {
            history.push(doc.data() as UssdHistoryItem);
        });
        onNext(history);
    }, (error) => {
        console.error("Error listening to USSD history:", error);
        onError(error);
    });
};
