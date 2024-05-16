<template>
	<view>
		<checkbox-group @change="changeCb">
			<label class="cu-checked-group">
				<checkbox hidden color="#FFFFFF" value="2" />
				<view class="cu-checkbox" :class="checkType===1 ? 'check-not-full' : (checkType===2 ? 'check-full': 'check-not')">
					<view class="uni-checkbox-input"></view>
				</view>
				<text class="text" :class="checkType!==0 ? 'cu-checked' : ''">{{title}}</text>
			</label>
		</checkbox-group>
	</view>
</template>

<script>
	export default {
		name: "jade-checkbox",
		props: {
			// 绑定参数v-model
			value: {
				type: [Array, String, Number],
				default () {
					return ''
				}
			},
			// 数据源
			list: {
				type: Array,
				default () {
					return []
				}
			},
			// 文字
			title: String,
			// 对应关系
			map: {
				type: Object,
				default () {
					return {
						name: 'name',
						value: 'value'
					}
				}
			}
		},
		data() {
			return {
				checkType: 0,
				checkedData: []
			};
		},
		watch: {
			value(v) {
				this.checkedData = v
			},
			checkedData(v) {
				if (!this.checkedData.length) {
					this.checkType = 0
				} else if (this.checkedData.length == this.list.length) {
					this.checkType = 2
				} else {
					this.checkType = 1
				}
				this.$emit('change', this.checkedData)
			}
		},
		methods: {
			changeCb() {
				if (this.checkedData.length == this.list.length) {
					this.checkedData = []
				} else {
					this.checkedData = []
					this.list.forEach(item => {
						this.checkedData.push(item[this.map.value])
					})
				}
			},
		}
	}
</script>

<style lang="scss">
	.cu-checked-group {
		padding: 10px 0;
		display: flex;
		align-items: center;
		font-size: 14px;
		font-weight: 700;
		border-bottom: 1px #eee solid;
		
		.text{
			margin-left: 5px;
		}
		.cu-checked {
			color: #007aff;
		}
	}
	.cu-checkbox{
		position: relative;
		width: 16px;
		height: 16px;
		border: 1px solid #DCDFE6;
		border-radius: 2px;
		background-color: #fff;
		box-sizing: border-box;
		&.check-not {
			border: 1px solid #DCDFE6;
			background-color: #fff;
		}
		
		&.check-not-full {
			border-color: #007aff;
			background-color: #007aff;
			.uni-checkbox-input {
				position: absolute;
				/* #ifdef APP-NVUE */
				top: 2px;
				/* #endif */
				/* #ifndef APP-NVUE */
				top: 1px;
				/* #endif */
				left: 3px;
				height: 6px;
				width: 9px;
				border-bottom-width: 1px;
				border-bottom-color: #e7e7e7;
				border-bottom-style: solid;
				transform-origin: center;
			}
		
		}
		
		&.check-full {
			border-color: #007aff;
			background-color: #007aff;
			.uni-checkbox-input {
				position: absolute;
				/* #ifdef APP-NVUE */
				top: 2px;
				/* #endif */
				/* #ifndef APP-NVUE */
				top: 1px;
				/* #endif */
				left: 5px;
				height: 8px;
				width: 4px;
				border-right-width: 1px;
				border-right-color: #fff;
				border-right-style: solid;
				border-bottom-width: 1px;
				border-bottom-color: #fff;
				border-bottom-style: solid;
				transform-origin: center;
				transform: rotate(45deg);
			}
		}
	}
</style>
