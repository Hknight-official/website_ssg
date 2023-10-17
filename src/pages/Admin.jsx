import React, { useEffect, useState } from "react";
import LeftNavBar from "../components/Admin/LeftNavBar";
import Chat from "../components/Admin/Chat";
import RightNavBar from "../components/Admin/RightNavBar";

import "../assets/css/home/home.css";
import user_axios from "../user_axios";
import { useNavigate } from "react-router-dom";
import { useDataUserContext } from "../Contexts";

function Home() {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const navigate = useNavigate();
  const { dataUser, onChangeDataUser } = useDataUserContext();
  const { fcmToken } = dataUser ?? {};

  const [isLoading, setIsLoading] = useState(true);
  const [roomId, setRoomId] = useState(null);

  const [isLeft, setIsLeft] = useState(false);
  const [isRight, setIsRight] = useState(false);
  const [listSupporter, setListSupporter] = useState([]);

  useEffect(() => {
    if (fcmToken) {
      user_axios
        .post("user/fcm_token", {
          fcmToken: fcmToken,
        })
        .then((res) => console.log(res))
        .catch((error) => console.log(error));
    }
  }, [fcmToken]);

  useEffect(() => {
    function fetchDataUser() {
      setIsLoading(true);
      user_axios
        .get("user/user_info")
        .then((res) => {
          // console.log(res.data);
          if (res.data.data.role !== 1) {
            navigate("/");
          }
          onChangeDataUser({
            userInfo: res.data.data,
          });
        })
        .catch(function (error) {
          if (error.response.status === 403) {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            navigate("/auth");
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }

    fetchDataUser();
  }, []);

  const onChooseClient = (idUser) => {
    setRoomId(idUser);
  };

  return (
    <>
      {isLoading ? (
        <div>Loading please wait...</div>
      ) : (
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
      )}
    </>
  );
}

export default Home;
