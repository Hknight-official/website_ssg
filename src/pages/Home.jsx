import React, { createContext, useEffect, useState } from "react";
import LeftNavBar from "../components/Home/LeftNavBar";
import Chat from "../components/Home/Chat";
import RightNavBar from "../components/Home/RightNavBar";

import "../assets/css/home/home.css";
import user_axios from "../user_axios";
import { useNavigate } from "react-router-dom";
import { DataUserContext } from "../Contexts";

function Home() {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const navigate = useNavigate();

  const [userData, setUserData] = useState({});

  const [isLeft, setIsLeft] = useState(false);
  const [isRight, setIsRight] = useState(false);
  const [listSupporter, setListSupporter] = useState([]);

  useEffect(() => {
    user_axios
      .get("user/user_info")
      .then((res) => {
        // (res.data);
        if (res.data.data.role === 1) {
          navigate("/admin");
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

  return (
    <>
      {!userData["name"] ? (
        <div>Loading please wait...</div>
      ) : (
        <DataUserContext.Provider value={userData}>
          <div className="home-page row">
            <LeftNavBar
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
              roomId={userData.id}
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
