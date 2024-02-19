import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Form, Upload, message } from "antd";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import LtFormInput from "../../core/components/lt-form-input";
import UserService from "../../shared/services/users.service";
import { actions, selectors } from "../../stores";
import "./style.scss";
import Item from "antd/es/list/Item";

const Information = () => {
  const dispatch = useDispatch();
  const [avatar, setAvatar] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const userInfo = useSelector(selectors.selectUserInfo);

  const {
    watch,
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      passwordConfirm: "",
      name: "",
      phone: "",
      address: "",
    },
  });

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      messageApi.warning("Chi cho phép upload hình ảnh");
    }
    return false;
  };

  const revokeUrl = () => {
    if (avatarUrl) {
      URL.revokeObjectURL(avatarUrl);
    }
    setAvatarUrl(null);
  };

  const handleUploadFile = ({ file }) => {
    revokeUrl();
    const imageUrl = URL.createObjectURL(file);
    setAvatar(file);
    setAvatarUrl(imageUrl);
  };

  const handleUpdateUser = async (formValue) => {
    try {
      const formData = new FormData();
      ["email", "passwordConfirm"].forEach((field) => {
        delete formValue[field];
      });
      for (const field of Object.keys(formValue)) {
        if (formValue[field]) {
          formData.append(field, formValue[field]);
        }
      }
      if (avatar) {
        formData.append("avatar", avatar);
      }
      dispatch(actions.showLoading());
      const user = await UserService.updateUser(
        userInfo.id || userInfo._id,
        formData
      );
      dispatch(actions.setUser(user));
      localStorage.setItem("currentUser", JSON.stringify(user));
      if (avatar) {
        revokeUrl();
      }
      messageApi.open({
        type: "success",
        content: "Cập nhật thành công",
      });
    } catch (error) {
      messageApi.open({
        type: "error",
        content: error?.response?.data?.message || error.message,
      });
    } finally {
      dispatch(actions.hideLoading());
    }
  };

  useEffect(() => {
    reset({
      email: userInfo?.email,
      name: userInfo?.name,
      phone: userInfo?.phone,
      address: userInfo?.address,
    });
  }, []);

  return (
    <div className="container h-100 pb-5">
      {contextHolder}
      <div className="py-3">
        <h2 className="text-center">THÔNG TIN CÁ NHÂN</h2>
      </div>
      <hr />
      <div className="text-center">
        <Avatar
          src={avatarUrl || userInfo?.avatar}
          size={120}
          icon={<UserOutlined />}
        />
        <div className="pt-3">
          <Upload
            name="avatar"
            onRemove={revokeUrl}
            beforeUpload={beforeUpload}
            onChange={handleUploadFile}
            showUploadList={false}
          >
            <Button size="large" icon={<UploadOutlined />}>
              Tải ảnh lên
            </Button>
          </Upload>
        </div>
      </div>
  
      
      <Form layout="vertical" onFinish={handleSubmit(handleUpdateUser)}>
      <LtFormInput
          label="Email"
          name="email"
          control={control}
          placeholder="Email"
          isDisabled
        />
        <LtFormInput
          label="Mật khẩu mới"
          isPassword
          name="password"
          control={control}
          placeholder="Mật khẩu mới"
          error={errors.password}
          rules={{
            pattern: {
              value:/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@!#$%^&*])[A-Za-z\d@!#$%^&*]{8,}$/,
              message:
                "Mật khẩu phải chứa ít nhất 1 chữ in hoa, 1 chữ thường, 1 chữ số và 1 ký tự đặc biệt, tối thiểu là 8 ký tự.",
            },
          }}
        />
        <LtFormInput
          label="Xác nhận mật khẩu"
          isPassword
          name="passwordConfirm"
          control={control}
          error={errors.passwordConfirm}
          placeholder="Xác nhận mật khẩu"
          rules={{
            validate: (value) => {
              if (value !== watch("password")) {
                return "Mật khẩu xác nhận không khớp";
              }
              return null;
            },
          }}
        />
        <LtFormInput
          label="Họ và tên"
          name="name"
          control={control}
          placeholder="Họ và tên"
        />
        <LtFormInput
          label="Số điện thoại"
          name="phone"
          control={control}
          error={errors.phone}
          placeholder="Số điện thoại"
          rules={{
            pattern: {
              value: /^(\+84|0)(3|5|7|8|9)(\d{8})$/,
              message: "Số điện thoại không hợp lệ",
            },
          }}
        />
        <LtFormInput
          label="Địa chỉ"
          name="address"
          control={control}
          placeholder="Địa chỉ"
        />
        <div className="form-group text-center">
          <Button size="large" type="primary" htmlType="submit">
            Cập Nhật Thông Tin
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Information;
