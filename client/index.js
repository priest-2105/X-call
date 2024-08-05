// Define the API URL for getting the token
const API_URL = 'http://localhost:9000/api/token';

// Function to fetch token from the server
async function getToken(meetingId) {
  try {
    const response = await fetch(`${API_URL}?meetingId=${meetingId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch token');
    }
    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error('Error fetching token:', error);
    return null;
  }
}

// Initialize meeting
async function initializeMeeting() {
  const token = await getToken(meetingId);
  if (!token) {
    alert('Unable to join meeting. Token generation failed.');
    return;
  }

  window.VideoSDK.config(token);

  meeting = window.VideoSDK.initMeeting({
    meetingId: meetingId,
    name: "User", // Change to your display name
    micEnabled: true,
    webcamEnabled: true,
  });

  meeting.join();

  // Creating local participant
  createLocalParticipant();

  meeting.localParticipant.on("stream-enabled", (stream) => {
    setTrack(stream, null, meeting.localParticipant, true);
  });

  meeting.on("meeting-joined", () => {
    textDiv.style.display = "none";
    document.getElementById("grid-screen").style.display = "block";
    document.getElementById("meetingIdHeading").textContent = `Meeting ID: ${meetingId}`;
  });

  meeting.on("meeting-left", () => {
    videoContainer.innerHTML = "";
  });

  meeting.on("participant-joined", (participant) => {
    let videoElement = createVideoElement(participant.id, participant.displayName);
    let audioElement = createAudioElement(participant.id);
    participant.on("stream-enabled", (stream) => {
      setTrack(stream, audioElement, participant, false);
    });
    videoContainer.appendChild(videoElement);
    videoContainer.appendChild(audioElement);
  });

  meeting.on("participant-left", (participant) => {
    let vElement = document.getElementById(`f-${participant.id}`);
    if (vElement) vElement.remove();

    let aElement = document.getElementById(`a-${participant.id}`);
    if (aElement) aElement.remove();
  });
}

// Join Meeting Button Event Listener
joinButton.addEventListener("click", async () => {
  document.getElementById("join-screen").style.display = "none";
  textDiv.textContent = "Joining the meeting...";

  meetingId = document.getElementById("meetingIdTxt").value;
  await initializeMeeting();
});

// Create Meeting Button Event Listener
createButton.addEventListener("click", async () => {
  document.getElementById("join-screen").style.display = "none";
  textDiv.textContent = "Creating meeting...";

  // API call to create meeting
  const url = `https://api.videosdk.live/v2/rooms`;
  const options = {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
  };

  const response = await fetch(url, options);
  if (!response.ok) {
    alert('Failed to create meeting');
    return;
  }

  const { roomId } = await response.json();
  meetingId = roomId;

  await initializeMeeting();
});
