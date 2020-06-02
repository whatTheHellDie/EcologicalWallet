<template>
	<view class="content wrap">
		<sub-nav :title="title">
			<view class="text" @tap="confirm">保存</view>
		</sub-nav>
		<view class="row b-b">
			<text class="tit">账户类型</text>
								<view class="input" @tap='toggleTab("selector")' >{{resultInfo.result}}</view>
			<view class="iconfont">&#xe603;</view>
		</view>
		<view class="row b-b">
			<text class="tit">钱包标签</text>
			<input class="input" type="text" v-model="addressData.type" placeholder="输入标签" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">国家地区</text>
			
								<view class="input" @tap='toggleTab("selector1")' >{{resultInfo1.result}}</view>
			<view class="iconfont">&#xe603;</view>
			
		</view>
		<view class="row b-b">
			<text class="tit">手机号码</text>
			<input class="input" type="number" v-model="addressData.phone" placeholder="请输入手机号" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">短信验证</text>
			<input class="input" type="text" v-model="captcha" placeholder="请输入验证码" placeholder-class="placeholder" />
			<view class="ab msg" v-if="isSendFinish" @tap="getPhoneCaptcha">发送验证码</view>
			<view class="ab msg" v-if="!isSendFinish">{{time}}秒后重发</view>
		</view>
		<view class="row b-b">
			<text class="tit">钱包地址</text>
			<input class="input" type="text" v-model="addressData.walletAddr" placeholder="请输入钱包地址" placeholder-class="placeholder" />
		</view>
		<view class="row default-row">
			<text class="tit">默认地址</text>
			<switch :checked="addressData.isDefault?true:false" color="#fa436a" @change="switchChange" />
		</view>
		<toast-model
		      :message="message"
		      verticalAlign="bottom"
		      ref="toast"
					:duration="3000"
		    ></toast-model>
			<w-picker
				v-if="array.length!=0&&load"
				mode="selector" 
				@confirm="onConfirm" 
				ref="selector" 
				themeColor="#006934"
				:selectList="array"
			></w-picker>
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
	import { mapState,mapMutations } from 'vuex';  
	import wPicker from "@/components/w-picker/w-picker.vue";
	export default {
		components:{
			wPicker,
		},
		data() {
			return {
				time:120,
				isSendFinish:true,
				captcha:"",
				getCaptcha:"",
				countryCodeNumber:"",
				title:"",
				message:"",
				load:false,
				array: [],
				index: 0,
				countryCode:[],
				countryCodeIndex:0,
				loadCountryCode:false,
				addressData: {
					userId:getApp().globalData.userId,
					phone:"",
					walletAddr:"",
					isDefault:1,
					digitalType:"",
					type:"",
				},
				tabIndex:0,
				resultInfo:{
					result:"请选择"
				},
				resultInfo1:{
					result:"中国（86）"
				}
			}
			
		},
		onLoad(option){
			
			if(option.obj){
				this.title="修改数字钱包地址"
				let obj=JSON.parse(option.obj)
				this.addressData=obj
			}else{
				this.title="添加数字钱包地址"
			}
			this.getDigitalTypeList()
			this.getCountryCode()
			
		},
		methods: {
			...mapMutations(['addToastInfo']),
			getPhoneCaptcha(){
				uni.request({
					url: this.$httpUrl("/app/base/pwd/phoneCaptcha"),
					method:"POST",
					data:{
						phone:this.addressData.phone,
						countryCode:this.countryCodeNumber
					},
					header:{
						"content-type":"application/x-www-form-urlencoded",
						"token":getApp().globalData.token
					},
					success: (res) => {
						if (res.data.code === 0) {
							if(res.data.msg=="频繁获取"){
								uni.showModal({
									content: res.data.msg
								});
							}else{
								this.getCaptcha=res.data.captcha
								this.isSendFinish=false;
								let interval=setInterval(()=>{
									if(this.time&&this.time>0){
										this.time--;
									}else{
										clearInterval(interval)
										this.time=120
										this.isSendFinish=true;
									}
								},1000)
							}
						} else {
							this.message=res.data.msg
							this.$refs.toast.show() 
						}
					}
				});
			},
			confirm(){
				
				let data = this.addressData;
				if(!data.digitalType){
					this.message="请选择账户类型"
					this.$refs.toast.show()
					return;
				}
				if(!data.type){
					this.message="标签不能为空"
					this.$refs.toast.show()
					return;
				}
				if(!/(^1[3|4|5|7|8][0-9]{9}$)/.test(data.phone)){
					this.message="手机号码格式不正确"
					this.$refs.toast.show()
					return;
				}
				if(!this.captcha){
					this.message="验证码不能为空"
					this.$refs.toast.show()
					return;
				}
				if(this.captcha!=this.getCaptcha&&this.title!="修改数字钱包地址"){
					this.message="验证码错误"
					this.$refs.toast.show()
					return;
				}
				if(!data.walletAddr){
					this.message="请输入验证码"
					this.$refs.toast.show()
					return;
				}
				if(!data.walletAddr){
					this.message="钱包地址不能为空"
					this.$refs.toast.show()
					return;
				}
				
				if(this.title=="修改数字钱包地址"){
					uni.showLoading({
						title: '加载中',
						mask: true
					});
					//修改地址
					uni.request({
						url: this.$httpUrl("/app/digitwallet/update"),
						method:"POST",
						data:{
							id:this.addressData.id,
							smsCode:this.countryCodeNumber,
							phone:this.addressData.phone,
							captcha:this.captcha,
							digitalType:this.addressData.digitalType,
							walletAddr:this.addressData.walletAddr,
							type:this.addressData.type,
							isDefault:this.addressData.isDefault
						},
						header:{
							"content-type":"application/x-www-form-urlencoded",
							token: getApp().globalData.token
						},
						success: (res) => {
							uni.hideLoading();
							if (res.data.code === 0) {
								this.addToastInfo("修改地址成功")
								this.$back()
							} else {
								this.message=res.data.msg
								this.$refs.toast.show() 
							}
						}
					});
				}else{
					uni.showLoading({
						title: '加载中',
						mask: true
					});
					// 新增地址
					uni.request({
						url: this.$httpUrl("/app/digitwallet/add"),
						method:"POST",
						data:this.addressData,
						header:{
							"content-type":"application/x-www-form-urlencoded",
							token: getApp().globalData.token
						},
						success: (res) => {
							uni.hideLoading();
							if (res.data.code === 0) {
								this.addToastInfo("新增地址成功")
								this.$back()
							} else {
								this.message=res.data.msg
								this.$refs.toast.show() 
							}
						}
					});
				}
			},
			toggleTab(name){
				this.$refs[name].show();
			},
			onConfirm1(val){
				this.countryCodeNumber=val.checkArr.code
				this.resultInfo1=val;
			},
			onConfirm(val){
				this.addressData.digitalType=val.checkArr.valueId
				this.resultInfo=val;
			},
			getCountryCode(){
				uni.request({
					url: this.$httpUrl("/app/countryCode"),
					header:{
						"content-type":"application/x-www-form-urlencoded"
					},
					success: (res) => {
						if (res.data.code === 0) {
							var data=res.data.data
							data.forEach((item,i)=>{
								data[i].label=item.name+`(${item.code})`
							})
							this.countryCode=data
							if(this.addressData.digitalType!==""){
								this.countryCode.forEach((item,i)=>{
									if(item.valueId==this.addressData.digitalType){
										this.resultInfo.result=item.name
									}
								})
							}
							this.loadCountryCode=true;
						} else {
							this.message=res.data.msg
							this.$refs.toast.show() 
						}
					}
				});
			},
			getDigitalTypeList(){
				uni.request({
					url: this.$httpUrl("/app/digitwallet/digitalTypeList"),
					header:{
						"content-type":"application/x-www-form-urlencoded"
					},
					success: (res) => {
						if (res.data.code === 0) {
							var data=res.data.data
							data.forEach((item,i)=>{
								data[i].value=item.valueId
								data[i].label=item.name
							})
							
							this.array=data
							if(this.addressData.digitalType!==""){
								this.array.forEach((item,i)=>{
									if(item.valueId==this.addressData.digitalType){
										this.resultInfo.result=item.name
									}
								})
							}
							this.load=true
						} else {
							this.message=res.data.msg
							this.$refs.toast.show() 
						}
					}
				});
			},
			switchChange(){
				this.addressData.isDefault=this.addressData.isDefault==0?1:0;
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
			display: flex;
			align-items: center;
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
		width: 690rpx;
		height: 80rpx;
		margin: 60rpx auto;
		font-size: $font-lg;
		color: #fff;
		background:$font-color-spec;
		border-radius: 50rpx;
	}
	.change-address{
		width: 100%;
		height: 110rpx;
		display: flex;
		align-items: center;
	}
	.textarea{width: 100%;height: 100%;padding-top: 10rpx;}
	.iconfont{    font-size: 54rpx;
	color: #8C8C8C;
	position: absolute;
	top: 28rpx;
	right: 32rpx;pointer-events: none;}
	
</style>
