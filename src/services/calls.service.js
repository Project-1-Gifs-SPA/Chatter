import { DYTE_AUTH_KEY, DYTE_BASE_URL } from "../config/dyte-config";
import { addMeetingRoomId } from "./meetings.service";

export const createDyteCallRoom = (meetingId, title) => {

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${DYTE_AUTH_KEY}`
    },
    body: `{"title":"${title}","preferred_region":"ap-south-1","record_on_start":false,"live_stream_on_start":false,"recording_config":{"max_seconds":60,"file_name_prefix":"string","video_config":{"codec":"H264","width":1280,"height":720,"watermark":{"url":"http://example.com","size":{"width":1,"height":1},"position":"left top"}},"audio_config":{"codec":"AAC","channel":"stereo"},"storage_config":{"type":"aws","access_key":"string","secret":"string","bucket":"string","region":"us-east-1","path":"string","auth_method":"KEY","username":"string","password":"string","host":"string","port":0,"private_key":"string"},"dyte_bucket_config":{"enabled":true},"live_streaming_config":{"rtmp_url":"rtmp://a.rtmp.youtube.com/live2"}}}`
  };

  fetch(`${DYTE_BASE_URL}/meetings`, options)
    .then(response => response.json())
    .then(response => addMeetingRoomId(meetingId, response.data.id))
    .catch(e => console.error(e));
};

export const addMemberToCall = (listenFn, roomId, userData) => {

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${DYTE_AUTH_KEY}`
    },
    body:
      `{
        "name":"${userData.handle}",
        "picture":"${userData.photoURL}",
        "preset_name":"group_call_host",
        "custom_participant_id":"${userData.uid}"
        }`
  };

  fetch(`${DYTE_BASE_URL}/meetings/${roomId}/participants`, options)
    .then(response => response.json())
    .then(response => listenFn(response.data.token))
    .catch(e => console.error(e));
};

export const removeMemberFromCall = (roomId, participantId) => {

  const options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${DYTE_AUTH_KEY}`
    }
  };

  fetch(`${DYTE_BASE_URL}/meetings/${roomId}/participants/${participantId}`, options)
    .then(response => response.json())
    .catch(e => console.error(e));
};

export const getCallRecordingDownloadURL = (listenFn, callId) => {

  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${DYTE_AUTH_KEY}`
    }
  };

  fetch(`${DYTE_BASE_URL}/recordings/?meeting_id=${callId}`, options)
    .then(response => response.json())
    .then(response => {
      const callData = Object.values(response.data)[0];
      const downloadURL = callData.download_url;

      listenFn(downloadURL);
    })
    .catch(e => console.error(e));
};
