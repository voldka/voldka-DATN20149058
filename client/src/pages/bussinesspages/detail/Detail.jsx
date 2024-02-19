import { ShoppingCartOutlined } from '@ant-design/icons';
import { Button, Carousel, Empty, Form, InputNumber, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import ProductCard from '../../core/components/product-card';
import CommentsService from '../../shared/services/comments.service';
import { productService } from '../../shared/services/products.service';
import { actions, selectors } from '../../stores';
import CommentItem from './comment-item/CommentItem';
import Comment from './comments/Comments';
import './style.scss';

const contentStyle = {
  display: 'block',
  height: '600px',
  width: '100%',
  objectFit: 'contain',
};

const chunkArray = (array, size) => {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, index) =>
    array.slice(index * size, (index + 1) * size),
  );
};

const Detail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [comments, setComments] = useState([]);
  const [relevantProducts, setRelevantProducts] = useState([]);
  const userInfo = useSelector(selectors.selectUserInfo);
  const navigate = useNavigate();

  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useDispatch();

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      amount: 1,
    },
  });

  const getProductDetail = async () => {
    try {
      dispatch(actions.showLoading());
      const product = await productService.getProductById(id);
      setProduct(product);
    } catch (error) {
      messageApi.error(error?.response?.data?.message || error.message);
    } finally {
      dispatch(actions.hideLoading());
    }
  };

  const getRelevantProducts = async () => {
    try {
      dispatch(actions.showLoading());
      const relevantProducts = await productService.getRelevantProducts(id);
      setRelevantProducts(relevantProducts);
    } catch (error) {
      messageApi.error(error?.response?.data?.message || error.message);
    } finally {
      dispatch(actions.hideLoading());
    }
  };

  const getCommentsOfProduct = async () => {
    try {
      dispatch(actions.showLoading());
      const comments = await CommentsService.getCommentsByProductId(id);
      setComments(comments);
    } catch (error) {
      messageApi.error(error?.response?.data?.message || error.message);
    } finally {
      dispatch(actions.hideLoading());
    }
  };

  const handleAddToCart = async (formValue) => {
    if (!userInfo) {
      localStorage.setItem('backToUrl', window.location.pathname);
      messageApi.warning('Bạn chưa đăng nhập');
      return navigate('/dang-nhap');
    }
    const payload = [
      {
        productId: product._id,
        amount: formValue.amount,
        image: product?.image[0],
      },
    ];
    const res = await dispatch(actions.addProductToCart(userInfo.id, payload));
    if (res) {
      messageApi.success('Đã thêm sản phẩm vào giỏ hàng');
      reset({ amount: 1 });
    }
  };

  const handleAddComment = async (formValue) => {
    try {
      dispatch(actions.showLoading());
      await CommentsService.create({
        productId: product._id,
        userId: userInfo.id,
        content: formValue.content,
      });
      getCommentsOfProduct();
    } catch (error) {
      messageApi.error(error?.response?.data?.message || error.message);
    } finally {
      dispatch(actions.hideLoading());
    }
  };

  const handleUpdateComment = async (comment) => {
    const { value: text, isConfirmed } = await Swal.fire({
      input: 'textarea',
      inputValue: comment.content,
      inputLabel: 'Nhận xét',
      inputPlaceholder: 'Nhận xét sản phẩm',
      showCancelButton: true,
      cancelButtonText: 'Đóng',
      confirmButtonText: 'Cập nhật',
      inputValidator: (value) => {
        if (!value.trim()) {
          return 'Không được để trống';
        }
      },
    });
    if (isConfirmed) {
      try {
        dispatch(actions.showLoading());
        await CommentsService.update(comment._id, { content: text });
        getCommentsOfProduct();
      } catch (error) {
        messageApi.error(error?.response?.data?.message || error.message);
      } finally {
        dispatch(actions.hideLoading());
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      dispatch(actions.showLoading());
      await CommentsService.remove(commentId);
      getCommentsOfProduct();
    } catch (error) {
      messageApi.error(error?.response?.data?.message || error.message);
    } finally {
      dispatch(actions.hideLoading());
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    getProductDetail();
    getRelevantProducts();
    getCommentsOfProduct();
  }, [id]);

  return (
    <>
      {contextHolder}
      <div className='container-fluid p-5'>
        {product ? (
          <>
            <div className='row'>
              <div className='col-md-6 col-xs-12'>
                <Carousel autoplay className='bg-light'>
                  {product.image.map((imageUrl) => (
                    <div key={imageUrl}>
                      <img style={contentStyle} src={imageUrl} alt='Carousel' />
                    </div>
                  ))}
                </Carousel>
              </div>
              <div className='col-md-6 col-xs-12'>
                <h1>{product.name}</h1>
                <hr />
                <div className='detail-item'>
                  <span className='detail-item-title'>Loại sản phẩm: </span>
                  <span>{product.type.name}</span>
                </div>
                <div className='detail-item'>
                  <span className='detail-item-title'>Số lượng còn lại: </span>
                  <span>{product.countInStock}</span>
                </div>
                <div className='detail-item'>
                  <span className='detail-item-title'>Giá: </span>
                  <NumericFormat value={product.price} displayType='text' thousandSeparator=',' />
                </div>
                <Form layout='vertical' onFinish={handleSubmit(handleAddToCart)}>
                  <div className='d-flex'>
                    <Form.Item
                      label='Số lượng'
                      validateStatus={errors && errors.amount ? 'error' : ''}
                      help={errors && errors.amount && errors.amount.message}
                      className='my-3'>
                      <Controller
                        name='amount'
                        control={control}
                        rules={{
                          required: 'Vui lòng nhập số lượng',
                          validate: (value) => {
                            if (!value || +value < 1) {
                              return 'Số lượng phải lớn hơn 0';
                            }
                          },
                        }}
                        render={({ field }) => (
                          <InputNumber {...field} size='large' min={1} max={product.countInStock} />
                        )}
                      />
                    </Form.Item>
                    <Button
                      size='large'
                      icon={<ShoppingCartOutlined />}
                      type='primary'
                      className='ml-3'
                      style={{ alignSelf: 'center', marginTop: 28 }}
                      htmlType='submit'>
                      Thêm vào giỏ hàng
                    </Button>
                  </div>
                </Form>
              </div>
            </div>
            <div className='py-4'>
              <h3 className='text-uppercase'>mô tả sản phẩm</h3>
              <hr />
              <p>{product.description}</p>
            </div>
            <div className='py-4'>
              <h3 className='text-uppercase'>các sản phẩm liên quan</h3>
              <hr />
              <div className='py-2'>
                <Carousel autoplay autoplaySpeed={5000}>
                  {chunkArray(relevantProducts, 4).map((productSet, index) => (
                    <div className='list-relevant-products' key={index}>
                      {productSet.map((product) => (
                        <div className='list-relevant-item' key={product._id}>
                          <ProductCard key={product._id} product={product} />
                        </div>
                      ))}
                    </div>
                  ))}
                </Carousel>
              </div>
            </div>
            <div className='py-4'>
              <h3 className='text-uppercase'>bình luận</h3>
              <hr />
              {userInfo && (
                <>
                  <Comment onAddComment={handleAddComment} />
                </>
              )}
              {comments && comments.length ? (
                <div className='pt-4'>
                  {comments.map((comment) => (
                    <CommentItem
                      key={comment._id}
                      comment={comment}
                      currentUser={userInfo}
                      onDelete={handleDeleteComment}
                      onUpdate={handleUpdateComment}
                    />
                  ))}
                </div>
              ) : (
                <div className='text-center'>
                  <Empty description='Chưa có bình luận' />
                </div>
              )}
            </div>
          </>
        ) : (
          <div>
            <Empty description='Không tìm thấy sản phẩm này' />
          </div>
        )}
      </div>
    </>
  );
};

export default Detail;
