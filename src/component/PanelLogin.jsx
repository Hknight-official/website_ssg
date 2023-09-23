import React from "react";
import TriangleComponents from "./TriangleComponents";
const PanelLogin = () =>{
    const myStyle = {
        height: "100vh",
    }
    return(
        <div className={"d-flex flex-column bg-black bg-opacity-75 justify-content-center"} style={myStyle}>
            <div className={"p-4 m-3 d-sm-none"}><h1 className={"text-white"}>School Psychology for Future </h1></div>
            <div className={"mt-auto mb-auto "}>
                <TriangleComponents content={"Get Started"} button={true} />
            </div>
            <div className={"mb-4"} >
                <TriangleComponents content={"FPsy - School Psychology 4F"} text={true} />
            </div>
        </div>
    )
}
export default PanelLogin;