<template>
	<view class="content wrap">
		<sub-nav title="我要充币">
		</sub-nav>
		<view class="row b-b">
			<text class="tit">币种类型</text>
			<view class="input" v-if="resultInfo1.result!=='请选择你要充币的类型'" @tap='toggleTab("selector1")' >{{resultInfo1.result}}</view>
			<view class="input grey" v-else @tap='toggleTab("selector1")' >{{resultInfo1.result}}</view>
			<view class="iconfont">&#xe603;</view>
		</view>
		<view class="row b-b">
			<text class="tit">钱包标签</text>
			<view class="input">{{address}}</view>
		</view>
		<view class="qrcode">
		<image src="/static/ic_remminder_code@2x.png" v-if="!load" class="qrcode" mode=""></image>
		<tki-qrcode
		  ref="qrcode"
		  :val="address"
		  :size="320"
		  unit="upx"
		  :onval="true"
		  :loadMake="true"
						v-if="load"
		   />
		</view>
		<view class="warm-tip">
			温馨提示：<br>
			选择币种类型 > 复制地址 > 去转账；<br>
			请重复确认地址是否正确，否则资产将不可找回；<br>
			当充币到上述地址后，需要整个网络节点的确认；<br>
			请务必确认转账设备终端安全，防止信息被纂改或泄露。<br>
		</view>
		<toast-model :message="message" verticalAlign="bottom" ref="toast" :duration="3000"></toast-model>
		<w-picker
			v-if="countryCode.length!=0&&loadCountryCode"
			mode="selector" 
			@confirm="onConfirm1" 
			ref="selector1" 
			themeColor="#006934"
			:selectList="countryCode"
		></w-picker>
	</view>
</template>

<script>
	import tkiQrcode from "@/components/tki-qrcode/tki-qrcode.vue";
	import wPicker from "@/components/w-picker/w-picker.vue";
	export default {
		data() {
			return {
				load:false,
				address:"",
				countryCode:[],
				countryCodeIndex:0,
				loadCountryCode:false,
				countryCodeNumber:"",
				resultInfo1:{
					result:"请选择你要充币的类型"
				},
				message:"",
				array: ['中国', '美国', '巴西', '日本'],
				index: 0,
				addressData: {
					name: '',
					mobile: '',
					result: '',
					address: '',
					area: '',
					default: false
				}
			}
		},
		components:{
			wPicker,
			tkiQrcode
		},
		onLoad() {
			this.getListCoin()
		},
		methods: {
			onConfirm1(val){
				this.resultInfo1=val;
				this.getBoundAccount()
				this.load=true
			},
			toggleTab(name){
				this.$refs[name].show();
			},
			getBoundAccount(){
				uni.request({
					url: this.$httpUrl("/app/trade/getBoundAccount"),
					data: {
						userId:getApp().globalData.userId,
						coinName:this.resultInfo1.result
					},
					method:"POST",
					header:{
						"content-type":"application/x-www-form-urlencoded",
						token: getApp().globalData.token
					},
					success: (res) => {
						if (res.data.code === 0) {
							var data=res.data.data
							this.address=data.address;
						} else {
							this.message=res.data.msg
							this.$refs.toast.show() 
						}
					}
				});
			},
			getListCoin(){
				uni.request({
					url: this.$httpUrl("/app/trade/listCoin"),
					data: {
						userId:getApp().globalData.userId
					},
					header:{
						"content-type":"application/x-www-form-urlencoded",
						token: getApp().globalData.token
					},
					success: (res) => {
						if (res.data.code === 0) {
							var data=res.data.data
							data.forEach((item,i)=>{
								data[i].label=item.coinName
							})
							this.countryCode=data
							this.loadCountryCode=true;
						} else {
							this.message=res.data.msg
							this.$refs.toast.show() 
						}
					}
				});
			},
			bindPickerChange: function(e) {
			            this.index = e.target.value
			        },
			
			
			//提交
			confirm(){
				let data = this.addressData;
				if(!data.name){
					this.$api.msg('请填写收货人姓名');
					return;
				}
				if(!/(^1[3|4|5|7|8][0-9]{9}$)/.test(data.mobile)){
					this.$api.msg('请输入正确的手机号码');
					return;
				}
				if(!data.address){
					this.$api.msg('请在地图选择所在位置');
					return;
				}
				if(!data.area){
					this.$api.msg('请填写门牌号信息');
					return;
				}
				
				//this.$api.prePage()获取上一页实例，可直接调用上页所有数据和方法，在App.vue定义
				this.$api.prePage().refreshList(data, this.manageType);
				this.$api.msg(`地址${this.manageType=='edit' ? '修改': '添加'}成功`);
				setTimeout(()=>{
					uni.navigateBack()
				}, 800)
			},
		}
	}
</script>

<style lang="scss">
	page{
		background: $page-color-base;
		padding-top: 16rpx;
	}
	.warm-tip{color: #F93737;margin: 0 0 0 78rpx;font-size: 26rpx;
	position: relative;
		&:before{
		position: absolute;	top: 4rpx;left: -40rpx;
		background: url(/static/ic_reminder@2x.png);
		content: '';
		display: block;
		width: 28rpx;height: 28rpx;
		-webkit-background-size: cover;
		background-size: cover;
		}
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
			display: flex;
			align-items: center;
			    word-break: break-all;
			&.grey{color: #999;}
		}
	}
	.qrcode{width: 320rpx;height: 320rpx;display: flex;margin: 38rpx auto 86rpx;}
	.iconfont{    font-size: 54rpx;
	color: #8C8C8C;
	position: absolute;
	top: 28rpx;
	right: 32rpx;pointer-events: none;}
	.ab{position: absolute;
	top: 28rpx;
	right: 32rpx;}
</style>
