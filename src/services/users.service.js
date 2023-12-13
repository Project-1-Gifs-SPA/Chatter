import { equalTo, get, onValue, orderByChild, query, ref, set, update } from 'firebase/database';
import { toast } from 'react-toastify';
import { db } from '../config/firebase-config';

export const getUserByHandle = (handle) => get(ref(db, `users/${handle}`));

export const createUserHandle = (handle, uid, email, firstName, lastName, phoneNumber, availability) =>
  set(ref(db, `users/${handle}`), { handle, uid, email, createdOn: Date.now(), firstName, lastName, phoneNumber, availability, });

export const getUserData = (uid) => get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));

export const writeUserData = (handle, firstName, lastName, phoneNumber) =>
  update(ref(db, `users/${handle}`), {
    firstName: firstName,
    lastName: lastName,
    phoneNumber: phoneNumber
  });

export const updateUserPhoto = (handle, photoURL) => {
  const changePicture = {};
  changePicture[`/users/${handle}/photoURL`] = photoURL;

  return update(ref(db), changePicture);
}

export const changeUserStatus = (handle, status) =>
  update(ref(db, `users/${handle}`),
    {
      availability: status
    });

export const getLiveUserInfo = (listener, handle) =>
  onValue(
    ref(db, `users/${handle}`),
    snapshot => {
      const data = snapshot.exists() ? snapshot.val() : {};

      listener(data);
    });

const fromUsersDocument = (snapshot) => {
  const usersDocument = snapshot.val();

  return Object.keys(usersDocument).map(key => {
    const user = usersDocument[key];

    return {
      ...user,
      createdOn: new Date(user.createdOn),
    }
  });
};

export const getAllUsers = () =>
  get(ref(db, 'users'))
    .then(snapshot => snapshot.exists() ? fromUsersDocument(snapshot) : [])
    .catch(e => console.error(e));

export const getUsersBySearchTerm = (users, searchParam, searchTerm) =>
  searchTerm === ''
    ? []
    : users.filter((user) => typeof user[searchParam] === 'string'
      ? user[searchParam].toLowerCase().includes(searchTerm)
      : false
    );

export const addFriends = (handle, friendHandle) => {
  const updateFriends = {};
  updateFriends[`/users/${handle}/friends/${friendHandle}`] = true;
  updateFriends[`users/${friendHandle}/friends/${handle}`] = true;
  updateFriends[`users/${handle}/friendRequests/${friendHandle}`] = null;
  updateFriends[`users/${friendHandle}/friendRequests/${handle}`] = null;

  return update(ref(db), updateFriends)
    .then(() => toast.success("Friend request was accepted", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    }))
    .catch(e => console.error(e));
};

export const removeFriends = (handle, friendHandle) => {
  const updateFriends = {};
  updateFriends[`/users/${handle}/friends/${friendHandle}`] = null;
  updateFriends[`/users/${friendHandle}/friends/${handle}`] = null;

  return update(ref(db), updateFriends)
    .then(() => toast.success("Successfully removed from friends", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    }))
    .catch(e => console.error(e));
};

export const sendFriendRequest = (senderHandle, receiverHandle) => {
  const receiverFriendRequestsRef = ref(db, `/users/${receiverHandle}/friendRequests/${senderHandle}`);

  return get(receiverFriendRequestsRef)
    .then((friendRequestSnapshot) => {
      if (friendRequestSnapshot.exists()) {
        toast.error("Friend request already sent to this user", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        return Promise.reject("Friend request already sent to this user");
      } else {
        const sendRequest = {};
        sendRequest[`/users/${receiverHandle}/friendRequests/${senderHandle}`] = true;

        return update(ref(db), sendRequest)
          .then(() => {
            toast.success("Friend request sent successfully", {
              position: "top-center",
              autoClose: 1000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
          })
          .catch((e) => Promise.reject(e));
      }
    })
    .catch((e) => {
      console.error('Error sending friend request:', e.message);
      return Promise.reject("Error sending friend request");
    })
};

export const declineFriendRequest = (handle, friendHandle) => {
  const updateFriendsRequest = {};
  updateFriendsRequest[`/users/${handle}/friendRequests/${friendHandle}`] = null;

  return update(ref(db), updateFriendsRequest)
    .then(() => toast.success("Friend request was declined", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    }))
    .catch(e => console.error(e));
};

export const getLiveUserFriends = (listener, handle) =>
  onValue(
    ref(db, `users/${handle}/friends`),
    snapshot => {
      const data = snapshot.exists() ? snapshot.val() : {};

      listener(data);
    });

export const getLiveAllUsers = (listenFn) =>
  onValue(
    ref(db, 'users'),
    snapshot => {
      const data = snapshot.exists() ? snapshot.val() : {};
      const result = Object.values(data);

      listenFn(result);
    }
  );
