import { DyteMeeting } from "@dytesdk/react-ui-kit";
import { useDyteMeeting } from "@dytesdk/react-web-core";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";

const MyMeeting = () => {

  const { meetingId } = useParams();

  const { meeting } = useDyteMeeting();

  const navigate = useNavigate();

  useEffect(() => {
    meeting.self.on('roomLeft', () => {
      navigate(`/meetings/${meetingId}`)
    });
  }, [meeting]);

  return (
    <div style={{ height: '50vh', width: 'auto' }}>
      <DyteMeeting
        mode='fill'
        meeting={meeting}
        showSetupScreen={false}
        className="bg-gray-700"
      />
    </div>
  );
};

export default MyMeeting;
