import { collection, onSnapshot, Unsubscribe, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { UserProfile } from "@/types/user";
import type { Timestamp } from "firebase/firestore";

export const onUsersUpdate = (
    onNext: (users: UserProfile[]) => void,
    onError: (error: Error) => void
): Unsubscribe => {
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (querySnapshot) => {
        const users: UserProfile[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            users.push({
                ...data,
                uid: doc.id,
                createdAt: (data.createdAt as Timestamp).toDate(),
            } as UserProfile);
        });
        onNext(users);
    }, (error) => {
        console.error("Error listening to users:", error);
        onError(error);
    });
};
