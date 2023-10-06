const axios = require("axios");

module.exports = {
    getGPT: async function (messages, counter = 0) {
        if (counter > 5){
            return false
        }
        try {
            let res = await axios.post('https://gpt.hknight.dev/v1/chat/completions', {
                    // model: "gpt-3.5-turbo-0613",
                    messages: messages,
                    temperature: 0.7
                }, {
                    // timeout: 10000,
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                        "OpenAI-Organization": `${process.env.OPENAI_ORG_KEY}`
                    }
                }
            );
            return res.data;
        } catch (e){
            await new Promise(r => setTimeout(r, 1000));
            return this.getGPT(messages, (counter+1))
        }

    },
}