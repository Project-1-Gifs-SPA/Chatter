import { get, set, ref, query, equalTo, orderByChild, update, onValue } from 'firebase/database';
import { db } from '../config/firebase-config';
import { toast } from 'react-toastify';


export const getUserByHandle = (handle) => {

  return get(ref(db, `users/${handle}`));
};

export const createUserHandle = (handle, uid, email, firstName, lastName, phoneNumber, availability) => {

  return set(ref(db, `users/${handle}`), { handle, uid, email, createdOn: Date.now(), firstName, lastName, phoneNumber, availability, })
};

export const getUserData = (uid) => {

  return get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
};

export const writeUserData = (handle, firstName, lastName, phoneNumber) => {

  update(ref(db, `users/${handle}`), {
    firstName: firstName,
    lastName: lastName,
    phoneNumber: phoneNumber
  })
  .catch(error => console.error(error))
}

export const updateUserPhoto = (handle, photoURL) => {
  const changePicture = {};
  changePicture[`/users/${handle}/photoURL`] = photoURL;

  return update(ref(db), changePicture);
}

export const changeUserStatus = (handle, status) => {

  update(ref(db, `users/${handle}`), {
    availability: status
  })
  .catch(error => console.error(error))
}

export const getLiveUserInfo = (listener, handle) => {
  return onValue(
    ref(db, `users/${handle}`),
    snapshot => {
      const data = snapshot.exists() ? snapshot.val() : {};

      listener(data);
    });
};

const fromUsersDocument = snapshot => {
  const usersDocument = snapshot.val();

  return Object.keys(usersDocument).map(key=>{
    const user = usersDocument[key];

    return {
      ...user,
      uid:key,
      createdOn: new Date(user.createdOn),
      likedPosts: user.likedPosts ? Object.keys(user.likedPosts) : []
    }
  })
}

export const getAllUsers = () => {

  return get(ref(db,'users'))
  .then(snapshot=>{
    if(!snapshot.exists()){
      return [];
    }

    return fromUsersDocument(snapshot);
  })
};

export const getUsersBySearchTerm = (users, searchParam, searchTerm) => {

  console.log(users);

  return searchTerm === ''
    ? []
    : users.filter((user) => typeof user[searchParam] === 'string'
        ? user[searchParam].toLowerCase().includes(searchTerm)
        : false
    );
};

export const addFriends = (handle, friendHandle) => {
  const updateFriends = {};
  updateFriends[`/users/${handle}/friends/${friendHandle}`] = true;
  updateFriends[`users/${friendHandle}/friends/${handle}`] = true;
  updateFriends[`users/${handle}/friendRequests/${friendHandle}`] = null;

  return update(ref(db), updateFriends)
  .then(() => toast.success("Friend request was accepted", {
    position: "top-center",
    autoClose: 3500,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  }));
};

export const removeFriends = (handle, friendHandle) => {
  const updateFriends = {};
  updateFriends[`/users/${handle}/friends/${friendHandle}`] = null;
  updateFriends[`/users/${friendHandle}/friends/${handle}`] = null;

  return update(ref(db), updateFriends)
  .then(() => toast.success("Successfully removed from friends", {
    position: "top-center",
    autoClose: 3500,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  }));
}

export const sendFriendRequest = (senderHandle, receiverHandle) => {
  const receiverFriendRequestsRef = ref(db, `/users/${receiverHandle}/friendRequests/${senderHandle}`);

  return get(receiverFriendRequestsRef)
  .then((friendRequestSnapshot) => {
    if (friendRequestSnapshot.exists()) {
      // If the friend request already exists, display error toast
      toast.error("Friend request already sent to this user", {
        position: "top-center",
        autoClose: 3500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return Promise.reject("Friend request already sent to this user");
      } else {
        // If the friend request doesn't exist, proceed to send the request
        const sendRequest = {};
        sendRequest[`/users/${receiverHandle}/friendRequests/${senderHandle}`] = true;

        return update(ref(db), sendRequest)
          .then(() => {
            // Display success toast for sending friend request
            toast.success("Friend request sent successfully", {
              position: "top-center",
              autoClose: 3500,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
          })
          .catch((error) => Promise.reject(error));
      }
    })
    .catch((error) => {
      console.error('Error sending friend request:', error);
      return Promise.reject("Error sending friend request");
    });
};
export const declineFriendRequest = (handle, friendHandle) => {
    const updateFriendsRequest = {};
    updateFriendsRequest[`/users/${handle}/friendRequests/${friendHandle}`] = null;

    return update(ref(db), updateFriendsRequest)
    .then(() => toast.success("Friend request was declined", {
      position: "top-center",
      autoClose: 3500,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    }));
}

export const getLiveUserFriends = (listener, handle) => {
  return onValue(
    ref(db, `users/${handle}/friends`),
    snapshot => {
      const data = snapshot.exists() ? snapshot.val() : {};

      listener(data);
    });
};