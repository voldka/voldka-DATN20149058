import { DeleteOutlined, EditOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Space, Tooltip } from 'antd';
import moment from 'moment';
import React from 'react';
import './styles.scss';

const CommentItem = ({ comment, currentUser, onDelete, onUpdate }) => {
  const handleDeleteComment = () => {
    onDelete(comment._id);
  };

  const handleUpdateComment = () => {
    onUpdate(comment);
  };

  return (
    <>
      <div className='d-flex justify-content-between align-items-center'>
        <div className='d-flex align-items-center justify-content-start'>
          <Avatar src={comment?.user?.avatar} icon={<UserOutlined />} size={48} />
          <div className='ml-3'>
            <h6>{comment?.user?.name}</h6>
            <span>{moment(moment.createdAt).format('HH:ss DD/MM/YYYY')}</span>
          </div>
        </div>
        {(currentUser?.id === comment?.user?._id || currentUser?.isAdmin) && (
          <Space>
            {currentUser?.id === comment.user._id && (
              <Tooltip title='Cập nhật'>
                <Button
                  size='large'
                  type='primary'
                  shape='circle'
                  icon={<EditOutlined />}
                  onClick={handleUpdateComment}
                />
              </Tooltip>
            )}
            <Tooltip title='Xoá'>
              <Button
                danger
                size='large'
                type='primary'
                shape='circle'
                icon={<DeleteOutlined />}
                onClick={handleDeleteComment}
              />
            </Tooltip>
          </Space>
        )}
      </div>
      <p className='mt-2'>{comment.content}</p>
      <br />
    </>
  );
};

export default CommentItem;
