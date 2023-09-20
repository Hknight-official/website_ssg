import React from "react";
import PanelLogin from "../component/PanelLogin";
import LiveView from "../component/LiveView";
import bgVideo from '../asset/livetheme.mp4'
import './Auth.css';
const Auth = () => {
    return(
        <div className={"container-fluid"}>
            <div className="video-background">
                <video autoPlay muted loop>
                    <source src={bgVideo} type="video/mp4" />
                </video>
                <div className="overlay"></div>
            </div>
            <div className="row">
                <div className="col mb-3 mb-md-0">
                    <LiveView data={[
                        {title: "Xin Chào", content:"Bọn mình là FPsy - Một dự án về tâm lý học đường cho học sinh và sinh viên"},
                    ]} />
                </div>
                <div className="col me-0 ms-auto">
                    <PanelLogin />
                </div>
            </div>
        </div>
    )
}
export default Auth;
