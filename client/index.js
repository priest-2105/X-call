// Getting Elements from DOM
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

// Initialize meeting
function initializeMeeting() {
    window.VideoSDK.config(TOKEN);

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

// Create local participant video
function createLocalParticipant() {
    let localParticipant = createVideoElement(meeting.localParticipant.id, meeting.localParticipant.displayName);
    videoContainer.appendChild(localParticipant);
}

// Create video element
function createVideoElement(pId, name) {
    let videoFrame = document.createElement("div");
    videoFrame.setAttribute("id", `f-${pId}`);

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
        videoElm.play().catch((error) => console.error("videoElem.play() failed", error));
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
    initializeMeeting();
});

// Create Meeting Button Event Listener
createButton.addEventListener("click", async () => {
    document.getElementById("join-screen").style.display = "none";
    textDiv.textContent = "Creating meeting...";

    const url = `https://api.videosdk.live/v2/rooms`;
    const options = {
        method: "POST",
        headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    };

    const response = await fetch(url, options);
    if (!response.ok) {
        alert("Failed to create meeting");
        return;
    }

    const { roomId } = await response.json();
    meetingId = roomId;

    initializeMeeting();
});

// Leave Meeting Button Event Listener
leaveButton.addEventListener("click", async () => {
    meeting?.leave();
    document.getElementById("grid-screen").style.display = "none";
    document.getElementById("join-screen").style.display = "block";
});

// Toggle Mic Button Event Listener
toggleMicButton.addEventListener("click", async () => {
    if (isMicOn) {
        meeting?.muteMic();
    } else {
        meeting?.unmuteMic();
    }
    isMicOn = !isMicOn;
});

// Toggle Webcam Button Event Listener
toggleWebCamButton.addEventListener("click", async () => {
    if (isWebCamOn) {
        meeting?.disableWebcam();
        document.getElementById(`f-${meeting.localParticipant.id}`).style.display = "none";
    } else {
        meeting?.enableWebcam();
        document.getElementById(`f-${meeting.localParticipant.id}`).style.display = "inline";
    }
    isWebCamOn = !isWebCamOn;
});
