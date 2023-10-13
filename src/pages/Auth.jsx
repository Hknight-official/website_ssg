import React, {useEffect} from "react";

import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

import PanelLogin from "../components/Auth/PanelLogin";
import LiveView from "../components/Auth/LiveView";
import bgVideo from '../assets/video/livetheme.mp4'
import '../assets/css/auth/Auth.css';
import axios from "axios";
import user_axios from "../user_axios";
import {useNavigate} from "react-router-dom";
import config_website from "../config_website.json";
const Auth = () => {
    const sizeStyle = {
        height: "100vh",
        width: "100%"
    }

    const navigate = useNavigate();

    async function onSuccessGoogle(credentialResponse){
        let res = await user_axios.post(`${config_website.url}/auth/google_login`, {
            token: credentialResponse.credential
        })
        let {token, message} = res.data;
        if (!token){
            alert(message)
            return;
        }
        localStorage.setItem('token', token);
        navigate('/')
    }

    useEffect(() => {
        user_axios.get('user/user_info').then((res) => {
            // console.log(res.data)
            navigate('/')
        }).catch(function (error){

        })
    }, []);

    return(
        <GoogleOAuthProvider clientId="28119552172-9c9fj78fmjj0ldhg0m2sq991dpa3oqis.apps.googleusercontent.com">
            <div className={"position-relative"} style={sizeStyle}>
                <div className={"container-fluid position-absolute"}>
                    <div className="video-background">
                        <video autoPlay muted loop>
                            <source src={bgVideo} type="video/mp4" />
                        </video>
                        <div className="overlay"></div>
                    </div>
                    <div className="row">
                        <div className="col-sm mb-3 mb-md-0 p-0 invisible">
                            <LiveView data={[
                                {title: "Xin Chào !", content:"Bọn mình là FPsy - Một dự án về tâm lý học đường cho học sinh và sinh viên"},
                                {title: "Hello !", content:"We are FPsy - A project about school psychology for students"}
                            ]} />
                        </div>
                        <div className="col-sm me-0 ms-auto p-0" id={"Section2"}>
                            <PanelLogin onSuccessGoogle={onSuccessGoogle} />
                        </div>
                    </div>
                </div>
                <a href={`#Section2`}>
                    <div className={"d-sm-none d-flex start-50 translate-middle-x scroll-button"}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="4em" viewBox="0 0 448 512">
                                <path d="M201.4 137.4c12.5-12.5 32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 205.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160z" fill="#FFD0A1"/>
                            </svg>
                    </div>
                </a>
            </div>
        </GoogleOAuthProvider>
    )
}
export default Auth;
