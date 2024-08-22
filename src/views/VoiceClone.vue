<template>
	<div class="container">
		<div class="voice-clone-page">
			<div class="form-container">
				<h1 class="title">二次元声音克隆</h1>

				<div class="form-group">
					<label for="file-upload" class="label">1.选择音频</label>
					<input type="file" id="file-upload" @change="onFileChange" accept="audio/*" class="file-input" />
					<audio v-if="audioUrl" controls :src="audioUrl"></audio>
				</div>

				<div class="form-group">
					<label for="audio-text" class="label">2.音频文件的文本</label>
					<textarea id="audio-text" v-model="audioText" placeholder="输入音频文本..." class="text-input"></textarea>
				</div>

				<div class="form-group">


					<label for="clone-text" class="label">3.自定义文本</label>

					<div class="label-container">
						<span v-for="(label, index) in labels" :key="index"
							:class="['label-emo', { active: selectedLabel === label }]" @click="selectLabel(label)">
							{{ label }}
						</span>
					</div>

					<textarea id="clone-text" v-model="cloneText" placeholder="输入自定义文本..."
						class="text-input"></textarea>
				</div>

				<button @click="submit" class="submit-button">提交</button>
				<button @click="save_audio" class="submit-button">保存</button>

				<audio v-if="resultUrl" :src="resultUrl" controls autoplay class="audio-player"></audio>
			</div>

			<div class="history-container">
				<h2 class="history-title">保存记录</h2>
				<div v-for="(item, index) in save_list" :key="index" class="history-card" @click="load_voice(item)">
					<button class="delete-button" @click.stop="delete_item(item.id,index)">✖</button>
					<p class="history-text">{{ item.file_name }}</p>
					<p class="history-text">{{ item.prompts_text.slice(0,5) }}.....</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				audioFile: null,
				audioText: '',
				cloneText: '',
				audioUrl: null,
				resultUrl: null,
				labels: ['笑声', '呼吸声', '强调语气', '笑语气', "停顿"],
				selectedLabel: '',
				save_list: [{
					'id': 1,
					'uid': 3,
					'file_name': 'test',
					'mime_type': 'wav',
					'prompts_text': '加班后要去喝一杯吗？嗯？你不会忍心，让我一个人去吧。...我不想在这停留太久。...要找我的话，你有我的号码。',
					'text': '你好，分析员。[breath]想我了吗[laughter]',
					'upload_date': '2024-08-20 09:53:11'
				}, {
					'id': 2,
					'uid': 3,
					'file_name': '逸仙',
					'mime_type': 'wav',
					'prompts_text': '嗯，对女性做出这样的举动，想必指挥官也做好承担后果的心理准备了吧？',
					'text': '你好，分析员。[breath]想我了吗[laughter]',
					'upload_date': '2024-08-20 10:11:33'
				}, {
					'id': 3,
					'uid': 3,
					'file_name': '镇海',
					'mime_type': 'wav',
					'prompts_text': '你是在思考吗？还是说，只是单纯的在发呆？表情倒是挺可爱的呢，呵呵...',
					'text': '你好，分析员。[breath]想我了吗[laughter]',
					'upload_date': '2024-08-20 10:12:00'
				}]

			};
		},
		methods: {
			load_voice(item) {
				this.audioText = item.prompts_text;
				this.cloneText = item.text;

				this.axios.get(`/api/v1/voice/` + item.id)
					.then((result) => {
						const b64_data = result.data.data

						// Base64 解码
						const binaryString = window.atob(b64_data);
						const len = binaryString.length;
						const ab = new ArrayBuffer(len);
						const ia = new Uint8Array(ab);
						for (let i = 0; i < len; i++) {
							ia[i] = binaryString.charCodeAt(i);
						}

						// 创建 File 对象
						const file = new File([ab], 'audioFile.mp3', {
							type: "audio/mpeg"
						});
						this.audioFile = file;

						// 创建音频 URL
						this.audioUrl = URL.createObjectURL(file);

						console.log(file)

					})
					.catch((err) => {});

			},
			selectLabel(label) {
				this.selectedLabel = label;
				if (label === '笑声') {
					this.cloneText += "[laughter]"
				}
				if (label === '呼吸声') {
					this.cloneText += "[breath]"
				}
				if (label === '强调语气') {
					this.cloneText += "<strong></strong>"
				}
				if (label === '笑语气') {
					this.cloneText += "<laughter></laughter>"
				}
				if (label === '停顿') {
					this.cloneText += "...[breath]..."
				}
			},
			onFileChange(event) {
				this.audioFile = event.target.files[0];

				this.audioUrl = URL.createObjectURL(this.audioFile);
			},
			submit() {
				if (!this.audioFile || !this.audioText || !this.cloneText) {
					alert('请填写所有字段并选择一个音频文件');
					return;
				}

				const formData = new FormData();
				formData.append('file', this.audioFile);
				formData.append('text', this.audioText);
				formData.append('prompts_text', this.cloneText);

				this.axios.post(`/api/v1/make_voice`, formData, {
						responseType: 'blob'
					})
					.then((result) => {
						const content = result.data; // 返回二进制文件
						const url = URL.createObjectURL(content);
						this.resultUrl = url;
						console.log("Generated URL:", this.resultUrl);
					})
					.catch((err) => {
						console.error("Error:", err);
						alert('上传失败，请重试');
					});
			},


			save_audio() {
				if (!this.audioFile || !this.audioText || !this.cloneText) {
					alert('请填写所有字段并选择一个音频文件');
					return;
				}

				const formData = new FormData();
				formData.append('file', this.audioFile);
				formData.append('text', this.audioText);
				formData.append('prompts_text', this.cloneText);

				this.axios.post(`/api/v1/voice`, formData)
					.then((result) => {
						const content = result.data; // 返回二进制文件
						console.log(content)
						this.getVoiceList()
						alert("上传完成！")
						
					})
					.catch((err) => {
						console.error("Error:", err);
						alert('上传失败，请重试');
					});
			},
			getVoiceList() {
				this.axios.get(`/api/v1/voices`)
					.then((result) => {

						this.save_list = result.data.data

					})
					.catch((err) => {});
			},
			delete_item(id, index) {


				this.save_list.splice(index, 1);


				this.axios.get(`/api/v1/voice/` + id + `?delete=True`)
					.then((result) => {

						this.getVoiceList()

					})
					.catch((err) => {});


			}

		},
		mounted() {
			console.log()
			this.getVoiceList()
		}
	};
</script>

<style scoped>
	.label-container {
		display: flex;
		justify-content: space-around;
		margin-bottom: 5px;

	}


	.label-emo {
		cursor: pointer;
		padding: 5px;
		background-color: #f2f2f2;
		border-radius: 5px;
		transition: background-color 0.3s ease;
		/* height: 20px; */
	}

	.label-emo.active {
		background-color: #4fc08d;
		color: white;
	}

	.label-emo:hover {
		background-color: #e0e0e0;
	}

	.container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		background-image: url('https://example.com/your-anime-background.jpg');
		background-size: cover;
		background-position: center;
	}

	.voice-clone-page {
		display: flex;
		width: 100%;
		max-width: 800px;
		margin: 0 auto;
		padding: 20px;
		border-radius: 10px;
		box-shadow: 0 15px 20px rgba(0, 0, 0, 0.3);
		font-family: 'Arial', sans-serif;
	}

	.form-container {
		flex: 1;
		margin-right: 20px;
	}

	.history-container {
		flex: 1;
		max-width: 300px;
		overflow-y: auto; /* 允许垂直滚动 */
		padding: 10px;
		background: #fff;
		border-radius: 10px;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
		max-height: 800px; /* 设置最大高度 */
	}

	.title,
	.history-title {
		text-align: center;
		font-size: 24px;
		color: #333;
		margin-bottom: 20px;
	}

	.form-group {
		margin-bottom: 15px;
	}

	.label {
		display: block;
		font-size: 16px;
		margin-bottom: 5px;
		color: #555;
	}

	.file-input,
	.text-input {
		width: 100%;
		padding: 10px;
		border-radius: 5px;
		border: 1px solid #ddd;
		font-size: 14px;
	}

	.text-input {
		height: 60px;
		resize: none;
	}

	.submit-button {
		width: 100%;
		padding: 10px;
		background-color: #ff66b2;
		border: none;
		border-radius: 5px;
		color: white;
		font-size: 16px;
		cursor: pointer;
		transition: background-color 0.3s ease;
		margin: 10px;
		padding: 10px;
	}

	.submit-button:hover {
		background-color: #ff4d94;
	}

	.audio-player {
		margin-top: 20px;
		width: 100%;
	}

	.history-card {
		position: relative;
		/* 使删除按钮相对定位 */
		margin-bottom: 15px;
		padding: 10px;
		border-radius: 5px;
		background-color: #f0f0ff;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
	}

	.history-text {
		font-size: 14px;
		margin-bottom: 10px;
		color: #333;
	}

	.history-audio {
		width: 100%;
	}

	.delete-button {
		position: absolute;
		/* 绝对定位 */
		top: 0;
		/* 距离上边距 */
		left: 94%;
		/* 距离左边距 */
		background: none;
		/* 无背景 */
		border: none;
		/* 无边框 */
		color: red;
		/* 颜色为红色 */
		cursor: pointer;
		/* 鼠标指针为手形 */
		font-size: 16px;
		/* 字体大小 */
		float: right;
	}

	.delete-button:hover {
		opacity: 0.7;
		/* 悬停时透明度 */
	}
</style>