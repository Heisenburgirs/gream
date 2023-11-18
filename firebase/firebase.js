import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDoc, getDocs, updateDoc, setDoc, addDoc, doc, query, where, } from 'firebase/firestore/lite';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get a list of users from your database
export async function getUser() {
  const usersCol = collection(db, 'gstream');
  const userSnapshot = await getDocs(usersCol);
  const userList = userSnapshot.docs.map((doc) => doc.data());
  return userList;
}

// Add/update user to/in database
export async function writeData(name, walletAddress, profileImage) {
  try {
    const usersCol = collection(db, 'gstream');
    const userDocRef = doc(usersCol, name); // Use the name as the document ID

    await setDoc(userDocRef, {
      twitterHandle: name,
      userWalletAddress: walletAddress,
      profileImage: profileImage, // Update the variable name to profileImage
    });
  } catch (error) {
    console.error('Error pushing user data', error);
  }
}

// Find address from @handle
export async function getUserWalletAddress(recipient) {
  try {
    const usersCol = collection(db, 'gstream');
    const q = query(usersCol, where('twitterHandle', '==', recipient));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) { // Check if the querySnapshot is empty
      const docData = querySnapshot.docs[0].data();
      return docData.userWalletAddress;
    }
    return null; // If no match found, return null
  } catch (error) {
    console.error('Error getting user wallet address', error);
    return null;
  }
}

export async function getTwitterHandleByAddress(address) {
  try {
    const usersCol = collection(db, 'gstream');
    const q = query(usersCol, where('userWalletAddress', '==', address));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // If a match is found, return the Twitter handle (document ID) of the first match
      const twitterHandle = querySnapshot.docs[0].id;
      return twitterHandle;
    }
    return null; // If no match found, return null
  } catch (error) {
    console.error('Error getting Twitter handle by address:', error);
    return null;
  }
}