export const MIN_NAME_LENGTH = 4;
export const MIN_PASSWORD_LENGTH = 6;

export const MIN_USERNAME_LENGTH = 5;

export const MAX_USERNAME_LENGTH = 35;
export const PHONE_LENGTH = 10;

export const defaultPicURL = 'gs://chatter-app-52b85.appspot.com/Png.png'
export const groupDefaultPicURL = 'gs://chatter-app-52b85.appspot.com/groupDefault.png'

export const statuses = { 
	online: 'online',
	offline: 'offline',
	doNotDisturb: 'doNotDisturb'
}

export const isValidPhoneNumber = (phoneNumber) =>{
	const regex = /^\d{10}$/
	return regex.test(phoneNumber);
}

export const MIN_TEAMNAME_LENGTH = 3;

export const MAX_TEAMNAME_LENGTH = 40;

export const MIN_CHANNELNAME_LENGTH = 3;

export const MAX_CHANNELNAMELENGTH = 40;