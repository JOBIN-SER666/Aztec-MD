// AZTEC MD WABOT VERSION 3.0.0
// MADE WITH LOVE BY DIEGOSON

module.exports = {
  name: "ai",
  alias: ["gpt", "openai"],
  category: "CHATGPT",
  desc: "Research something",
  async xstart(vorterx, m, { xReact, doReply, text }) {
     
    if (!text) {
    await xReact("❌");
    return m.reply("*Please provide a query, e.g., 'Who is Aztec?'*");
    }

    await xReact("🤖");
    const response = `
*CHAT_GPT - GPT-4 2023*

Query: ${text}

[![Thumbnail](https://i.ibb.co/C7TXRcH/photo-1678483789107-0029c61fdcca.jpg)]

AZTEC MD is the latest version of the Chat_GPT4 language model, providing even more advanced conversational capabilities and natural language understanding.

Feel free to ask any question, and I'll do my best to provide a helpful answer!
`;

await m.reply(vorterx, m, response);
},
};
