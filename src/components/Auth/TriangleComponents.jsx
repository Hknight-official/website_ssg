import React, {useState} from "react";
import { GoogleLogin } from '@react-oauth/google';

import config_website from '../../config_website.json'
import user_axios from "../../user_axios";

const TriangleComponents = ({
        content,
        button = false,
        text = false,
        onSuccessGoogle
    }) =>{

    const [isLogin, setIsLogin] = useState()



    return(
        <div>
            {button && (
                <div className={"d-flex flex-column"}>
                    <div className={"d-flex justify-content-center text-white"}><h1>{content}</h1></div>
                    <div className={"d-flex flex-sm-row flex-column justify-content-center gap-2"}>
                        <div className="mx-auto">
                            {/*<input type="hidden" value={tokenWebsite}/>*/}
                            <GoogleLogin size="large"
                                onSuccess={onSuccessGoogle}
                                onError={() => {
                                    console.log('Login Failed');
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
            {text && (
                <div className={"d-flex flex-column"}>
                    <div className={"d-flex justify-content-center text-white"}><h6>{content}</h6></div>
                    <div className={"d-flex flex-row justify-content-center gap-2"}>
                        {/*<a href="" className="border-md-end  pe-2 text-center text-primary">Term of Use</a>*/}
                        {/*<a href="" className={"text-center text-primary"}>Privacy policy</a>*/}
                    </div>
                </div>
            )}
        </div>
    )
}
export default TriangleComponents