<template>
	<view class="content wrap">
		<sub-nav title="实名认证">
		</sub-nav>
		<view class="row b-b">
			<text class="tit">真实姓名</text>
			<input class="input" type="text" v-model="obj.realName"  placeholder="姓名" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">身份证号</text>
			<input class="input" type="text" v-model="obj.idCard" placeholder="请输入身份证号" placeholder-class="placeholder" />
		</view>
		<view class="upload-box">
			<view class="title">身份证正面</view>
			<view class="verified" @tap="chooseImg(1)">
				<image :src="img1" class="img"  mode=""></image>
				<image src="/static/ic_photo@2x.png" v-if="!obj.idCardFront" class="logo" mode=""></image>
			</view>
		</view>
		<view class="upload-box">
			<view class="title">身份证背面</view>
			<view class="verified" @tap="chooseImg(2)">
				<image :src="img2" class="img"  mode=""></image>
				<image src="/static/ic_photo@2x.png" v-if="!obj.idCardReverse" class="logo" mode=""></image>
			</view>
		</view>
		<view class="upload-box">
			<view class="title">手持身份证</view>
			<view class="verified" @tap="chooseImg(3)">
				<image :src="img3" class="img"  mode=""></image>
				<image src="/static/ic_photo@2x.png" v-if="!obj.idCardOverall" class="logo" mode=""></image>
			</view>
		</view>
		<view class="tip">
			为确保身份验证审核顺利通过，请上传图片时避免
			出现以下问题：<br>
			1. 身份证正、反面图片显示不全；
			2. 身份证正、反面证件信息模糊不清，无法识别；
			3. 手持证件照和人物背景模糊，内容无法识别；
			4. 输入的证件号与上传的证件号不一致；
			5. 证件有效期已过期；
			6. 证件上传成功后，于2小时内审核完成；
		</view>
		<view class="add-btn" @tap="confirm">提交</view>
		<toast-model :message="message" verticalAlign="bottom" ref="toast" :duration="3000"></toast-model>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				message:"",
				img1:"/static/ic_identity_up@2x.png",
				img2:"/static/ic_identity_down@2x.png",
				img3:"/static/ic_identity_white_photo@2x.png",
				obj:{
					idCard: "",
					idCardFront: "",
					idCardOverall: "",
					idCardReverse: "",
					idCardstatus: "",
					realName: "",
					reason: ""
				}
			}
		},
		onLoad(option){
			this.obj=JSON.parse(option.obj)
			if(this.obj.idCardstatus!=0){
			this.img1=this.obj.idCardFront;
			this.img2=this.obj.idCardOverall,
			this.img3=this.obj.idCardReverse
			}
		},
		methods: {
			confirm(){
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				uni.request({
					url: this.$httpUrl("/app/identity/personalInfoUploadDedicated"),
					data: {
						userId:getApp().globalData.userId,
						realName:this.obj.realName,
						idCard:this.obj.idCard,
						cardFront:this.obj.idCardFront,
						cardReverse:this.obj.idCardReverse,
						cardOverall:this.obj.idCardOverall,
						nationality:0
					},
					method:"POST",
					header:{
						"content-type":"application/x-www-form-urlencoded",
						token: getApp().globalData.token
					},
					success: (res) => {
						uni.hideLoading();
						if (res.data.code == 0) {
							uni.redirectTo({url:"/pages/user/set"})
						} else {
							this.message=res.data.msg
							this.$refs.toast.show() 
						}
					}
				});
			},
			chooseImg(index){
				uni.chooseImage({
				    success: (chooseImageRes) => {
				        const tempFilePaths = chooseImageRes.tempFilePaths;
						uni.showLoading({
							title: '上传中',
							mask: true
						});
				        uni.uploadFile({
				            url: this.$httpUrl("/app/base/files/filesUpload"), //仅为示例，非真实的接口地址
				            filePath: tempFilePaths[0],
				            name: 'file',
				            success: (uploadFileRes) => {
								uni.hideLoading();
								var data=JSON.parse(uploadFileRes.data)
								this["img"+index]=data.data.picUrls[0]
				            }
				        });
				    }
				});
			},
			
		},
		watch:{
			img1(val){
				this.obj.idCardFront=val
			},
			img2(val){
				this.obj.idCardReverse=val
			},
			img3(val){
				this.obj.idCardOverall=val
			},
		}
	}
</script>

<style lang="scss">
	page{
		background: $page-color-base;
		padding-top: 16rpx;
	}

	.row{
		display: flex;
		align-items: center;
		position: relative;
		padding:0 30rpx;
		height: 110rpx;
		background: #fff;
		
		.tit{
			flex-shrink: 0;
			width: 200rpx;
			font-size: 30rpx;
			color: $font-color-dark;
			    height: 100%;
			    align-items: center;
			    display: flex;
		}
		.input{
			flex: 1;
			font-size: 30rpx;
			color: $font-color-dark;
			height: 100%;
		}
	}
	.default-row{
		margin-top: 16rpx;
		.tit{
			flex: 1;
		}
		switch{
			transform: translateX(16rpx) scale(.9);
		}
	}
	.add-btn{
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 88rpx;
		font-size: $font-lg;
		color: #fff;
		background:#006934;
	}
	.tip{color: $font-color-red;margin: 40rpx 64rpx 36rpx;}
	.upload-box{padding:  32rpx;
		.verified{position: relative;}
		.img{width: 638rpx;height: 336rpx;display: block;margin: 20rpx auto 0;}
		.logo{width: 128rpx;height: 128rpx;position: absolute;top: 108rpx;left: 280rpx;}
	}
</style>
