<template>
	<view class="wrap wrap-tab" :class="{'yellow-theme':isYellow}">
		<swiper class="swiper" circular :indicator-dots="true" :autoplay="true" :interval="3000" :duration="400"
		 indicator-active-color="rgba(0,0,0,.8)">
			<swiper-item v-for="(item,index) in carousel" @tap="jumpTo(item.id,item.jumpType,item.jumpDestination,item.name)">
				<view class="swiper-item">
					<image class="swiper-img" :src="item.img" @error="onImageError('carousel',index)"></image>
				</view>
			</swiper-item>
		</swiper>
		<view class="advertising">
			<image src="/static/ic_home_flower@2x.png" class="img" mode=""></image>
			<swiper class="ul" circular :autoplay="true" vertical="true" :interval="5000" :duration="500">
				<swiper-item class="li" v-for="(item,index) in announcementList"  @tap="jumpTo(item.id,item.jumpType,item.jump,item.title,true,item.content)">
					<view class="content">{{item.title}}</view><text class="span">{{item.publishTime}}</text>
					<view class="turn-right iconfont">&#xe603;</view>
				</swiper-item>
			</swiper>
		</view>
		<view class="charge-way" v-for="item in column1">
			<view class="btn-wrap" @tap="toCharge">
				<view class="btn">
					<image :src="item[0]" class="img" mode=""></image><text>充值</text>
				</view>
			</view>
			<view class="line"></view>
			<view class="btn-wrap" @tap="toChangeCoin">
				<view class="btn">
					<image :src="item[1]" class="img" mode=""></image><text>闪兑</text>
				</view>
			</view>
		</view>
		<view class="stage">
			<view class="title"><text class="rela-text">应用场景</text></view>
			<view class="uni-list">
				<view class="uni-list-cell" v-for="item in moduleList" @tap="jumpTo(item.id,item.jumpType,item.jumpDestination,item.name)">
					<image :src="item.img" class="img" mode=""></image>
					<view class="content" >
						<view class="name">{{item.name}}</view>
						<!-- <view class="second-name">{{item.remake}}</view> -->
					</view>
				</view>

			</view>
		</view>
		<view class="context-shadow"  v-if="desc"  @tap="desc=''"></view>
		<swiper class="adv-pic-wrap" circular :indicator-dots="true" :autoplay="true" :interval="3000" :duration="400"
		 indicator-active-color="rgba(0,0,0,.8)">
			<swiper-item v-for="(item,index) in bannerList"  @tap="jumpTo(item.id,item.jumpType,item.jumpDestination,item.name)">
				<image class="swiper-img" :src="item.img" @error="onImageError('bannerList',index)"></image>
			</swiper-item>
		</swiper>
		<view class="bottom-line">
			<!-- <view class="title"><text class="span">我是有底线的</text></view> -->
		</view>
		<view class="alert-choose-box btn-default" :class="{active:desc}" :style="{padding:0,borderRadius: '10rpx',overflow: 'scroll'}">
			<view class="box" :style="{padding:0}">
				<view class="latest-news">{{messageTitle}}</view>
				<view class="text" :style="{padding:'40rpx 20rpx',margin:'0',textAlign:'left'}"><u-parse  :content="desc"  /></view>
			</view>
		</view>
		<!-- <custom-tabbar :index="0"></custom-tabbar> -->
	<toast-model :message="message" verticalAlign="bottom" ref="toast" :duration="3000"></toast-model>
	<toast-model :message="message1" verticalAlign="bottom" ref="toast1" :desc="desc" :duration="3000"></toast-model>
	</view>
</template>

<script>
	import uParse from '@/components/gaoyia-parse/parse.vue'
	import {
		mapState,
		mapMutations
	} from 'vuex';
	
	export default {
		components:{
			uParse
		},
		data() {
			return {
				messageTitle:"",
				desc:"",
				column1:[["/static/ic_assets_icon_money@2x.png","/static/ic_assets_icon_moneyx@2x.png"]],
				message:"",
				message1:"",
				carousel: [],
				moduleList:[],
				bannerList:[],
				buttomAdList:[],
				classify: [],
				announcementList: [],
				earnList: [],
				coinPrice:{
					
				},
				moveIt:false,
				audio:true,
				loadCoin:false
			}
		},
		onShow() {
			if (this.showToastInInit) {
				this.hideToastInfo()
				this.message1 = this.toastInfo;
				setTimeout(this.$refs.toast1.show, 500)
			}
			this.getIndex()//获取主要数据
			if(this.themeIndex!==""){
				this.column1[0]=this.$Theme[this.themeIndex].index.column1
			}
			var innerAudioContext = uni.createInnerAudioContext();
			innerAudioContext.autoplay = true;
			innerAudioContext.src = '/static/audio/interest_remove.mp3';
			innerAudioContext.volume=0
			
		},
		computed: {
			...mapState(['hasLogin', 'userInfo', 'showToastInInit', 'toastInfo']),
			themeIndex(){
				return getApp().globalData.theme;
			},
			isYellow(){
				return this.themeIndex===0
			}
		},
		methods: {
			...mapMutations(['updatePortrait', 'hideToastInfo','login']),
			toChangeCoin(){
				if(this.hasLogin){
					this.$toPage('/pages/index/flash')
				}else{
					this.$toPage('/pages/user/login')
				}
				// this.message="敬请期待"
				// this.$refs.toast.show()
			},
			toCharge(){
				if(this.hasLogin){
					this.$toPage('/pages/index/chargeCoin')
				}else{
					this.$toPage('/pages/user/login')
				}
			},
			jumpTo(id,jumpType,jumpDestination,name,isMessage,desc){
				if(name=="国际自贸专区"){
					this.$toPage(`/pages/mall/index?type=2`)
					return;
				}
				if(name=="区块链游戏"){
					this.$toPage(`/pages/index/gamesLobby`)
					return;
				}
				if(jumpType===1){
					this.$toPage(`/pages/common/externalLink?url=${jumpDestination}&title=${name}`)
				}else if(jumpType===3){
					this.$toPage('/pages/mall/index?type=1')
					// this.message1="敬请期待"
					// this.$refs.toast1.show()
				}else if(jumpType===0){
					if(isMessage){
						this.messageTitle=name;
						this.desc=desc
					}else{
						this.message1="敬请期待"
						this.$refs.toast1.show()
					}
				}else{
					this.message1="敬请期待"
					this.$refs.toast1.show()
				}
			},
			getIndex() {
				uni.request({
					url: this.$httpUrl("/app/index/holdthecode/index"),
					data: {
						userId:this.hasLogin?this.userInfo.id:"",
						version:this.$contextObj.version,
						p13:this.$contextObj.p13
					},
					success: (res) => {
						if (res.data.code === 0) {
							let data=res.data.data
							this.carousel=data.topBannerCapsuleList;
							this.moduleList=data.moduleList
							this.bannerList=data.bannerList
							data.announcementList.forEach((item,i)=>{
								var date=new Date(item.publishTime);
								data.announcementList[i].publishTime=(date.getMonth()+1)+"月"+date.getDate()+"日"
								
							})
							this.announcementList=data.announcementList
							this.buttomAdList=data.buttomAdList
						} else {
							this.message=res.data.msg
							this.$refs.toast.show()
						}
					}
				});
			},
			onImageError(key, index, name) {
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
	@import "../../assets/scss/index.scss";
	
</style>
