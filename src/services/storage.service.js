import { updateProfile } from 'firebase/auth';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { updateUserPhoto } from './users.service';

export const storage = getStorage();

export const upload = (file, user, setLoading) => {

  const fileRef = ref(storage, user.uid + '.png');

  setLoading(true);

  return uploadBytes(fileRef, file)
    .then(() => getDownloadURL(fileRef))
    .then((photoURL) => {
     updateProfile(user, { photoURL });
     return photoURL;
    })
    .then((photoURL)=> updateUserPhoto(user.displayName, photoURL))
    .then(() => {
      setLoading(false);
      // alert('Uploaded file!');
    })
    .catch((error) => {
      console.error('Error uploading file:', error);
    });
}

export const setDefaultPic = (user, picURL,setLoading) => {
  const defaultPicRef =ref(storage, picURL)
  setLoading(true);
  getDownloadURL(defaultPicRef)
  .then((photoURL) => {
    updateProfile(user, { photoURL });
    return photoURL;
  
  })
  .then((photoURL)=> updateUserPhoto(user.displayName, photoURL))
  .then(() => {
    setLoading(false);
  })
  .catch((error) => {
    console.error('Error uploading file:', error);
  });
}