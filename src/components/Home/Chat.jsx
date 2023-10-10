import '../../assets/css/home/components/Chat.css'
import configWebsite from '../../config_website.json'
import {useContext, useEffect, useRef, useState} from "react";
import {markdown} from 'markdown';

import socketIOClient from "socket.io-client";
import {DataUserContext} from "../../Contexts";
const initlistMessages = [
    {
        avatar: configWebsite.url+'/images/avatar_ai.jpg',
        username: 'System',
        context: 'Chào mừng bạn đến với trang website. Hy vọng bạn sẽ có trải nghiệm tuyệt vời và giải quyết hiệu quả các vấn đề tâm lý tại đây.',
        isUser: false,
        time: (new Date()).getTime()
    },
]

function Chat({roomId, handleClickLeft, handleClickRight, listSupporter, handleSetListSupporter}) {
    const socketRef = useRef(socketIOClient);

    const [inputMessage, setInputMessage] = useState('');
    const [listMessages, setListMessage] = useState(localStorage.getItem('list_message') ? JSON.parse(localStorage.getItem('list_message')) : initlistMessages);
    const [isTyping, setIsTyping] = useState(false)

    const DataUser = useContext(DataUserContext)
    const timeoutAIauto = useRef(30*1000);
    const scrollItem = useRef(null);
    const previousListSupporter = useRef(null);

    // const firstCheckSupporter = useRef(false);

    useEffect(() => {
        if (listMessages.length > 2){
            localStorage.setItem('list_message', JSON.stringify(listMessages))
        }
        scrollItem.current.scrollIntoView({ block: 'end', behavior: 'smooth' });
    }, [listMessages]);

    useEffect(() => {
        if (listSupporter.length > 0){
            timeoutAIauto.current = 30000
        } else {

        }
    }, [listSupporter]);

    useEffect(() => { // init socket
        socketRef.current = socketIOClient.connect(configWebsite['url'], {
            query: {token: localStorage.getItem('token')},
            reconnection: true,
            reconnectionDelay: 500,
            reconnectionAttempts: 10
        })
        socketRef.current.on('receive_message', function (args){
            setListMessage(message => [...message, args])
        })

        socketRef.current.on('start_typing_message', function (args){
            console.log('typing...')
            setIsTyping(true)
        })

        socketRef.current.on('end_typing_message', function (args){
            console.log('end typing')
            setIsTyping(false)
        })

        socketRef.current.on('supporter_update', function (args){
            console.log(args)
            let list_supporter = args.filter((value) => {
                return value.role === 1
            })
            console.log(JSON.stringify(listSupporter), JSON.stringify(list_supporter))
            if (!list_supporter.length > 0 && JSON.stringify(previousListSupporter.current) !== JSON.stringify(list_supporter)){
                previousListSupporter.current = list_supporter
                setListMessage(message => [...message, {
                    roomId,
                    username: initlistMessages[0].username,
                    avatar: initlistMessages[0].avatar,
                    context: "Hiện tại tất cả tư vấn viên đều offline, chế độ phản hồi nhanh của AI sẽ được bật cho đến khi có tư vấn viên online trở lại.",
                    isUser: false,
                    time: (new Date()).getTime()
                }])
                timeoutAIauto.current = 1000
            }
            handleSetListSupporter(list_supporter)
            // console.log("connect "+args)
        })

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    useEffect(() => {
        socketRef.current.emit('join_room', {roomId});
    }, [roomId])

    const handleSendMessage = (e) => {
        setInputMessage(e.target.value)
        if (e.keyCode !== 13 || e.shiftKey || isTyping){
            return;
        }
        e.preventDefault();
        let args = {
            roomId,
            username: DataUser.name,
            avatar: DataUser.avatar,
            context: inputMessage,
            isUser: true,
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

    useEffect(() => { // auto rep user when no response by human
        let interval = setInterval(() => {
            if (listMessages[listMessages.length-1].isUser){
                socketRef.current.emit('ai_support', listMessages);
                clearInterval(interval)
            }
        }, timeoutAIauto.current)
        return function () {
            clearInterval(interval)
        }
    }, [listMessages]);

    const handleCallAI = () => {
        socketRef.current.emit('ai_support', listMessages);
    }

    return (
        <>
            <div className="chat-main col-lg-8 col-sm-12">
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
                        ('isUser' in listMessages[listMessages.length-1] && listMessages[listMessages.length-1]['isUser']) ? (
                            <div>
                                <button onClick={handleCallAI} className="btn btn-sm btn-outline-secondary position-absolute" style={
                                    {
                                        top: "-50px",
                                        right: "15px"
                                    }
                                }><i className="fa-solid fa-robot"></i> Trả lời nhanh.</button>
                            </div>
                        ) : (<div></div>)
                    }
                    <textarea value={inputMessage} onChange={handleTypingMessage} onKeyDown={handleSendMessage} className="input-chat-area col-12" maxLength={250} placeholder="Send a message"></textarea>
                    <p className="text-center small">Đoạn chat sẽ ẩn danh bạn không cần phải lo về việc lo danh tính.</p>
                </div>

            </div>
        </>
    )
}

export default Chat