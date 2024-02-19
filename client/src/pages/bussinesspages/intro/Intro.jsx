import React from "react";
import "./style.scss";
import LineFullIcon from "../../assets/icon/lineFullIcon.svg";
import HeartImg from "../../assets/img/intro.png";
import PurposeImg from "../../assets/img/intro-1.png";
import ItemMember from "./components/ItemMember/ItemMember";
import Avatar1 from "../../assets/img/avatar-1.png";
import Avatar2 from "../../assets/img/avatar-2.png";

const Intro = () => {
  return (
    <div className="intro">
      <div className="banner">
        <div className="logo">
          <div>
            <span>LT</span>Handmade
          </div>
        </div>
        <div className="slogan">
          <div>
            <div>Sự tận tuỵ từng đường kim</div>
            <div>Chế tạo giấc mơ, từng mảng một</div>
            <div>Mỗi sản phẩm là một câu chuyện</div>
          </div>
        </div>
      </div>
      <img src={LineFullIcon} alt="line" width="100%" />
      <div className="about">
        <div className="left">
          <div>
            <div className="title">Về LT Handmade</div>
            <div>
              Tại LT Handmade, chúng tôi chắp cánh ước mơ về sự độc đáo và cá
              nhân hóa qua những sản phẩm thủ công tuyệt vời. Từ năm 2016, chúng
              tôi đã mang đến không chỉ những món đồ thủ công, mà còn là sự chất
              lượng và uy tín tại Việt Nam.
            </div>
            <div>
              Chúng tôi tin tưởng rằng sự độc đáo nằm ở từng chi tiết, và với
              tinh thần sáng tạo không ngừng, chúng tôi tạo ra những sản phẩm
              handmade độc đáo, từ trang sức đến đồ trang trí nội thất, đáp ứng
              nhu cầu của các tín đồ yêu thủ công.
            </div>
            <div>
              Sự tận tâm của chúng tôi không chỉ dừng lại ở việc tạo ra những
              sản phẩm tuyệt vời, mà còn trong việc chia sẻ niềm đam mê và kiến
              thức về nghệ thuật thủ công. Chúng tôi mong muốn mỗi sản phẩm của
              chúng tôi không chỉ là một vật dụng, mà còn là một câu chuyện về
              sự tỉ mỉ và tình yêu mà chúng tôi dành cho nghệ thuật thủ công.
            </div>
            <div>
              Hãy đồng hành cùng LT Handmade và khám phá thế giới tuyệt vời của
              những sản phẩm thủ công đầy sáng tạo và ý nghĩa.
            </div>
          </div>
        </div>
        <div className="right">
          <img src={HeartImg} alt="" />
        </div>
      </div>
      <div className="line">
        <hr />
        <div className="circle" />
      </div>
      <div className="purpose">
        <div className="left">
          <img src={PurposeImg} alt="" />
        </div>
        <div className="right">
          <div>
            <div className="title">Tầm nhìn</div>
            <div>
              Tại LT Handmade, chúng tôi tưởng tượng một cộng đồng nơi nghệ nhân
              và đam mê sáng tạo được thăng hoa, nơi mà mỗi sản phẩm thủ công
              không chỉ là một vật dụng mà còn là một tác phẩm nghệ thuật độc
              đáo, tinh tế và gắn kết với trái tim của người tạo ra.
            </div>
            <div className="title">Sứ mệnh</div>
            <div>
              Sứ mệnh của chúng tôi tại LT Handmade là tôn vinh và thúc đẩy nghệ
              thuật thủ công bằng cách tạo ra không gian cho sự sáng tạo và tài
              năng của các nghệ nhân. Chúng tôi cam kết mang đến cho khách hàng
              những sản phẩm thủ công chất lượng cao, không chỉ làm đẹp cho cuộc
              sống hàng ngày mà còn truyền tải câu chuyện và cảm xúc đặc biệt
              từng sản phẩm.
            </div>
            <div className="title">Cộng đồng LT Handmade</div>
            <div>
              LT Handmade không chỉ là nơi để tạo ra sản phẩm thủ công mà còn là
              một cộng đồng đầy đam mê, chia sẻ và hỗ trợ lẫn nhau. Chúng tôi
              mong muốn kết nối các nghệ nhân, người yêu thủ công để họ có thể
              học hỏi, chia sẻ kinh nghiệm và cùng nhau phát triển một cách bền
              vững, làm nên những đổi mới và sức sống mới cho ngành công nghiệp
              thủ công.
            </div>
          </div>
        </div>
      </div>
      <img src={LineFullIcon} alt="line" width="100%" />
      <div className="member">
        <ItemMember
          item={{
            id: "20149058",
            img: Avatar1,
            name: "Lê Minh Tài",
            email: "tailx0913@gmail.com",
            class: "20110CLST5",
          }}
        />
        <ItemMember
          item={{
            id: "20110126",
            img: Avatar2,
            name: "Trần Thị Phương Linh",
            email: "phuonglinhtht321@gmail.com",
            class: "20110CLST4",
          }}
        />
      </div>
    </div>
  );
};

export default Intro;
