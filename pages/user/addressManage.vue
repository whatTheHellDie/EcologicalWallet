<template>
	<view class="content wrap">
		<sub-nav :title="title"></sub-nav>
		<view class="row b-b">
			<text class="tit">收货人</text>
			<input class="input" type="text" v-model="addressData.receiptMan" placeholder="姓名" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">手机号</text>
			<input class="input" type="number" v-model="addressData.phone" placeholder="输入手机号码" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">所在地区</text>
			<view class="change-address">
				<!-- <picker v-if="load" class="change-address" mode="multiSelector" @columnchange="bindMultiPickerColumnChange" :value="multiIndex" :range="multiArray" range-key="name">
				<view class="uni-input">{{multiArray[0][multiIndex[0]]?multiArray[0][multiIndex[0]].name:""}}{{multiArray[1][multiIndex[1]]?multiArray[1][multiIndex[1]].name:""}}{{multiArray[2][multiIndex[2]]?multiArray[2][multiIndex[2]].name:""}}</view>
			</picker> -->
				<view @tap="toggleTab()" class="change-address">{{ result }}</view>
			</view>
			<view class="iconfont">&#xe603;</view>
		</view>
		<view class="row b-b">
			<text class="tit">详细地址</text>
			<textarea class="textarea" v-model="addressData.address" placeholder="如道路、门牌号、小区、楼栋号、单元室等" />
		</view>

		<view class="row default-row">
			<text class="tit">默认收货地址</text>
			<switch color="#fba305" checked="true" @change="switchChange" />
		</view>
		<view class="add-btn" @tap="confirm">保存</view>
		<toast-model :message="message" verticalAlign="bottom" ref="toast" :duration="3000"></toast-model>
		<w-picker mode="region" :areaCode="defaultCode"  @confirm="onConfirm" ref="region" themeColor="#006934"></w-picker>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import wPicker from '@/components/w-picker/w-picker.vue';

export default {
	data() {
		return {
			defaultCode:["11", "1101", "110105"],
			result:'',
			title: '',
			message: '',
			array: [],
			multiIndex: [0, 0, 0],
			multiArray: [[], [], []],
			addressData: {
				userId: getApp().globalData.userId,
				receiptMan: '',
				phone: '',
				address: '',
				provinceCode: '110000',
				cityCode: '',
				districtCode: '',
				isDefault: 1
			},
			load: false
		};
	},
	components: {
		wPicker
	},
	onLoad(option) {
		if (option.obj) {
			let obj = JSON.parse(option.obj);
			this.addressData = obj;
			this.title = '修改收货地址';
			this.setAddress();
		} else {
			this.title = '添加收货地址';
			// this.getRegionalList();
		}
	},
	methods: {
		...mapMutations(['addToastInfo']),
		toggleTab() {
			this.$refs['region'].show();
		},
		onConfirm(val) {
			
			//如果页面需要调用多个mode类型，可以根据mode处理结果渲染到哪里;
			this.result = val.result;
			this.addressData.provinceCode = (val.checkValue[0]*10000).toString()
				this.addressData.cityCode = (val.checkValue[1]*100).toString()
				this.addressData.districtCode = (val.checkValue[2]).toString()
		},

		//提交
		confirm() {
			let data = this.addressData;
			if (!data.receiptMan) {
				this.message = '收货人不能为空';
				this.$refs.toast.show();
				return;
			}
			if (!/(^1[3|4|5|7|8][0-9]{9}$)/.test(data.phone)) {
				this.message = '手机号码格式不正确';
				this.$refs.toast.show();
				return;
			}
			if (!data.address) {
				this.message = '详细地址不能为空';
				this.$refs.toast.show();
				return;
			}
			if (this.title != '添加收货地址') {
				//修改地址
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				uni.request({
					url: this.$httpUrl('/app/shippingAddr/addORupdate'),
					method: 'POST',
					data: {
						id: this.addressData.id,
						userId: getApp().globalData.userId,
						receiptMan: this.addressData.receiptMan,
						phone: this.addressData.phone,
						address: this.addressData.address,
						provinceCode: this.addressData.provinceCode,
						cityCode: this.addressData.cityCode,
						districtCode: this.addressData.districtCode,
						isDefault: this.addressData.isDefault
					},
					header: {
						'content-type': 'application/x-www-form-urlencoded',
						token: getApp().globalData.token
					},
					success: res => {
						uni.hideLoading();
						if (res.data.code === 0) {
							this.addToastInfo('修改地址成功');
							this.$back();
						} else {
							this.message = res.data.msg;
							this.$refs.toast.show();
						}
					}
				});
			} else {
				// 新增地址
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				uni.request({
					url: this.$httpUrl('/app/shippingAddr/addORupdate'),
					method: 'POST',
					data: this.addressData,
					header: {
						'content-type': 'application/x-www-form-urlencoded',
						token: getApp().globalData.token
					},
					success: res => {
						uni.hideLoading();
						if (res.data.code === 0) {
							this.addToastInfo('新增地址成功');
							this.$back();
						} else {
							this.message = res.data.msg;
							this.$refs.toast.show();
						}
					}
				});
			}
		},
		setAddress() {
			var code=[(this.addressData.provinceCode/10000).toString(),(this.addressData.cityCode/100).toString(),(this.addressData.districtCode/1).toString()];
			this.defaultCode=code
			var data=this.addressData
			this.result=data.provinceName+data.cityName+data.districtName
			// uni.request({
			// 	url: this.$httpUrl('/app/index/Anjoy/regionalList'),
			// 	method: 'POST',
			// 	header: {
			// 		'content-type': 'application/x-www-form-urlencoded'
			// 	},
			// 	success: res => {
			// 		if (res.data.code === 0) {
			// 			var data = res.data.data;
			// 			this.multiArray[0] = data;
			// 			for (let i = 0; i < data.length; i++) {
			// 				if (data[i].name == this.addressData.provinceName) {
			// 					this.addressData.provinceCode = data[i].code;
			// 					this.multiIndex[0] = i;
			// 					this.multiArray[1] = this.multiArray[0][this.multiIndex[0]].cityList;
			// 					for (let x = 0; x < this.multiArray[1].length; x++) {
			// 						if (this.multiArray[1][x].name == this.addressData.cityName) {
			// 							this.addressData.cityCode = this.multiArray[1][x].code;
			// 							this.multiIndex[1] = x;
			// 							this.multiArray[2] = this.multiArray[1][this.multiIndex[1]].countyList;
			// 							for (let y = 0; y < this.multiArray[2].length; y++) {
			// 								if (this.multiArray[2][y].name == this.addressData.districtName) {
			// 									this.addressData.districtCode = this.multiArray[2][y].code;
			// 									this.multiIndex[2] = y;
			// 									this.load = true;
			// 									return;
			// 								}
			// 							}
			// 						}
			// 					}
			// 				}
			// 			}
			// 		} else {
			// 			this.message = res.data.msg;
			// 			this.$refs.toast.show();
			// 		}
			// 	}
			// });
		},
		// getRegionalList() {
		// 	uni.request({
		// 		url: this.$httpUrl('/app/index/Anjoy/regionalList'),
		// 		method: 'POST',
		// 		header: {
		// 			'content-type': 'application/x-www-form-urlencoded'
		// 		},
		// 		success: res => {
		// 			if (res.data.code === 0) {
		// 				var data = res.data.data;
		// 				this.multiArray[0] = data;
		// 				this.multiArray[1] = this.multiArray[0][0].cityList;
		// 				this.multiArray[2] = this.multiArray[1][0].countyList;
		// 				this.load = true;
		// 				this.updateZone();
		// 			} else {
		// 				this.message = res.data.msg;
		// 				this.$refs.toast.show();
		// 			}
		// 		}
		// 	});
		// },
		// updateZone() {
		// 	this.addressData.provinceCode = this.multiArray[0][this.multiIndex[0]].code;
		// 	this.addressData.cityCode = this.multiArray[1][this.multiIndex[1]].code;
		// 	this.addressData.districtCode = this.multiArray[2][this.multiIndex[2]].code;
		// },
		bindMultiPickerColumnChange: function(e) {
			this.multiIndex[e.detail.column] = e.detail.value;
			switch (e.detail.column) {
				case 0: //拖动第1列
					this.multiArray[1] = this.multiArray[0][this.multiIndex[0]].cityList;
					this.multiArray[2] = this.multiArray[1][this.multiIndex[1]].countyList;
					this.updateZone();
					break;
				case 1: //拖动第2列
					this.multiArray[2] = this.multiArray[1][this.multiIndex[1]].countyList;
					this.addressData.cityCode = this.multiArray[1][this.multiIndex[1]].code;
					this.updateZone();
					break;
				case 2: //拖动第3列
					this.addressData.districtCode = this.multiArray[2][this.multiIndex[2]].code;
					this.updateZone();
			}
			this.$forceUpdate();
		},
		switchChange() {
			this.addressData.isDefault = this.addressData.isDefault == 0 ? 1 : 0;
		}
	}
};
</script>

<style lang="scss">
page {
	background: $page-color-base;
	padding-top: 16rpx;
}

.row {
	display: flex;
	align-items: center;
	position: relative;
	padding: 0 30rpx;
	height: 110rpx;
	background: #fff;

	.tit {
		flex-shrink: 0;
		width: 200rpx;
		font-size: 30rpx;
		color: $font-color-dark;
		height: 100%;
		align-items: center;
		display: flex;
	}
	.input {
		flex: 1;
		font-size: 30rpx;
		color: $font-color-dark;
		height: 100%;
		display: flex;
		align-items: center;
	}
}
.default-row {
	margin-top: 16rpx;
	.tit {
		flex: 1;
	}
	switch {
		transform: translateX(16rpx) scale(0.9);
	}
}
.add-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 690rpx;
	height: 80rpx;
	margin: 60rpx auto;
	font-size: $font-lg;
	color: #fff;
	background: $font-color-spec;
	border-radius: 50rpx;
}
.change-address {
	width: 100%;
	height: 110rpx;
	display: flex;
	align-items: center;
}
.textarea {
	width: 100%;
	height: 100%;
	padding-top: 10rpx;
}
.iconfont {
	font-size: 54rpx;
	color: #8c8c8c;
	position: absolute;
	top: 28rpx;
	right: 32rpx;
	pointer-events: none;
}
</style>
