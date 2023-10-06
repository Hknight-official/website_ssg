const gpt_support = require('./gpt_support')
async function gpt_support_api(req, res){
    const {messages} = req.body;
    let listMessage = [{
        role: 'user',
        content: 'Bắt đầu cuộc hội thoại với tôi, bạn sẽ đóng vai là một chuyên gia hỗ trợ tâm lý ứng dụng GPT-4 không phải GPT-3'
    }]
    for (let i = 0;i < messages.length;i++){
        let role = 'assistant'
        if (messages[i].isUser){
            role = 'user'
        }
        listMessage.push({role: role, content: messages[i].context});
    }
    let response = await gpt_support.getGPT(listMessage);
    if (!response){
        res.send('Hệ thống phản hồi AI đang quá tải vui lòng thử lại sau!');
    } else {
        res.send(response);
    }
}

module.exports = gpt_support_api;