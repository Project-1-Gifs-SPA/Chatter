export const MIN_NAME_LENGTH = 4;
export const MIN_PASSWORD_LENGTH = 6;

export const MIN_USERNAME_LENGTH = 5;

export const MAX_USERNAME_LENGTH = 35;

export const PHONE_LENGTH = 10;

export const MIN_CHANNEL_LENGTH = 3;

export const MAX_CHANNEL_LENGTH = 40;

export const MIN_TEAMNAME_LENGTH = 3;

export const MAX_TEAMNAME_LENGTH = 40;

export const MIN_MESSAGE_LENGTH = 1;
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

export const MIN_CHANNELNAME_LENGTH = 3;

export const MAX_CHANNELNAMELENGTH = 40; // remove

export const reactions = {
	Like: '👍',
    Love: '❤️',
    Haha: '😄',
    Wow: '😮',
    Sad:'🙁',
    Angry: '😠'
}

//+1 when clicked

export const OPENAI_API_KEY = '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';
export const GIPHY_API_KEY = "5HHbQrWtBlmLdQdHMd0ZeRjx3baS9v1b";

export const GIPHY_BASE_URL = 'http://api.giphy.com/v1/gifs/';
