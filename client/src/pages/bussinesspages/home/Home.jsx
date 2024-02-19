import { ShopOutlined } from "@ant-design/icons";
import { Button, Carousel, Empty, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import CarouselsService from "../../shared/services/carousels.service";
import ProductTypesService from "../../shared/services/product-types.service";
import { actions } from "../../stores";
import "./style.scss";

const contentStyle = {
  display: "block",
  height: "600px",
  width: "100%",
  objectFit: "cover",
};

const Home = () => {
  const dispatch = useDispatch();
  const [productTypes, setProductTypes] = useState([]);
  const [carousels, setCarousels] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const initHomePage = async () => {
      try {
        dispatch(actions.showLoading());
        const [productTypes, carousels] = await Promise.all([
          ProductTypesService.getAll(),
          CarouselsService.getAll(),
        ]);
        setProductTypes(productTypes);
        setCarousels(carousels);
      } catch (error) {
        messageApi.error(error?.response?.data?.message || error.message);
      } finally {
        dispatch(actions.hideLoading());
      }
    };

    initHomePage();
  }, []);
  return (
    <div className="home">
      {contextHolder}
      <div className="banner">
        <Carousel autoplay className="bg-light">
          {carousels.map((item) => (
            <div key={item._id}>
              <img style={contentStyle} src={item.imageUrl} alt="Carousel" />
            </div>
          ))}
        </Carousel>
      </div>
      <div className="container-fluid py-3">
        <h1 className="text-center text-uppercase">danh mục sản phẩm</h1>
        <div className="flex ai-center jc-center">
          <img src="/images/divider.png" alt="Divider" />
        </div>

        <div className="py-2">
          {productTypes.length ? (
            <>
              <div className="list-product-types">
                {productTypes.map((productType) => (
                  <div className="warp-product-type">
                    <div
                      key={productType._id}
                      className="product-type"
                      style={{ boxShadow: "2px 2px 4px 2px rgba(0,0,0,0.1)" }}
                    >
                      <div className="product-type-overlap">
                        <NavLink
                          to={`/cua-hang?productTypes=${productType._id}`}
                          className="w-100"
                        >
                          <Button
                            size="large"
                            className="product-type-overlap-button w-100"
                            icon={<ShopOutlined />}
                          >
                            Mua ngay
                          </Button>
                        </NavLink>
                      </div>
                      <img
                        src={productType.imageUrl}
                        alt={productType.name}
                        style={{ objectFit: "cover" }}
                      />
                      <h5>{productType.name}</h5>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex ai-center jc-center">
              <Empty description="Danh sách loại sản phẩm trống" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
