<template>
  <view>
  <!--  <view class="search-box">
      <input type="text" class="input" v-model="searchInfo" placeholder="搜索商品" />
      <image src="/static/ic_mall_search@2x.png"  class="img" alt="search" />
      <text class="text" @tap="$toPage('/pages/mall/list?keyword='+searchInfo)">搜索</text>
  </view> -->
    <!-- swiper -->
	<swiper class="swiper-slide" circular :indicator-dots="true" :autoplay="true" :interval="3000" :duration="400"  indicator-active-color="rgba(0,0,0,.8)">
		<swiper-item v-for="(item,index) in swiperSlides" @tap="jumpTo(item.id,item.jumpType,item.jumpDestination,item.name)">
			<view class="swiper-item"><image class="img" :src="item.img" @error="onImageError('swiperSlides',index)"></image></view>
		</swiper-item>
	</swiper>
  <view class="scroll-box">
    <view class="ul">
    	<view class="li" v-for="item in classify" @tap="toList(item.id,item.name)">
    	  <image :src="item.imgUrl" class="img" alt="" />
    	  <view class="text">{{item.name}}</view>
    	</view>
    </view>
  </view>
  <!-- <view class="to-zone">
    <image src="/static/ic_btc_box@2x.png" class="img" alt="loveBird" />
    <image src="/static/ic_love_bird_box@2x.png" class="img" alt="BTC" />
  </view> -->
  <view class="choose-brand">
    <view class="title"><text class="span">精选品牌</text></view>
    <view class="ul">
    	<view class="li" v-for="item in brand" @tap="toBrandId(item.id)">
    	  <image :src="item.imgUrl" class="img" alt="品牌图片" />
    	  <view class="text">{{item.brandName}}</view>
    	</view>
		
    </view>
  </view>
  <view class="choose-brand maybe-like">
    <view class="title"><text class="span">你可能还喜欢</text></view>
    <view class="ul">
      <view class="li" v-for="item in like" @tap="toDetail(item.id)">
        <image :src="item.productLogoUrl" class="img" alt="商品" />
        <view class="text">{{item.productName}}</view>
        <view class="price">
          <image :src="item.currency" class="coin" alt="" /><text class="money">{{item.price}}</text>
        </view>
      </view>
    </view>
  </view>
 
  <toast-model :message="message" verticalAlign="bottom" ref="toast" :duration="3000"></toast-model>
  </view>
</template>

<script>
  export default {
    data() {
      return {
		  message:"",
        swiperSlides: [],
		classify:[],
        brand:[],
        like:[],
		searchInfo:""
      }
    },
	onLoad(option){
		uni.setStorage({
		    key: 'mallType',
		    data: option.type,
		});
		window.mallType=option.type
		this.getIndex()
		this.maybeLike()
	},
    methods: {
		toBrandId(brandId,name){
			this.$toPage(`/pages/mall/list?brandId=${brandId}&name=${name}`)
		},
		toDetail(id){
			this.$toPage(`/pages/mall/detail?id=${id}`)
		},
		toList(classifyId,name){
			this.$toPage(`/pages/mall/list?classifyId=${classifyId}&name=${name}`)
		},
		maybeLike(){
			uni.request({
				url: this.$httpUrl("/app/index/mall/like"),
				data: {
					userId:getApp().globalData.userId,
					p4:"1.0.3",
					p13:"zh",
					pageNum:1,
					pageSize:20,
					currency:window.mallType
				},
				method:"POST",
				header:{
					"content-type":"application/x-www-form-urlencoded",
					token: getApp().globalData.token
				},
				success: (res) => {
					if (res.data.code === 0) {
						var data=res.data.data
						data.forEach((item,i)=>{
							data[i].currency=this.$getCoinImg(item.currency)
							data[i].productLogoUrl=item.productLogoUrl?item.productLogoUrl:'/static/placeholder.png'
						})
						this.like=data
					} else {
						this.message=res.data.msg
						this.$refs.toast.show()
					}
				}
			});
		},
		getIndex(){
			uni.request({
				url: this.$httpUrl("/app/index/mall/indexList"),
				data: {
					p4:"1.0.3",
					p13:"zh"
				},
				method:"POST",
				header:{
					"content-type":"application/x-www-form-urlencoded"
				},
				success: (res) => {
					if (res.data.code === 0) {
						var data=res.data.data
						this.swiperSlides=data.bannerList
						this.classify=data.categoryList
						this.brand=data.brandList
					} else {
						this.message=res.data.msg
						this.$refs.toast.show()
					}
				}
			});
		},
		jumpTo(id,jumpType,jumpDestination,name){
			if(jumpType===1){
				this.$toPage(`/pages/common/externalLink?url=${jumpDestination}&title=${name}`)
			}else if(jumpType===3){
				this.$toPage('/pages/mall/index')
			}
		},
		onImageError(key, index,name) {
			// let path='/static/placeholder.png'
			// if(index&&name){//自定义数组格式
			// 	this[key][index][name] = path;
			// }else if(index){//自定义数组
			// 	this[key][index].img = path;
			// }else{//单个图片
			// 	this[key] = path;
			// }
			this[key][index].img = '/static/placeholder.png';
		},
	}
  }
</script>

<style lang="scss">
@import "../../assets/scss/mall.scss"
</style>