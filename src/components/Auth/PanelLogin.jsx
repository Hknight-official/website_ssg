import React from "react";
import TriangleComponents from "./TriangleComponents";
const PanelLogin = ({onSuccessGoogle}) =>{
    const myStyle = {
        height: "100vh",
    }
    return(
        <div className={"d-flex flex-column bg-black bg-opacity-75 justify-content-center"} style={myStyle}>
            <div className={"p-4 m-3 d-sm-none"}><h1 className={"text-white"}>School Psychology for Future </h1></div>
            <div className={"mt-auto mb-auto "}>
                <TriangleComponents onSuccessGoogle={onSuccessGoogle} content={"Get Started"} button={true} />
            </div>
            <div className={"mb-4"} >
                <TriangleComponents onSuccessGoogle={onSuccessGoogle} content={"FPsy - School Psychology 4F"} text={true} />
            </div>
        </div>
    )
}
export default PanelLogin;