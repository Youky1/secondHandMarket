/**
 * pages/main/main.js
 * 进入程序时的默认页面
 */
Page({
    /**
     * 页面的初始数据
     */
    data: {
        goodsData: [],
        sortArray: [
            [
                {index:0, text:'教材书籍', src:'shuji'}, 
                {index:1, text:'水卡票卷', src:'qia'}, 
                {index:2, text:'电子数码', src:'shuma'}, 
                {index:3, text:'生活用品', src:'shenghuoyongpin'}
            ],
            [
                {index:4, text:'衣物服饰', src:'yiwu'}, 
                {index:5, text:'运动健身', src:'jianshen'}, 
                {index:6, text:'代步出行', src:'zxc'}, 
                {index:7, text:'校用电器', src:'dianqi'}
            ],
            [
                {index:8, text:'彩妆护肤', src:'caizhuang'}, 
                {index:9, text:'其他分类', src:'qita'}, 
                {index:10,text:'全部分类', src:'category'}, 
                {index:11,text:'查看求购', src:'icon-beifen'}
            ]
        ],
        sortNameArray:[],
        sortIndex:10, // 正在展示的物品种类，默认为10，表示展示全部物品
        locationArray: ['全部','余家头校区','南湖校区','西院','东院','鉴湖校区'],
        locationIndex: 0, // 正在展示的物品的校区，0表示全部校区
        deltaY: 0, 
        page: 1,
        mainBoxSeen:true, // 首页顶部区域是否可见，初始可见
        currentScrollPosition:0, 
        searchStatus:false, // 当前是否处于搜索状态
        inform:'', // 搜索框输入的内容
        changeSort:'',
    },

    // 绑定搜索框输入
    handleSearchInput(e){
        this.setData({
            inform:e.detail.value
        })
    },

    /**
     * 生命周期函数--监听页面加载
     * 加载物品进行显示
     */
    onShow() {
        // 加载商品，默认情况下按时间排序
        let r = this.requestByTime(1);
        r.then(goodsData => {
            this.setData({
                goodsData,
                sortIndex: 10,
                locationIndex: 0,
            })
        })

        let sortNameArray = [];
        this.data.sortArray.forEach( item => {
            item.forEach( i => {
                sortNameArray.push(i.text)
            })
        });

        this.setData({
            searchStatus:false,
            inform:'',
            sortNameArray
        })
    },

    // 物品显示栏，滚动时判断滚动方向来决定显示或隐藏首部分类区域
    handleScroll(e){
        let p = e.detail.scrollTop;
        // 在向下滑动
        if(p > this.data.currentScrollPosition){
            // 已滑动超过200，隐藏首部区域
            if(p > 200){
                this.setData({
                    currentScrollPosition:p,
                    mainBoxSeen:false
                })
            }
            else{
                this.setData({
                    currentScrollPosition:p,
                })
            }
        }
        // 在向上滑动，且滑动了超过50，显示首部区域
        else if(this.data.currentScrollPosition - p > 50){
            this.setData({
                currentScrollPosition:p,
                mainBoxSeen:true
            })
        }
        wx.createAnimation({})
    },

    // 按时间顺序请求，此时在请求前数据状态回归初始值
    requestByTime(page){
        return new Promise((resolved,rejected) => {
            wx.request({
                url: 'http://123.57.249.95:8090/secondhand/goods/latest',
                data: {
                    page,
                    size: 10,
                },
                success:res =>{
                    let data = res.data.data;
                    if(data && data.length > 0){
                        this.setData({
                            page: page + 1,
                        })
                        resolved(data)
                    }
                    else{
                        wx.showToast({
                            title:'没有更多啦',
                            icon:'none'
                        })
                    }
                }
            })
        })
        
    },

    // 按类别请求
    requestByCat(page,cat){
        return new Promise((resolved,rejected) => {
            wx.request({
                url: 'http://123.57.249.95:8090/secondhand/goods/cat',
                data:{
                    page:page,
                    size:10,
                    cat:cat
                },
                success: res => {
                    let data = res.data.data;
                    if(data && data.length > 0){
                        this.setData({
                            page:page + 1,
                        })
                        resolved(data)
                    }
                    else if(page === 1){
                        wx.showToast({
                            title:'本类别还没有物品哦',
                            icon:'none'
                        })
                        rejected()
                    }
                    else{
                        wx.showToast({
                            title:'没有更多啦',
                            icon:'none'
                        })
                        rejected()
                    }
                }
            })
        })
    },

    // 按校区请求
    requestByLocation(page,area){
        console.log(area);
        return new Promise((resolved,rejected) => {
            wx.request({
                url:'http://123.57.249.95:8090/secondhand/goods/area',
                data:{
                    page:page,
                    size:10,
                    area:area
                },
                success: res => {
                    let data = res.data.data;
                    if(data && data.length > 0){
                        this.setData({
                            page:page + 1
                        })
                        resolved(data)
                    }
                    else if(page === 1){
                        wx.showToast({
                            title:'本校区还没有物品哦',
                            icon:'none'
                        })
                        rejected()
                    }
                    else{
                        wx.showToast({
                            title:'没有更多啦',
                            icon:'none'
                        })
                        rejected()
                    }
                }
            })
        })
    },

    // 按类别和校区请求
    requestByBoth(page,cat,area){
        return new Promise((resolved,rejected) => {
            wx.request({
                url:'http://123.57.249.95:8090/secondhand/goods/catandarea',
                data:{
                    page:page,
                    size:10,
                    cat:cat,
                    area:area
                },
                success: res=>{
                    let data = res.data.data;
                    if(data && data.length > 0){
                        this.setData({
                            page: page + 1
                        })
                        resolved(data);
                    }
                    else{
                        wx.showToast({
                            title:'没有更多啦',
                            icon:'none'
                        })
                        rejected();
                    }
                }
            })
        })
    },

    // 按搜索请求
    requestBySearch(page,inform){
        return new Promise((resolved,rejected) => {
            wx.request({
                url:'http://123.57.249.95:8090/secondhand/goods/search',
                data:{
                    size:10,
                    page,
                    inform
                },
                success:res => {
                    let data = res.data.data;
                    if(data && data.length > 0){
                        this.setData({
                            page: page + 1,
                            searchStatus:true
                        })
                        resolved(data);
                    }
                    else{
                        wx.showToast({
                            title:'找不到该物品哦',
                            icon:'none'
                        })
                        rejected()
                    }
                }
            })
        })
    },

    // 修改要查看的校区，商品页page从1开始
    pickerChange(e) {
        // 在搜索时不支持更改
        if(this.data.searchStatus) return;

        let self = this;
        let index = e.detail.value;
        if(index == 0){ // 选择了全部校区
            if(this.data.sortIndex == 10){ // 按时间排序
                let r = this.requestByTime(1);
                r.then(data => {
                    this.setData({
                        goodsData:data,
                        locationIndex:0
                    })
                })
                
            }
            else{ // 按类别排序
                let r = this.requestByCat(1,this.data.sortIndex + 1)
                r.then(data => {
                    this.setData({
                        goodsData: data,
                        locationIndex: 0
                    })
                })
            }
        }
        else{ // 选择了某个校区
            if(this.data.sortIndex === 10){ // 按校区分类
                let r = this.requestByLocation(1,this.data.locationArray[index]);
                r.then(data => {
                    this.setData({
                        goodsData:data,
                        locationIndex:index
                    })
                })
            }
            else{ // 综合分类
                let r = this.requestByBoth(1,this.data.sortIndex + 1,this.data.locationArray[index]);
                r.then(data => {
                    this.setData({
                        locationIndex:index,
                        goodsData:data
                    })
                })
            }
        }
    },

    // 拉到底后加载商品
    loadingGoods() {
        if(this.data.searchStatus){
            let r = requestBySearch(this.data.page,this.data.inform);
            r.then(data => {
                this.setData({
                    goodsData:this.data.goodsData.concat(data)
                })
            })
        }
        else if(this.data.sortIndex === 10){ // 不按类型分类
            if(this.data.locationIndex === 0){ //按时间分类
                let r = this.requestByTime(this.data.page);
                r.then(goodsData => {
                    this.setData({
                        goodsData:this.data.goodsData.concat(goodsData)
                    })
                })
            }
            else{ // 按校区分类
                let r = this.requestByLocation(this.data.page,this.data.locationArray[this.data.locationIndex]);
                r.then(data => {
                    this.setData({
                        goodsData:this.data.goodsData.concat(data)
                    })
                })
            }
        }
        else{ // 按类型分类
            if(this.data.locationIndex === 0){ // 只按类型分类
                let r = this.requestByCat(this.data.page,this.data.sortIndex + 1);
                r.then(data => {
                    this.setData({
                        goodsData:this.goodsData.concat(data)
                    })
                })
            }
            else{// 同时按校区和类型分类
                let r = this.requestByBoth(this.data.Page,this.data.sortIndex + 1,this.data.locationIndex);
                r.then(data => {
                    this.setData({
                        goodsData:this.data.goodsData.concat(data)
                    })
                })
            }
        }
    },

    /**
     * 按种类查看物品
     * 默认选中全部商品
     * 对同一物品分类再次点击，会选中全部商品
     */
    handleKindChange(e){
        // 在搜索物品时，不支持选择分类
        if(this.data.searchStatus) return;

        let index = e.currentTarget.dataset.index;

        // 点击了同一分类，直接返回
        if(this.data.sortIndex === index)  return; 
        // 展示全部物品
        else if(index === 10){
            let r = this.requestByTime(1)
            r.then( goodsData => {
                this.setData({
                    goodsData,
                    sortIndex:index
                })
            })
        }
        // 跳转至求购页面
        else if(index === 11){
            wx.navigateTo({
                url:'../wishPage/wishPage'
            })
        }
        else // 点击了不同种类，切换种类
        {
            if(this.data.locationIndex === 0){ // 按类型分类
                console.log(`当前请求的分类为cat=${index + 1}`)
                let r = this.requestByCat(1,index + 1);
                r.then( data => {
                    this.setData({
                        goodsData:data,
                        sortIndex:index,
                    })
                })
            }
            else{ // 同时按校区和类别分类
                let r = this.requestByBoth(1,index + 1,this.data.locationArray[this.data.locationIndex]);
                r.then(data => {
                    this.setData({
                        sortIndex:index,
                        goodsData:data,
                    })
                })
            }
        }
        
    },

    // 搜索按钮相应函数
    handleSearch(){
        if(!this.data.inform){
            this.onShow();
            return;
        }
        let r = this.requestBySearch(1,this.data.inform);
        r.then(goodsData => {
            this.setData({
                goodsData
            })
        })
    },

})