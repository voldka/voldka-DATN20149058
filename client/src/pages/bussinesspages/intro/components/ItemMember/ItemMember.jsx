import React from 'react'
import './style.scss'
const ItemMember = ({ item }) => {
    return (
        <div className='item-member'>
            <div className='id'>{item.id}</div>
            <hr />
            <img src={item.img} alt='' />
            <div className='info'>
                <div>Thành viên</div>
                <div>{item.name}</div>
            </div>
            <div className='contact'>Email: <span>{item.email}</span></div>
            <div className='contact'>Lớp: <span>{item.class}</span></div>
            <hr />
        </div>
    )
}
export default ItemMember