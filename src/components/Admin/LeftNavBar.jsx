import '../../assets/css/home/components/LeftNavBar.css'
import {useContext, useEffect} from "react";
import {DataUserContext} from "../../Contexts";

function LeftNavBar({isLeft, handleClickLeft, listSupporter, onChooseUser}) {
    const DataUser = useContext(DataUserContext)
    return (
        <>
            <div className={"left-navbar-main col-lg-2 "+(isLeft ? "show-left-mobile" : "")}>
                <div className="pl-1 pt-2">
                    <h6 className="text-left">Người dùng đang online</h6>
                    <button onClick={handleClickLeft} className="show-button-mobile btn btn-sm btn-default border-1 border-white text-white z-2" style={{
                        position: "absolute",
                        right: "10px",
                        top: "10px"
                    }}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div className="list-chat">

                    {
                        listSupporter.length > 0 ?
                        listSupporter.map((value, index) => (
                            <div className="item-chat" key={index} onClick={() => {onChooseUser(value.id)}}>
                                <div className="d-flex flex-row">
                                    <div className="position-relative p-2" style={{width:"50px"}}>
                                        <img className="rounded-circle" src={value.avatar} width="100%" alt="avatar"/>
                                        <i className="fa-solid fa-circle fa-2xs position-absolute text-success" style={{
                                            bottom:"10px",
                                            right:"9px"
                                        }}></i>

                                    </div>
                                    <span className="name-client"> Client {index}</span>
                                </div>
                            </div>
                        ))
                            : (
                                <div className={"text-center p-4"}>
                                    Không có nguời dùng nào online.
                                    <img src="https://cdnl.iconscout.com/lottie/premium/thumb/404-error-page-3959260-3299959.gif" style={{
                                        opacity: 0.7
                                    }} width="80%" alt=""/>
                                </div>
                            )
                    }

                </div>
                <div className="bottom-info d-flex" style={{paddingLeft: "5px"}}>
                    <div className="d-flex flex-row">
                        <div className="position-relative p-2" style={{width:"50px"}}>
                            <img className="rounded-circle" src={DataUser.avatar} width="100%" alt="avatar"/>
                        </div>
                        <div className="d-flex flex-column">
                            <span className="name-client"><b>{DataUser.name} (You)</b></span>
                            <span className="">{DataUser.email}</span>
                        </div>
                    </div>
                    <button className="btn btn-default btn-sm position-absolute" title="Logout account" onClick={() => {localStorage.clear();sessionStorage.clear(); window.location.reload()}} style={{right: "10px", top:"15px", color: "inherit"}}>
                        <i className="fa-solid fa-xl fa-right-from-bracket"></i>
                    </button>

                </div>

            </div>
        </>
    )
}

export default LeftNavBar