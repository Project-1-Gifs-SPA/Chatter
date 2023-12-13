import { updateProfile } from 'firebase/auth';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { addRecordingToMeeting } from './meetings.service';
import { updateTeamPhoto } from './teams.service';
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
    .then((photoURL) => updateUserPhoto(user.displayName, photoURL))
    .then(() => {
      setLoading(false);
      // alert('Uploaded file!');
    })
    .catch(e => console.error('Error uploading file:', e.message));
}

export const setDefaultPic = (user, picURL, setLoading) => {
  const defaultPicRef = ref(storage, picURL)
  setLoading(true);
  getDownloadURL(defaultPicRef)
    .then((photoURL) => {
      updateProfile(user, { photoURL });
      return photoURL;

    })
    .then((photoURL) => updateUserPhoto(user.displayName, photoURL))
    .then(() => {
      setLoading(false);
    })
    .catch(e => console.error('Error uploading file:', e.message));
}

//setTeamDefaultPic
export const uploadTeamPhoto = (file, teamId, setLoading) => {

  const fileRef = ref(storage, teamId + '.png');

  setLoading(true);

  return uploadBytes(fileRef, file)
    .then(() => getDownloadURL(fileRef))
    .then((photoURL) => updateTeamPhoto(teamId, photoURL))
    .then(() => {
      setLoading(false);
      // alert('Uploaded file!');
    })
    .catch(e => console.error('Error uploading file:', e.message));
}

export const uploadMessagePhoto = (listenFn, file) => {
  const fileRef = ref(storage, file.name);

  return uploadBytes(fileRef, file)
    .then(() => getDownloadURL(fileRef))
    .then((photoURL) => listenFn(photoURL))
    .catch(e => console.error('Error uploading file:', e.message));
}

export const uploadCallRecording = (file, meetingId) => {
  const fileRef = ref(storage, meetingId + '.mp4');

  return uploadBytes(fileRef, file)
    .then(() => getDownloadURL(fileRef))
    .then((recordingURL) => addRecordingToMeeting(meetingId, recordingURL))
    .catch(e => console.error('Error upload file:', e.message));
}
