// Define the API URL for getting the token
const API_URL = 'http://localhost:9000/get-token';

// Define elements from DOM
const joinButton = document.getElementById("joinBtn");
const leaveButton = document.getElementById("leaveBtn");
const toggleMicButton = document.getElementById("toggleMicBtn");
const toggleWebCamButton = document.getElementById("toggleWebCamBtn");
const createButton = document.getElementById("createMeetingBtn");
const videoContainer = document.getElementById("videoContainer");
const textDiv = document.getElementById("textDiv");

// Declare Variables
let meeting = null;
let meetingId = "";
let isMicOn = false;
let isWebCamOn = false;

// Function to fetch token from the server
async function getToken() {
  try {
    const response = await fetch(API_URL);
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
  const token = await getToken();
  if (!token) {
    alert('Unable to join meeting. Token generation failed.');
    return;
  }

  window.VideoSDK.config(token);

  meeting = window.VideoSDK.initMeeting({
    meetingId: meetingId,
    name: "User", // Adjust as necessary
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
    document.getElementById(`f-${participant.id}`)?.remove();
    document.getElementById(`a-${participant.id}`)?.remove();
  });
}

// Create local participant
function createLocalParticipant() {
  let localParticipant = createVideoElement(
    meeting.localParticipant.id,
    meeting.localParticipant.displayName
  );
  videoContainer.appendChild(localParticipant);
}

// Create video element
function createVideoElement(pId, name) {
  let videoFrame = document.createElement("div");
  videoFrame.setAttribute("id", `f-${pId}`);

  // Create video
  let videoElement = document.createElement("video");
  videoElement.classList.add("video-frame");
  videoElement.setAttribute("id", `v-${pId}`);
  videoElement.setAttribute("playsinline", true);
  videoElement.setAttribute("width", "300");
  videoFrame.appendChild(videoElement);

  let displayName = document.createElement("div");
  displayName.innerHTML = `Name: ${name}`;
  videoFrame.appendChild(displayName);

  return videoFrame;
}

// Create audio element
function createAudioElement(pId) {
  let audioElement = document.createElement("audio");
  audioElement.setAttribute("autoPlay", "false");
  audioElement.setAttribute("playsInline", "true");
  audioElement.setAttribute("controls", "false");
  audioElement.setAttribute("id", `a-${pId}`);
  audioElement.style.display = "none";
  return audioElement;
}

// Set media track
function setTrack(stream, audioElement, participant, isLocal) {
  if (stream.kind === "video") {
    isWebCamOn = true;
    const mediaStream = new MediaStream();
    mediaStream.addTrack(stream.track);
    let videoElm = document.getElementById(`v-${participant.id}`);
    videoElm.srcObject = mediaStream;
    videoElm.play().catch((error) => console.error("videoElem.current.play() failed", error));
  }
  if (stream.kind === "audio") {
    if (isLocal) {
      isMicOn = true;
    } else {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(stream.track);
      audioElement.srcObject = mediaStream;
      audioElement.play().catch((error) => console.error("audioElem.play() failed", error));
    }
  }
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

  try {
    const token = await getToken(); // Get token before making the API call

    if (!token) {
      throw new Error('Token not obtained');
    }

    const url = `http://localhost:9000/create-meeting/`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ region: "us" }) // Adjust the region as needed
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const { roomId } = await response.json();
    meetingId = roomId;

    await initializeMeeting();
  } catch (error) {
    console.error("Error creating meeting:", error);
    alert("Error creating meeting: " + error.message);
  }
});

// Leave Meeting Button Event Listener
leaveButton.addEventListener("click", async () => {
  meeting?.le
// Toggle Mic Button Event Listener
toggleMicButton.addEventListener("click", async () => {
  if (isMicOn) {
    meeting?.muteMic();
  } else {
    meeting?.unmuteMic();
  }
  isMicOn = !isMicOn;
});

// Toggle Web Cam Button Event Listener
toggleWebCamButton.addEventListener("click", async () => {
  if (isWebCamOn) {
    meeting?.disableWebcam();
    let vElement = document.getElementById(`f-${meeting.localParticipant.id}`);
    if (vElement) vElement.style.display = "none";
  } else {
    meeting?.enableWebcam();
    let vElement = document.getElementById(`f-${meeting.localParticipant.id}`);
    if (vElement) vElement.style.display = "inline";
  }
  isWebCamOn = !isWebCamOn;
});
