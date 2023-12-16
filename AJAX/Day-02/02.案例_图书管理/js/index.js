/**
 * 目标1：渲染图书列表
 *  1.1 获取数据
 *  1.2 渲染数据
 */

//封装获取并渲染图书列表函数
const creator = '渣渣盟'
function getBookLst() {
    //获取数据
    axios({
        url: 'http://hmajax.itheima.net/api/books',
        params: {
            creator
        }
    }).then(result => {
        //console.log(result);
        const bookList = result.data.data
        //console.log(bookList);
        //渲染数据
        const htmlStr = bookList.map((item, index) => {
            return `
                <tr>
                <td>${index + 1}</td>
                <td>${item.bookname}</td>
                <td>${item.author}</td>
                <td>${item.publisher}</td>
                <td data-id=${item.id}>
                    <span class="del">删除</span>
                    <span class="edit">编辑</span>
                </td>
                </tr>
            `
        }).join('')
        //console.log(htmlStr);
        document.querySelector('.list').innerHTML = htmlStr
    })
}

getBookLst()

/**
 * 新增图书
 * 新增弹框->显示和隐藏
 * 收集表单数据->提交到服务器
 * 刷新图书列表
 */
//创建弹框对象
const addModal = new bootstrap.Modal(document.querySelector('.add-modal'))
//绑定保存点击事件
document.querySelector('.add-btn').addEventListener('click', () => {
    //收集表单数据
    const bookObj = serialize(document.querySelector('.add-form'), { hash: true, empty: true })
    //console.log(bookObj)
    //数据写入服务器
    axios({
        url: 'http://hmajax.itheima.net/api/books',
        method: 'post',
        data: {
            // bookname: bookObj.bookname,
            // author: bookObj.author,
            // publisher: bookObj.publisher,
            ...bookObj,
            creator
        }
    }).then(result => {
        //console.log(result);
        //刷新数据
        getBookLst()
        //重置表单
        document.querySelector('.add-form').reset()
        //关闭弹窗
        addModal.hide()
    }).catch(err => {
        console.log(err);
    })
})

/**
 * 删除图书
 * 绑定点击事件->获取图书ID
 * 调用删除接口
 * 刷新图书列表
 */

//删除元素->点击（动态元素，使用事件委托）
document.querySelector('.list').addEventListener('click', e => {
    //获取触发事件目标元素
    //console.log(e.target);
    //判断点击的是删除元素
    if (e.target.classList.contains('del')) {
        //获取图书ID（自定义属性ID）
        const theId = e.target.parentNode.dataset.id
        //console.log(theId);

        //调用删除接口
        axios({
            url: `http://hmajax.itheima.net/api/books/${theId}`,
            method: 'delete'
        }).then(() => {
            //刷新数据
            getBookLst()
        })
    }
})


/**
 * 编辑图书
 * 新增弹框->显示和隐藏
 * 表单回显->提交到服务器
 * 刷新图书列表
 */

//新增弹框
const editModal = new bootstrap.Modal(document.querySelector('.edit-modal'))
//显示弹框
document.querySelector('.list').addEventListener('click', e => {
    //判断是否为编辑
    if (e.target.classList.contains('edit')) {
        //获取数据
        const theID = e.target.parentNode.dataset.id
        axios({
            url: `http://hmajax.itheima.net/api/books/${theID}`
        }).then(result => {
            //console.log(result.data.data);
            const bookObj = result.data.data
            //表单回显
            const keys = Object.keys(bookObj)   // ['id', 'bookname', 'author', 'publisher']
            keys.forEach(key => {
                //填充数据
                document.querySelector(`.edit-form .${key}`).value = bookObj[key]
            })
        })
        editModal.show()
    }
})
//隐藏弹框
document.querySelector('.edit-btn').addEventListener('click', () => {
    //收集数据
    const editFrom = document.querySelector('.edit-form')
    const { id, bookname, author, publisher } = serialize(editFrom, { hash: true, empty: true })
    //上传服务器
    axios({
        url: `http://hmajax.itheima.net/api/books/${id}`,
        method: 'put',
        data: { bookname, author, publisher, creator }
    }).then(result => getBookLst()).catch(err => console.log(err))
    //隐藏弹框
    editModal.hide()
})