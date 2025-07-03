import { collection, onSnapshot, Unsubscribe, query, orderBy, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Transaction } from "@/types/transaction";

export const onTransactionsUpdate = (
    onNext: (transactions: Transaction[]) => void,
    onError: (error: Error) => void
): Unsubscribe => {
    const q = query(collection(db, "transactions"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (querySnapshot) => {
        const transactions: Transaction[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            transactions.push({
                ...data,
                id: doc.id,
                createdAt: (data.createdAt as Timestamp).toDate(),
            } as Transaction);
        });
        onNext(transactions);
    }, (error) => {
        console.error("Error listening to transactions:", error);
        onError(error);
    });
};
