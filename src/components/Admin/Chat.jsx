import '../../assets/css/home/components/Chat.css'
import configWebsite from '../../config_website.json'
import {useContext, useEffect, useRef, useState} from "react";
import socketIOClient from "socket.io-client";
import {DataUserContext} from "../../Contexts";
import axios from "axios";
import user_axios from "../../user_axios";
import {markdown} from "markdown";
const initlistMessages = [
    {
        avatar: configWebsite.url+'/images/avatar_ai.jpg',
        username: 'System',
        context: 'Bạn vừa chọn người cần tư vấn thành công, hy vọng bạn sẽ giúp các bạn được hỗ trợ tâm lý hiệu quả nhé.',
        isUser: false,
        time: (new Date()).getTime()
    },
]

function Chat({roomId, handleClickLeft, handleClickRight, listSupporter, handleSetListSupporter}) {
    const socketRef = useRef(socketIOClient);

    const [inputMessage, setInputMessage] = useState('');
    const [listMessages, setListMessage] = useState(sessionStorage.getItem('list_message') ? JSON.parse(sessionStorage.getItem('list_message')) : initlistMessages);
    const [isTyping, setIsTyping] = useState(false)

    const typingTimeoutRef = useRef(null);

    const DataUser = useContext(DataUserContext)
    const scrollItem = useRef(null);

    // const firstCheckSupporter = useRef(false);

    useEffect(() => {
        if (listMessages.length > 2){
            sessionStorage.setItem('list_message', JSON.stringify(listMessages))
        }
        // scrollItem.current.scrollIntoView({ block: 'end', behavior: 'smooth' });
    }, [listMessages]);

    useEffect(() => { // init socket
        socketRef.current = socketIOClient.connect(configWebsite['url'], {
            query: {token: localStorage.getItem('token')},
            reconnection: true,
            reconnectionDelay: 500,
            reconnectionAttempts: 10
        })
        socketRef.current.on('init_messages', function (args){
            setListMessage(args)
        })

        socketRef.current.on('receive_message', function (args){
            setListMessage(message => [...message, args])
        })

        socketRef.current.on("start_typing_message", function (args) {
            //console.log("typing...");
            setIsTyping(true);
            clearTimeout(typingTimeoutRef.current)
            typingTimeoutRef.current = setTimeout(() => {
                setIsTyping(false);
            }, 1000)
        });

        // socketRef.current.on('end_typing_message', function (args){
        //     //console.log('end typing')
        //     setIsTyping(false)
        // })

        socketRef.current.on('supporter_update', function (args){
            //console.log(args)
            let list_supporter = args.filter((value) => {
                return value.role === 0
            })
            //console.log(list_supporter)
            handleSetListSupporter(list_supporter)
            // console.log("connect "+args)
        })

        return () => {
            socketRef.current.disconnect();
        };
    }, [roomId]);

    useEffect(() => {
        if (roomId === null){
            setListMessage([{
                avatar: configWebsite.url+'/images/avatar_ai.jpg',
                username: 'System',
                context: 'Chào mừng cộng tác viên trở lại, Vui lòng chọn người dùng cần được tư vấn ở tab phía bên trái.',
                isUser: false,
                time: (new Date()).getTime()
            }])
        } else {
            setListMessage(initlistMessages)
        }

        socketRef.current.emit('join_room', {roomId});
    }, [roomId])

    const handleSendMessage = (e) => {
        setInputMessage(e.target.value)
        if (e.keyCode !== 13 || e.shiftKey){
            return;
        }
        e.preventDefault();
        let args = {
            roomId,
            username: DataUser.name,
            avatar: DataUser.avatar,
            context: inputMessage,
            isUser: false,
            time: (new Date()).getTime()
        }
        socketRef.current.emit('send_message', args)
        args.username = 'You';
        setListMessage(message => [...message, args])

        setInputMessage('')
    }

    const handleTypingMessage = (e) => {
        setInputMessage(e.target.value)
        socketRef.current.emit('typing_message', {roomId})
    }

    const handleCallAI = () => {
        setInputMessage('loading...')
        user_axios.post(configWebsite.url+'/user/gpt_support', {
            messages: listMessages
        }).then((value) => {
            setInputMessage(value.data)
        })
    }

    return (
        <>
            <div className="chat-main col-lg-7 col-sm-12">
                <div className="navbar-chat p-2 position-relative">
                    <button onClick={handleClickLeft} className="show-button-mobile btn btn-sm btn-default border-1 border-white text-white">
                        <i className="fa-solid fa-users-line"></i>
                    </button>
                    <button onClick={handleClickRight} className="show-button-mobile btn btn-sm btn-default border-1 border-white text-white float-end">
                        <i className="fa-solid fa-circle-question"></i>
                    </button>
                </div>
                <div className="box-chat">
                    <div className="p-2">
                        {
                            listMessages.map((message, index, array) => (
                                <div key={index} ref={scrollItem} className="item-chat-message d-flex flex-row justify-content-start p-1">
                                    <img className="rounded-circle p-2 avatar" src={message.avatar} width="90%" alt="avatar"/>
                                    <div className="p-2 small">
                                        <span><b>{message.username}</b> <small>{new Date(message.time).toLocaleTimeString()}</small></span><br/>
                                        <span dangerouslySetInnerHTML={{__html:markdown.toHTML(message.context)}}></span>
                                    </div>
                                </div>
                            ))
                        }
                        {
                            isTyping ? (
                                <div className="item-chat-message d-flex flex-row justify-content-start p-1">
                                    <img className="rounded-circle p-2 avatar" src="https://i.gifer.com/origin/da/da4ad82750e6980c59d664afa3f6d071_w200.gif" width="90%" alt="avatar"/>
                                    <div className="p-2 small">
                                        <span>Someone</span><br/>
                                        <span>Typing...</span>
                                    </div>
                                </div>
                            ) : (<div></div>)
                        }
                    </div>
                </div>
                <div className="box-input-chat col-lg-11 col-sm-12">
                    {
                        (true) ? (
                            <div>
                                <button onClick={handleCallAI} className="btn btn-sm btn-outline-secondary position-absolute" style={
                                    {
                                        top: "-50px",
                                        right: "15px"
                                    }
                                }><i className="fa-solid fa-robot"></i> Đề xuất AI.</button>
                            </div>
                        ) : (<div></div>)
                    }
                    <textarea value={inputMessage} style={{resize: "vertical"}} onChange={handleTypingMessage} onKeyDown={handleSendMessage} className="input-chat-area col-12" placeholder="Send a message"></textarea>
                    <p className="text-center small">Mẹo: sử dụng nút đề xuất AI để nhận được gợi ý vào tin nhắn.</p>
                </div>

            </div>
        </>
    )
}

export default Chat