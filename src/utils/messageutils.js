const MAX_LEN = 30;
export const ProcessMessage = (sentence) => {
    if (sentence.length <= MAX_LEN) {
        return sentence;
    }

    let truncatedSentence = sentence.substr(0, MAX_LEN);

    const words = truncatedSentence.split(' ');
    words.pop();
    truncatedSentence = words.join(' ');

    return truncatedSentence + '...';
}