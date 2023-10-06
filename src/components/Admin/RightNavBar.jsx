import '../../assets/css/home/components/RightNavBar.css'

function RightNavBar({isRight, handleClickRight}) {
    return (
        <>
            <div className={"right-navbar-main col-lg-2 "+(isRight ? "show-right-mobile" : "")}>
                <div className="">Hướng dẫn sử dụng</div>
                <button onClick={handleClickRight} className="show-button-mobile btn btn-sm btn-default border-1 border-white text-white z-2" style={{
                    position: "absolute",
                    right: "10px",
                    top: "10px"
                }}>
                    <i className="fa-solid fa-xmark"></i>
                </button>
            </div>
        </>
    )
}

export default RightNavBar