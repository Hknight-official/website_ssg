import React, { createContext, useEffect, useState } from "react";
import LeftNavBar from "../components/Admin/LeftNavBar";
import Chat from "../components/Admin/Chat";
import RightNavBar from "../components/Admin/RightNavBar";

import "../assets/css/home/home.css";
import user_axios from "../user_axios";
import { useNavigate } from "react-router-dom";
import { DataUserContext } from "../Contexts";

function Home() {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const navigate = useNavigate();

  const [userData, setUserData] = useState({});
  const [roomId, setRoomId] = useState(null);

  const [isLeft, setIsLeft] = useState(false);
  const [isRight, setIsRight] = useState(false);
  const [listSupporter, setListSupporter] = useState([]);

  useEffect(() => {
    user_axios
      .get("user/user_info")
      .then((res) => {
        console.log(res.data);
        if (res.data.data.role !== 1) {
          navigate("/");
        }
        setUserData(res.data.data);
      })
      .catch(function (error) {
        if (error.response.status === 403) {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          navigate("/auth");
        }
      });
  }, []);

  const onChooseClient = (idUser) => {
    setRoomId(idUser);
  };

  return (
    <>
      {!userData["name"] ? (
        <div>Loading please wait...</div>
      ) : (
        <DataUserContext.Provider value={userData}>
          <div className="home-page row">
            <LeftNavBar
              onChooseUser={onChooseClient}
              listSupporter={listSupporter}
              handleClickLeft={() => {
                setIsLeft(!isLeft);
              }}
              isLeft={isLeft}
            />
            <Chat
              listSupporter={listSupporter}
              handleSetListSupporter={setListSupporter}
              handleClickLeft={() => {
                setIsLeft(!isLeft);
              }}
              handleClickRight={() => {
                setIsRight(!isRight);
              }}
              roomId={roomId}
            />
            <RightNavBar
              isRight={isRight}
              handleClickRight={() => {
                setIsRight(!isRight);
              }}
            />
          </div>
        </DataUserContext.Provider>
      )}
    </>
  );
}

export default Home;
