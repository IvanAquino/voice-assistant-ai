import { useMemo, useState } from "react";

declare var window: any;

if (!('webkitSpeechRecognition' in window)) {
  alert('Your browser does not support speech recognition. Please use Chrome, Firefox or Safari.');
}

const useSpeechRecognition = () => {
  const recognition = useMemo(() => new window.webkitSpeechRecognition(), []);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const startListening = () => {
    if (listening) {
      stopListening();
      return;
    }
    setTranscript('');
    recognition.start();
    setListening(true);
  };

  const stopListening = () => {
    recognition.stop();
    setListening(false);
  }

  const cancelListening = () => {
    recognition.stop();
    setTranscript('');
    setListening(false);
  };

  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';
  recognition.onresult = (event: any) => {
    let interimTranscript = '';
    let finalTranscript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      let transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript + ' ';
      } else {
        interimTranscript += transcript;
      }
    }

    setTranscript(
        `${transcript} ${finalTranscript}`.trim()
    );
  }
  recognition.onend = () => {
  }

  return { transcript, listening, startListening, cancelListening };
}

export default useSpeechRecognition;