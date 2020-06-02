<template>
  <view class="wrap wrap-tab" :class="{'yellow-theme':isYellow}">
  	<swiper class="swiper" circular :indicator-dots="true" :autoplay="true" :interval="3000" :duration="400"  indicator-active-color="rgba(0,0,0,.8)">
  		<swiper-item v-for="(item,index) in carousel" @tap="toUrl(item.jumpType,item.jumpDestination)">
  			<view class="swiper-item"><image class="swiper-img" :src="item.img" @error="onImageError('carousel',index)"></image></view>
  		</swiper-item>
		   <!--  -->
  	</swiper>
	<view class="news-top" @tap="toNewsList(classify[0].id)">
		<view class="rela-text">新闻资讯</view><image src="/static/left@2x.png" class="right" mode=""></image>
	</view>
	<div class="scroll-box">
		
	    <view class="ul">
	    	<view class="li" v-for="(item,index) in classify" @tap="toNewsList(item.id)">
	    	  <image :src="item.icon" class="img" @error="onImageError('classify',index)" alt="" />
	    	  <div class="text">{{item.name}}</div>
	    	</view>
	    </view>
	  </div>
	  <view class="news-list">
		  <view class="ul">
		  	<view class="li" v-for="(item,index) in newsList" @tap="toNewsDetail(item.id,item.title)">
				<view class="left">
					<view class="title">{{item.title}}...</view>
					<view class="content">{{item.brief}}</view>
					<view class="time">{{item.publishTime}}</view>
				</view>
				<view class="right">
					<image class="img" :src="item.titleImg" @error="onImageError('newsList',index)"  mode="" ></image>
				</view>
			</view>
		  </view>
	  </view>
	  <!-- <custom-tabbar :index="2+Number(infoType)"></custom-tabbar> -->
	  <toast-model :message="message" verticalAlign="bottom" ref="toast" :duration="3000"></toast-model>
  </view>
</template>

<script>
  export default {
  	data() {
  		return {
			message: '',
			keyword:"",
			newsList:[],
			classify:[],
			earnList:[
				],
			carousel:[],
			infoType:"",
  		}
  	},
	onShow(option) {
		this.infoType=1;
		this.getInitData()
		document.title=this.infoType==0?"资讯":"学院"
	},
	computed:{
		themeIndex(){
			return getApp().globalData.theme;
		},
		isYellow(){
			return this.themeIndex===0
		}
	},
  	methods: {
		toSearchNews(){
			if(this.keyword){
				this.$toPage(`/pages/advisory/newsList?keyword=${this.keyword}&infoType=${this.infoType}`)
			}else{
				this.message="搜索内容不能为空"
				this.$refs.toast.show()
			}
		},
		toUrl(jumpType,jumpDestination,title){
			if(jumpDestination){
			if(jumpType===1){
				this.$toPage('/pages/common/externalLink?url='+jumpDestination)
			}
			}
		},
		toNewsDetail(id,title){
			this.$toPage('/pages/common/externalLink?url='+this.$httpUrl("/app/news/detail?id="+id+"&title="+title))
			// plus.runtime.openURL(this.$httpUrl+"/app/news/detail?id="+id)
		},
		toNewsList(id){
			this.$toPage('/pages/advisory/newsList?id='+id+'&&classify='+JSON.stringify(this.classify))
		},
		getInitData(){
			uni.request({
			    url: this.$httpUrl("/app/news/index"), 
				 data: {
				        infoType: this.infoType
				    },
			    success: (res) => {
			        if(res.data.code===0){
						let data=res.data.data
						this.carousel=data.bannerList
						this.classify=data.newsCategoryList
						this.newsList=data.firstCategoryNewsList
					}else{
						this.message=res.data.msg
						this.$refs.toast.show()
					}
			    }
			});
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
@import "../../assets/scss/advisory.scss"
</style>