import React from 'react';
import logo from '../../assets/img/logo-white.svg';
import mailIcon from '../../assets/icon/mailIcon.svg';
import phoneIcon from '../../assets/icon/phoneIcon.svg';
import locationIcon from '../../assets/icon/locationIcon.svg';
import './style.scss';

const Footer = () => {
  return (
    <div className='footer'>
      <div className='footer-up'>
        <div className='footer-left'>
          <img src={logo} alt='logo' />
          <div className='text'>
            LT Hand Made tự hào mang tới một nền tảng bán nguyên liệu, vật liểu làm đồ thủ công chất
            lượng, giúp hế hệ trẻ Việt Nam thỏa sức sáng tạo, thể hiện chất riêng
          </div>
          <div className='contact'>
            <img src={mailIcon} alt='mailIcon' />
            <span>LThandmade@gmail.com</span>
          </div>
          <div className='contact'>
            <img src={phoneIcon} alt='phoneIcon' />
            <span>84+ 948 111 111</span>
          </div>
        </div>
        <div className='footer-right'>
          <div className='title'>Hệ thống LT Hand Made</div>
          <div className='location'>
            <img src={locationIcon} alt='locationIcon' />
            <span>
              Số 165, đường Lê Ngã, Phường Bình Khánh, thành phố Long Xuyên, tỉnh An Giang
            </span>
          </div>
          <div className='location'>
            <img src={locationIcon} alt='locationIcon' />
            <span>
              Số 1, đường Võ Văn Ngân, phường Linh Chiểu, thành phố Thủ Đức, thành phố Hồ Chí Minh
            </span>
          </div>
          <div className='location'>
            <img src={locationIcon} alt='locationIcon' />
            <span>
              Số 414, đường Huỳnh Văn Bánh, phường 13 , quận Phú Nhuận, thành phố Hồ Chí Minh
            </span>
          </div>
        </div>
      </div>
      <div className='footer-down'>
        <div>
          Giấy CNĐKDN: 0310874914 – Ngày cấp: 25/11/2011 - Cơ quan cấp: Phòng Đăng Ký Kinh Doanh –
          Sở Kế Hoạch và Đầu Tư TP.HCM
        </div>
        <div>
          Địa chỉ đăng ký kinh doanh: 766/3B-3C Sư Vạn Hạnh, Phường 12, Quận 10, TP.HCM - Điện
          thoại: (028) 3868 4857 - Mua hàng: (028) 7307 1441 - Email: cskhLT@gmail.com
        </div>
      </div>
    </div>
  );
};

export default Footer;
