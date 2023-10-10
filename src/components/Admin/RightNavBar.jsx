import '../../assets/css/home/components/RightNavBar.css'
import {useEffect} from "react";
import axios from "axios";
function RightNavBar({isRight, handleClickRight}) {
    // useEffect(() => {
    //     axios.post('https://chat.aivvm.com/api/chat', {
    //         "model":{
    //             "id":"gpt-4","name":"GPT-4"
    //         },
    //         "messages":[],
    //         "key":"",
    //         "prompt":"You are GPT-4, a large language model trained by OpenAI. Follow the user's instructions carefully. Respond using markdown.",
    //         "temperature":0.7
    //     }).then((res) => {
    //         console.log(res.data)
    //     }, {
    //         headers: {"Access-Control-Allow-Origin": "*"}
    //     })
    // }, [])
    return (
        <>
            <div className={"right-navbar-main col-lg-3 "+(isRight ? "show-right-mobile" : "")}>
                <div className="p-1 fw-bold text-center">GPT Assistant</div>
                <button onClick={handleClickRight} className="show-button-mobile btn btn-sm btn-default border-1 border-white text-white z-2" style={{
                    position: "absolute",
                    right: "10px",
                    top: "10px"
                }}>
                    <i className="fa-solid fa-xmark"></i>
                </button>

                <p className="text-center">Coming soon</p>

            </div>
        </>
    )
}

export default RightNavBar