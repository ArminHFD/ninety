import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { load, save } from "./storage";

export async function backupToCloud() {
  const user = auth.currentUser;
  if (!user) return;

  const data = {
    habits: load("ninety.habits", []),
    plannerItems: load("ninety.planner.items", []),
    startDate: load("ninety.startDate", null),
    lastSynced: new Date().toISOString(),
  };

  await setDoc(doc(db, "users", user.uid), data, { merge: true });
}

export async function restoreFromCloud() {
  const user = auth.currentUser;
  if (!user) return;

  const snapshot = await getDoc(doc(db, "users", user.uid));
  if (!snapshot.exists()) return;

  const data = snapshot.data();

  if (data.habits) {
    save("ninety.habits", data.habits);
  }

  if (data.plannerItems) {
    save("ninety.planner.items", data.plannerItems);
  }

  if (data.startDate) {
    save("ninety.startDate", data.startDate);
  }
}