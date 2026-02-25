import * as admin from "firebase-admin";
import serviceAccount from "./serviceAccountKey.json";

console.log("Service account project_id:", serviceAccount.project_id); 

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

export const db = admin.firestore();
export const auth = admin.auth();