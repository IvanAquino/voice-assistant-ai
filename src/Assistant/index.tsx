import { MicrophoneIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { useEffect, useMemo, useState } from 'react';
import { CompletionApi } from '../OpenAI';
import { Card } from '../Shared/components';
import { English, SupportedLanguages } from '../Shared/Data';
import useSpeechRecognition from './hooks/useSpeechRecognition';

export default function() {
    const { transcript, listening, startListening, cancelListening } = useSpeechRecognition();
    const [languaje, setLanguaje] = useState<string>(English);
    const [openAIKey, setOpenAIKey] = useState<string>('');
    const [resultCompletion, setResultCompletion] = useState<string>('');
    const [workingOnCompletion, setWorkingOnCompletion] = useState<boolean>(false);

    const completeTranscript = () => {
      if (!transcript) return;

      setWorkingOnCompletion(true);
      CompletionApi.getCompletion(openAIKey, transcript, languaje)
        .then((response) => {
          setWorkingOnCompletion(false);
          setResultCompletion(response.choices[0].text.trim());
        })
        .catch((error) => {
          setWorkingOnCompletion(false);
          console.log(error);
        });
    }

    useEffect(() => {
      const timer = setTimeout(() => {
        if (transcript && !listening && !openAIKey) {
          alert('Please enter your OpenAI key');
        }
        if (transcript && !listening && openAIKey) {
          completeTranscript();
        }
      }, 1000);

      return () => clearTimeout(timer);
    }, [transcript, listening]);

    return (
        <div className='grid grid-cols-2 gap-4 pl-2 pr-2 pt-4'>
          <Card>
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-center">
              Your AI assistant
            </h5>

            <input
              type="password"
              className="w-full px-4 py-2 mt-4 text-gray-700 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:shadow-outline"
              placeholder="OpenAI key"
              value={openAIKey}
              onChange={(e) => setOpenAIKey(e.target.value)}
            />
            <p><small>
              You have to create an account in <a href="https://openai.com/api/" target="_blank" rel="noreferrer">OpenAI</a> and get your key.
            </small></p>

            <select
              className="w-full px-4 py-2 mt-4 text-gray-700 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:shadow-outline"
              value={languaje}
              onChange={(e) => setLanguaje(e.target.value)}
            >
              {SupportedLanguages.map((language) => (
                <option key={language.code} value={language.code}>
                  {language.name}
                </option>
              ))}
            </select>

            <textarea
              className="w-full px-4 py-2 mt-4 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:shadow-outline"
              value={transcript}
              disabled
              readOnly
              rows={5}
              placeholder="Speak to your assistant"
            ></textarea>

            <div className="mt-4 text-center">
              <button
                type="button"
                className={
                  `font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 ${listening ? 'microphone-button-active': 'microphone-button'}`
                }
                onClick={() => {
                  startListening();
                }}
              >
                <MicrophoneIcon className='w-10 h-10'/>
              </button>
                <button
                  onClick={cancelListening}
                 className="bg-red-500 shadow-lg shadow-red-500/90  font-medium rounded-lg py-2.5 text-center px-5 mr-2 mb-2 text-white"
                >
                  <XMarkIcon className='w-10 h-10'/>
                </button>
            </div>

            <div className='text-gray-500 text-sm mt-4'>
              INSTRUCTIONS <br />
              Put your OpenAI key in the corresponding text field. <br />
              Click on the microphone button and start speaking. <br />
              When you finish, click on the microphone button again to stop listening. <br />
              Your assistant will appear in the text area at right side. <br /><br />

              Click on the X button to clear the text area and cancel listening.
            </div>
          </Card>
          <Card>
            <textarea
              value={
                workingOnCompletion ? 'Working on it...' : resultCompletion
              }
              onChange={(e) => e.preventDefault()}
              className={
                `h-full w-full px-4 py-2 mt-4 text-gray-700 bg-gray-100 rounded-lg border ${workingOnCompletion ? ' border-orange-500' : ' border-red-300'}}`
              }
              placeholder='Your assistant will appear here'
            ></textarea>
          </Card>
        </div>
    )
}