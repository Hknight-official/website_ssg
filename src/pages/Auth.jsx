import React from "react";
import PanelLogin from "../component/PanelLogin";
import LiveView from "../component/LiveView";
import bgVideo from '../asset/livetheme.mp4'
import './Auth.css';
const Auth = () => {
    const sizeStyle = {
        height: "100vh",
        width: "100%"
    }
    return(
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
                        <PanelLogin />
                    </div>
                </div>
            </div>
            <div className={"d-sm-none d-flex start-50 translate-middle-x scroll-button"}>
                <a href={`#Section2`}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="4em" viewBox="0 0 448 512">
                        <path d="M201.4 137.4c12.5-12.5 32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 205.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160z" fill="#FFD0A1"/>
                    </svg>
                </a>
            </div>
        </div>
    )
}
export default Auth;
