import {Marked} from "marked";
import {markedHighlight} from "marked-highlight";

import hljs from "highlight.js";
import {markedEmoji} from "marked-emoji";
import {ref} from "vue";
import axios from "axios";
import {tr} from "vuetify/locale";

const emojisLoaded = ref(false);
// Get all the emojis available to use on GitHub.
axios.get("/github_emoji.json").then((res) => {
  const emojis = res.data;
  const options = {
    emojis,
    unicode: false,
  };
  marked.use(markedEmoji(options));
  console.log("emojis loaded");
  // rerender the message
  emojisLoaded.value = true;
})

const marked = new Marked(markedHighlight({
  langPrefix: 'hljs language-',
  highlight(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, {language}).value;
  }
}))

const markdown2Html = (markdown: string) => {
  return marked.parse(markdown, {
    breaks: true,
  });
}

export {
    markdown2Html,
    emojisLoaded,
}