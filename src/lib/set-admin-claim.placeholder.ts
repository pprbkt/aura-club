
/**
 * ==========================================================================================
 * IMPORTANT: This is a placeholder file and is NOT part of your web application's client-side code.
 * ==========================================================================================
 *
 * Overview:
 * This file contains the code for a Firebase Cloud Function that is ESSENTIAL for your
 * application's admin functionality to work correctly. Firestore Security Rules now check
 * for a custom claim (`request.auth.token.admin === true`) to grant administrative privileges.
 * This is more secure and efficient than reading a document from within security rules.
 *
 * This function listens for changes to documents in the 'users' collection. When a user's
 * 'role' field is set to 'admin', it sets a corresponding custom claim on their Firebase
 * Authentication token. It also handles removing the claim if they are demoted.
 *
 * ---
 *
 * HOW TO DEPLOY THIS FUNCTION:
 *
 * 1.  **Set up a Cloud Functions environment:**
 *     - If you don't have one, create a new directory outside of your Next.js app (e.g., "functions").
 *     - `cd functions`
 *     - Run `firebase init functions`.
 *     - Choose TypeScript for the language.
 *     - When asked to install dependencies, say yes.
 *
 * 2.  **Add Admin SDK dependency:**
 *     - In the 'functions' directory, run: `npm install firebase-admin`
 *
 * 3.  **Add the code:**
 *     - Replace the contents of `functions/src/index.ts` with the code below.
 *
 * 4.  **Deploy the function:**
 *     - From the 'functions' directory, run: `firebase deploy --only functions`
 *
 * ---
 *
 * After deployment, this function will automatically manage admin claims.
 * To make a user an admin, simply change their 'role' to 'admin' in your
 * Firestore 'users' collection using the admin dashboard you already have.
 * The user will get their admin privileges on their next sign-in or after their
 * current ID token expires (approx. 1 hour).
 */

/*
// --- Start of code for functions/src/index.ts ---

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

// Cloud Function that sets custom claims when a user's role is updated in Firestore.
export const onUserRoleChange = functions.firestore
  .document("users/{email}")
  .onWrite(async (change, context) => {
    const email = context.params.email;
    const afterData = change.after.data();
    const beforeData = change.before.data();

    // Exit if the role hasn't changed
    if (beforeData?.role === afterData?.role) {
      console.log(`Role for ${email} unchanged. Exiting.`);
      return null;
    }

    try {
      const user = await admin.auth().getUserByEmail(email);
      const newRole = afterData?.role;

      const newClaims = {
        admin: newRole === "admin",
      };

      console.log(`Setting custom claims for ${email}:`, newClaims);
      await admin.auth().setCustomUserClaims(user.uid, newClaims);

      return null;
    } catch (error) {
      console.error(`Error setting custom claims for ${email}:`, error);
      return null;
    }
  });

// --- End of code for functions/src/index.ts ---
*/
