import React from "react";

const TriangleComponents = ({
        content,
        button = false,
        text = false,
    }) =>{
    return(
        <div>
            {button && (
                <div className={"d-flex flex-column"}>
                    <div className={"d-flex justify-content-center text-white"}><h1>{content}</h1></div>
                    <div className={"d-flex flex-sm-row flex-column justify-content-center gap-2"}>
                        <button type={"button"} className="btn btn-primary btn-md">Login</button>
                        <button type={"button"} className="btn btn-primary btn-md">Sign up</button>
                    </div>
                </div>
            )}
            {text && (
                <div className={"d-flex flex-column"}>
                    <div className={"d-flex justify-content-center text-white"}><h6>{content}</h6></div>
                    <div className={"d-flex flex-row justify-content-center gap-2"}>
                        <a href="" className="border-md-end  pe-2 text-center text-primary">Term of Use</a>
                        <a href="" className={"text-center text-primary"}>Privacy policy</a>
                    </div>
                </div>
            )}
        </div>
    )
}
export default TriangleComponents