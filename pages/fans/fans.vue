<template>
	<view class="wrap">
		<sub-nav title="我的粉丝"></sub-nav>
		<img src="/static/ic_fan_bg@2x.png" alt="" class="my-fans-bg">
	       <div class="fans-edu-wrap">
	            <div class="fans fans-edu clearfix">
	              <div class="li">
	                <span class="number">{{fansList.length}}</span>
	                <div class="info"><image src="/static/ic_fan_me@2x.png" class="all-fans" />总粉丝</div>
	              </div>
	            </div>
	            <div class="fans-list">
	              <div class="li clearfix"  v-for="item in fansList">
	                <image :src="item.heardPortrait" alt="" class="tou" /><!--请求用户头像-->
	                <div class="infomation">
	                  <div class="name">{{item.username}}</div>
	                  <div class="number">{{item.user_number}}</div>
	                </div>
	                <div class="time in-b">{{item.createTime}}</div>
	              </div>
	            </div>
	          </div>
			  <toast-model :message="message" verticalAlign="bottom" ref="toast" :duration="3000"></toast-model>
 	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex';
	export default {
		data() {
			return {
				message:"",
				fansList:[]
			};
		},
		onLoad(option) {
			this.getFans()
		},
		methods: {
			...mapMutations(['addToastInfo']),
			getFans(){
				uni.request({
					url: this.$httpUrl("/app/base/statistics/toReferrerStatistics"),
					data: {
						userId:getApp().globalData.userId,
					},
					method:"POST",
					header:{
						"content-type":"application/x-www-form-urlencoded",
						token: getApp().globalData.token
					},
					success: (res) => {
						if (res.data.code === 0) {
							var data=res.data.data.referrer;
							
							
							data.forEach((item,i)=>{
								var date=new Date(item.register_time)
								var Month=date.getMonth()+1
								 Month=Month<10?"0"+Month:Month
								 var day=date.getDate()<10?"0"+date.getDate():date.getDate()
								data[i].createTime=date.getFullYear()+'-'+Month+'-'+day
								data[i].heardPortrait=item.heard_portrait?item.heard_portrait:"/static/missing-face.jpg"
							})
							this.fansList=data
							console.log(data)
						} else {
							this.message=res.data.msg
							this.$refs.toast.show() 
						}
					}
				});
			},
		}
	};
</script>

<style lang="scss">
	.wrap{background: #fff;}
	.top{
	height:170rpx;
	padding-left: 27rpx;
	}
	.my-fans-bg{position: absolute;top: 52rpx;left: 0;width: 100%;}
	.top .title{font-size: 34rpx;margin:0 0 07rpx 0;padding-top: 22rpx;}
	.top .img{width: 174rpx;height: 159rpx;position: absolute;right: 65rpx;top: 0;}
	.fans {
	  width: 100%;
	  background: #fff;
	}
	
	.fans .li {
	  height: 77rpx;
	  font-size: 27rpx;
	  line-height: 77rpx;
	  text-align: center;
	  max-height: 9999px;position: relative;
	}
	
	.fans .li.active{color: #006934;font-weight: 800;}
	.fans .img {
	  width: 31rpx;
	  margin-right: 5px;
	  display: inline-block;
	  vertical-align: -06rpx;
	}
	.fans .li.active .span{padding: 0 14rpx;display: inline-block;padding: 0 14rpx;height: 74rpx;border-bottom: 03rpx solid #006934;}
	.invite-table{
	  width:100% ;position: relative;
	  
	}
	
	.fans-edu-wrap{padding-top: 17rpx;position: relative;}
	.fans-edu{
	  background: #fff;position: relative;width: 585rpx;margin: 0 auto;box-shadow:0px 5px 10px rgba(51,51,51,0.1);
	opacity:1;
	border-radius:10rpx;
	
	}
	.fans-edu .li{height: auto;}
	.fans-edu .number{display:block;color:$font-color-spec;font-size: 31rpx;line-height: 31rpx;padding-top: 27rpx;padding-bottom: 12rpx;}
	.fans-edu .info{line-height: 34rpx;padding-bottom: 26rpx;}
	.all-fans{margin-right: 1rpx;width: 32rpx;height: 28rpx;vertical-align: -04rpx;}
	.fans-three {margin-top: 12rpx;border-bottom: 17rpx solid rgba(240,240,240,1);}
	.fans-three .li{width:33% ;}
	.fans-three .li:first-child:after{display: none;}
	.fans-list{margin-bottom: 43rpx;    border-top: 20rpx solid #f0f0f0;
    margin-top: 24rpx;
    padding-top: 6rpx;}
	.fans-list .li{padding: 17rpx 27rpx;border-bottom: 1px solid rgba(240,240,240,1);}
	.fans-list .tou{
	  width: 80rpx;
	  height: 80rpx;
	  border-radius: 50%;
	  margin: 0 27rpx 0  ;
	}
	.in-b{vertical-align: top;display: inline-block;}
	.fans-list .infomation{font-size:27rpx;line-height: 38rpx;width: 300rpx;vertical-align: top;display: inline-block;}
	.fans-list .name{font-weight: 800;}
	.fans-list .card{margin-top: 05rpx;font-weight: normal;margin-left: 17rpx;padding: 0 19rpx;height: 27rpx;line-height: 27rpx;border-radius:17rpx;background:rgba(190,201,213,1);color: #fff;text-align: center;}
	.fans-list .time{float: right;margin-top: 17rpx;}
	.fans-list .number{line-height: 34rpx;margin-top: 03rpx;}
	.nodata{
	  text-align: center;
	  margin-top: 1rpx;
	}
	.nodata .img{width: 354rpx;}
	.nodata .text{color: #999;font-size: 34rpx;margin-top: 20rpx;font-weight: normal;}
</style>
