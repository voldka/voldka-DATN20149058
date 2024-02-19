import { Avatar, Badge, Button, Dropdown, Tooltip } from "antd";
import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import BagIcon from "../../assets/icon/bagIcon.svg";
import LogoutIcon from "../../assets/icon/logoutIcon.svg";
import NoteIcon from "../../assets/icon/noteIcon.svg";
import SearchIcon from "../../assets/icon/searchIcon.svg";
import AvatarIcon from "../../assets/img/avatar-2.png";
import Logo from "../../assets/img/logo.svg";
import { actions, selectors } from "../../stores";
import "./style.scss";
import { UserOutlined, LoginOutlined } from "@ant-design/icons";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfo = useSelector(selectors.selectUserInfo);
  const products = useSelector(selectors.selectProducts);

  const [searchValue, setSearchValue] = useState("");

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      performSearch();
    }
  };

  const handleChange = (event) => {
    setSearchValue(event.target.value);
  };

  const performSearch = () => {
    navigate(`/cua-hang?name=${searchValue}`);
  };

  const handleIconClick = () => {
    performSearch();
  };
  const handleNavigate = (direction) => {
    navigate(direction);
  };
  const handleLogout = () => {
    localStorage.removeItem("user");
    dispatch(actions.resetUser());
    dispatch(actions.setCartProducts([]));
    return handleNavigate("/");
  };
  const items = useMemo(() => {
    return [
      {
        key: "1",
        label: (
          <div
            onClick={() => {
              return handleNavigate("/thong-tin-ca-nhan");
            }}
          >
            Thông tin cá nhân
          </div>
        ),
      },
      {
        key: "2",
        label: (
          <div
            onClick={() => {
              localStorage.removeItem("user");
              dispatch(actions.resetUser());
              dispatch(actions.setCartProducts([]));
              return handleNavigate("/");
            }}
          >
            Đăng xuất
          </div>
        ),
      },
    ];
  }, []);

  return (
    <>
      <header>
        <NavLink to="/">
          <img
            src={Logo}
            alt="logo"
            style={{ height: "80px" }}
          />
        </NavLink>
        <div className="header-container">
          <div className="up">
            <button
              class="button-89"
              role="button"
              type="primary"
              size="large"
              onClick={() => handleNavigate("/")}
            >
              Trang chủ
            </button>
            <button
              class="button-89"
              role="button"
              type="primary"
              size="large"
              onClick={() => handleNavigate("/cua-hang")}
            >
              Sản phẩm
            </button>
            <button
              class="button-89"
              role="button"
              type="primary"
              size="large"
              onClick={() => handleNavigate("/ve-chung-toi")}
            >
              Giới thiệu
            </button>
            <button
              class="button-89"
              role="button"
              type="primary"
              size="large"
              onClick={() => handleNavigate("/cong-dong")}
            >
              Cộng đồng
            </button>
            <div className="input">
              <input style={{margin:'0px'}}
                placeholder="Tìm kiếm tại đây ..."
                value={searchValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
              <button className="incon-search" style={{margin:'0px'}} onClick={handleIconClick} >
                <img src={SearchIcon} alt="logo" />
              </button>
            </div>
            
            {userInfo?.isAdmin ? (
              <>
                <div
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    zIndex: 9999,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column", // Hiển thị theo cột
                  }}
                >
                  <h2 className="text-center text-uppercase">
                    Đăng xuất tài khoản Admin nhé!
                  </h2>
                  <Button
                    type="primary"
                    danger
                    size="large"
                    onClick={handleLogout}
                  >
                    <LoginOutlined /> Đăng xuất
                  </Button>
                </div>
              </>
            ) : (
              <>
                {" "}
                {!userInfo ? (
                  <>
                    <Tooltip title="Đăng nhập/Đăng ký">
                      <div
                        className="icon-up"
                        onClick={() => handleNavigate("/dang-nhap")}
                      >
                        <img src={LogoutIcon} alt="logo" />
                      </div>
                    </Tooltip>
                  </>
                ) : (
                  <>
                    <Tooltip title="Giỏ hàng">
                      <Badge
                        count={
                          products && products.length ? products.length : null
                        }
                      >
                        <div
                          className="icon-up"
                          onClick={() => handleNavigate("/gio-hang-cua-toi")}
                        >
                          <img src={BagIcon} alt="logo" />
                        </div>
                      </Badge>
                    </Tooltip>
                    <Tooltip
                      title="Đơn hàng"
                      onClick={() => handleNavigate("/don-hang-cua-toi")}
                    >
                      <div className="icon-up">
                        <img src={NoteIcon} alt="logo" />
                      </div>
                    </Tooltip>
                    <div className="icon-up">
                      <Dropdown
                        menu={{
                          items,
                        }}
                        placement="bottom"
                        arrow
                      >
                        <Avatar
                          src={userInfo.avatar}
                          size="large"
                          icon={<UserOutlined />}
                        />
                      </Dropdown>
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          {/* 
          <div className="down">
            
          </div> */}
        </div>
      </header>
    </>
  );
};

export default Header;
