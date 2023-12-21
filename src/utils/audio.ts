// 将 AudioBuffer 转换为 WAV 格式
import {callSnackbar} from "./snackbar.ts";
import {AZURE_REGION, AZURE_SPEECH_KEY, BASE_API_URL, LANGUAGE} from "../constants.ts";
import axios from "axios";
import {token} from "../auth.ts";
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";
import {Message} from "./structs.ts";

export function bufferToWave(abuffer, len) {
    const numOfChan = abuffer.numberOfChannels;
    const length = len * numOfChan * 2 + 44;
    const buffer = new ArrayBuffer(length);
    const view = new DataView(buffer);
    const channels = [];
    let i;
    let sample;
    let offset = 0;
    let pos = 0;

    // 写入 WAV 头部信息
    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8); // file length - 8
    setUint32(0x45564157); // "WAVE"

    setUint32(0x20746d66); // "fmt " chunk
    setUint32(16); // length = 16
    setUint16(1); // PCM (uncompressed)
    setUint16(numOfChan);
    setUint32(abuffer.sampleRate);
    setUint32(abuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
    setUint16(numOfChan * 2); // block-align
    setUint16(16); // 16-bit (hardcoded in this demo)

    setUint32(0x61746164); // "data" - chunk
    setUint32(length - pos - 4); // chunk length

    // 写入 PCM 数据
    for (i = 0; i < abuffer.numberOfChannels; i++) {
        channels.push(abuffer.getChannelData(i));
    }

    while (pos < length) {
        for (i = 0; i < numOfChan; i++) { // interleave channels
            sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
            sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0; // scale to 16-bit signed int
            view.setInt16(pos, sample, true); // write 16-bit sample
            pos += 2;
        }
        offset++; // next source sample
    }

    // DataView helper method
    function setUint16(data) {
        view.setUint16(pos, data, true);
        pos += 2;
    }

    function setUint32(data) {
        view.setUint32(pos, data, true);
        pos += 4;
    }

    return buffer;
}

export const speech2text = async (message: Message) => {
    if (typeof message.content !== 'string') {
        return;
    } else callSnackbar('Recognizing speech...', 'green');

    try {
        const response = await axios.get(BASE_API_URL + 'files/' + message.content + '/', {
            responseType: 'blob',
            headers: {
                Authorization: token.value,
            }
        });
        const blob = response.data;

        // 检查音频格式
        if (blob.type === 'audio/webm') {
            // 转换为 WAV 格式
            const audioBuffer = await new AudioContext().decodeAudioData(await blob.arrayBuffer());
            const wavBuffer = bufferToWave(audioBuffer, audioBuffer.length);
            const wavBlob = new Blob([wavBuffer], { type: 'audio/wav' });
            processAudio(new File([wavBlob], 'audio.wav'), message);
        } else {
            processAudio(new File([blob], 'audio.wav'), message);
        }
    } catch (err) {
        callSnackbar(err.response?.data.message || err.message, 'error');
    }
};

// 使用 Microsoft Azure Speech SDK 进行语音识别
// 储存所有的识别结果，与message.id对应
export const recognizedText = new Map<number, string>();
const processAudio = (file: File, message: Message) => {
    const audioConfig = SpeechSDK.AudioConfig.fromWavFileInput(file);
    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(AZURE_SPEECH_KEY, AZURE_REGION);
    speechConfig.speechRecognitionLanguage = LANGUAGE;
    const recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

    recognizer.recognizeOnceAsync(result => {
        callSnackbar(result.text, 'green', true);
        recognizedText.set(message.message_id as number, result.text);
    });
};