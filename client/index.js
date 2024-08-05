document.addEventListener('DOMContentLoaded', () => {
    const createMeetingButton = document.getElementById('create-meeting');
    const joinMeetingButton = document.getElementById('join-meeting');
    const meetingArea = document.getElementById('meeting-area');
  
    // Create meeting
    createMeetingButton.addEventListener('click', () => {
      fetch('http://localhost:9000/get-token')
        .then(response => response.json())
        .then(data => {
          const token = data.token;
          return fetch('http://localhost:9000/create-meeting/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, region: 'US' }) // Adjust region as needed
          });
        })
        .then(response => {
          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }
          return response.json();
        })
        .then(meetingData => {
          console.log('Meeting Created:', meetingData);
          // Store or display the meeting ID
        })
        .catch(error => console.error('Error creating meeting:', error));
    });
  
    // Join meeting
    joinMeetingButton.addEventListener('click', () => {
      // Prompt user for meeting ID and token
      const meetingId = prompt('Enter Meeting ID:');
      const token = prompt('Enter Token:');
  
      if (meetingId && token) {
        startMeeting(meetingId, token);
      }
    });
  });
  





//   Event Listener 

  document.addEventListener('DOMContentLoaded', () => {
    const createMeetingButton = document.getElementById('create-meeting');
    const joinMeetingButton = document.getElementById('join-meeting');
    const meetingArea = document.getElementById('meeting-area');
  
    // Function to start a meeting
    const startMeeting = (meetingId) => {
      const client = VideoSDK.createClient();
      client.on('stream-added', (event) => {
        const { stream } = event;
        client.subscribe(stream, { audio: true, video: true });
      });
  
      client.on('stream-subscribed', (event) => {
        const { stream } = event;
        const videoElement = document.createElement('video');
        videoElement.srcObject = stream;
        videoElement.autoplay = true;
        meetingArea.appendChild(videoElement);
      });
  
      client.on('stream-removed', (event) => {
        const { stream } = event;
        const videoElement = document.querySelector(`video[srcObject="${stream}"]`);
        if (videoElement) {
          videoElement.remove();
        }
      });
  
      client.join(meetingId)
        .then(() => {
          console.log('Joined Meeting');
          // Optionally, you can now publish your own video and audio stream
        })
        .catch(error => console.error('Error joining meeting:', error));
    };
  
    // Create meeting
    createMeetingButton.addEventListener('click', () => {
      fetch('http://localhost:9000/get-token')
        .then(response => response.json())
        .then(data => {
          const token = data.token;
          return fetch('http://localhost:9000/create-meeting/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, region: 'US' }) // Adjust region as needed
          });
        })
        .then(response => response.json())
        .then(meetingData => {
          console.log('Meeting Created:', meetingData);
          // Store or display the meeting ID
        })
        .catch(error => console.error('Error creating meeting:', error));
    });
  
    // Join meeting
    joinMeetingButton.addEventListener('click', () => {
      // Prompt user for meeting ID and token
      const meetingId = prompt('Enter Meeting ID:');
      const token = prompt('Enter Token:');
  
      if (meetingId && token) {
        startMeeting(meetingId, token);
      }
    });
  });
  