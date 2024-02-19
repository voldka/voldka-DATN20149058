const createOrderSuccessFullyMailTemplate = (order) => {
  return `
    <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Đặt Hàng Thành Công</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
      }

      .container {
        width: 80%;
        margin: 20px auto;
        background-color: #fff;
        padding: 20px;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }

      .header {
        text-align: center;
      }

      .logo {
        max-width: 100px;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
      }

      th, td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
        text-transform: capitalize;
      }

      th {
        background-color: #f2f2f2;
      }

      .total {
        margin-top: 20px;
        text-align: right;
      }

      .footer {
        margin-top: 20px;
        text-align: center;
        color: #888;
      }

      .product-image {
        max-width: 120px;
        max-height: 120px;
        object-fit: cover;
      }
    </style>
  </head>
  <body>
    <div id="orderDetails" class="container">
      <div class="header">
        <img class="logo" src="${process.env.HOST_NAME}/images/logo.svg" alt="LT Handmade">
        <h2>LT Handmade</h2>
        <p>Xác Nhận Đơn Hàng</p>
      </div>

      <table>
        <tr>
          <th>Mã Đơn Hàng</th>
          <td>${order.userId}</td>
        </tr>
        <tr>
          <th>Phương Thức Thanh Toán</th>
          <td>${order.paymentMethod}</td>
        </tr>
        <tr>
          <th>Trạng Thái Thanh Toán</th>
          <td>${order.paymentStatus}</td>
        </tr>
        <tr>
          <th>Trạng Thái Giao Hàng</th>
          <td>${order.deliveryStatus}</td>
        </tr>
        <tr>
          <th>Trạng Thái Đơn Hàng</th>
          <td>${order.orderStatus}</td>
        </tr>
      </table>

      <table>
        <tr>
          <td><strong>Tên</strong></td>
          <td>${order.fullName}</td>
        </tr>
        <tr>
          <td><strong>Điện Thoại</strong></td>
          <td>${order.phone}</td>
        </tr>
        <tr>
          <td><strong>Địa Chỉ Giao Hàng</strong></td>
          <td>${order.deliveryAddress}</td>
        </tr>
      </table>

      <table>
        <thead>
          <tr>
            <th>Sản Phẩm</th>
            <th>Tên Sản Phẩm</th>
            <th>Số Lượng</th>
            <th>Giá</th>
            <th>Tổng</th>
          </tr>
        </thead>
        <tbody>
        ${order.products
          .map(
            (product) => `
            <tr>
              <td><img class="product-image" src="${product.image}" alt="${product.productName}"></td>
              <td>${product.productName}</td>
              <td>${product.amount}</td>
              <td>${product.price}</td>
              <td>${product.totalPrice}</td>
            </tr>`,
          )
          .join('')}
        </tbody>
      </table>

      <div class="total">
        <p><strong>Tổng Cộng:</strong> ${order.totalBill} VND</p>
      </div>

      <div class="footer">
        <p>Cảm ơn bạn đã tin tưởng LT - Handmade</p>
      </div>
    </div>
  </body>
  </html>
  `;
};

module.exports = {
  createOrderSuccessFullyMailTemplate,
};
