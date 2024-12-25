import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from './firebase';

const storage = getStorage(app);

// Function to upload image
export async function uploadImage(userId: string, imageFile: File): Promise<string> {
  const storageRef = ref(storage, `profile-images/${userId}`);
  await uploadBytes(storageRef, imageFile);
  return getDownloadURL(storageRef);
}

// Function to get image URL
export async function getImageUrl(userId: string): Promise<string | null> {
  try {
    const storageRef = ref(storage, `profile-images/${userId}`);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error('Error getting image URL:', error);
    return null;
  }
} 