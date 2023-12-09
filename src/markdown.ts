import {Marked} from "marked";
import {markedHighlight} from "marked-highlight";

import hljs from "highlight.js";
import {markedEmoji} from "marked-emoji";
import {ref} from "vue";
import axios from "axios";
import {getUser} from "./core/data.ts";

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

const getNameById = (match: string, members: Array<number>) => {
    const id = match.slice(1);
    if (members.includes(parseInt(id))) {
        return `<span style="color: blue;" class="mention" data-user-id="${id}">@${getUser(parseInt(id)).name}</span>`
    }
    return `<span>${match}</span>`;
}

const markdown2Html = (markdown: string, members: Array<number>) => {
    // 首先处理 @ 提及
    const processedMarkdown = markdown.replace(/@[a-zA-Z0-9_-]+/g, match => getNameById(match, members));

    // 然后将处理过的文本传递给 Markdown 解析器
    return marked.parse(processedMarkdown, {
        breaks: true,
    });
}

export {
    markdown2Html,
    emojisLoaded,
}