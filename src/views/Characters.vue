<template>
	<div id="app">
		<h1>YmirAI</h1>

		<!-- 角色列表 -->
		<div class="character-list">
			<h2>个人角色列表</h2>
			<ul>
				<li v-for="character in characters" :key="character.id" @click="selectCharacter(character)">
					{{ character.character_name }}
				</li>
			</ul>
			<button @click="createNewCharacter">新建角色</button>
		</div>

		<div class="character-list character-list2">
			<h2>共享角色列表</h2>
			<ul>
				<li v-for="character in pbcharacters" :key="character.id" @click="selectCharacter(character)">
					{{ character.character_name }}
				</li>
			</ul>
		</div>

		<!-- 角色编辑表单 -->
		<div v-if="selectedCharacter" class="character-form">
			<h2>编辑角色</h2>
			<form @submit.prevent="submitCharacter">
				<div>
					<label style="display: inline-block; ">名称：</label>
					<input type="text" v-model="selectedCharacter.character_name" required />
				</div>

				<div>
					<label style="display: inline-block;">简介：</label>
					<textarea v-model="selectedCharacter.summery" required></textarea>
				</div>



				<label>头像：</label>
				<img :src="selectedCharacter.avatar" alt="avatar" v-if="selectedCharacter.avatar" />
				<input type="file" @change="onAvatarChange" />

				<label>历史会话：</label>
				<transition-group name="fade" mode="out-in">
					<div v-for="(prompt, index) in selectedCharacter.prompts_texts" :key="index">
						角色<input type="text" v-model="selectedCharacter.prompts_texts[index]['role']" required />
						<textarea v-model="selectedCharacter.prompts_texts[index]['content']" required></textarea>
					</div>
				</transition-group>
				<button @click="addPrompt">添加新会话</button> <button @click="delPrompt">移除一条</button>

				<label>声音：</label>
				<audio v-if="selectedCharacter.audio_data" controls>
					<source :src="selectedCharacter.audio_data" type="audio/wav" />
					您的浏览器不支持音频播放。
				</audio>
				<input type="file" @change="onAudioChange" accept=".wav" />

				<label>
					是否发布


					<input type="checkbox" v-model="selectedCharacter.publish" />

				</label>

				<button type="submit">保存角色</button>
			</form>
		</div>


	</div>
</template>

<script>
	export default {
		data() {
			return {
				characters: [], // 角色列表
				pbcharacters: [], // 角色列表
				selectedCharacter: {
					character_name: "角色1",
					summery: "这是角色1的简介",
					prompts_texts: [{
						"role": "system",
						"content": "你是一个....模型"
					}, {
						"role": "user",
						"content": "你好"
					}, {
						"role": "assestence",
						"content": "我好"
					}],
					avatar: "", // base64 图片
					audio_data: "", // base64 音频
					text: "", // base64 音频 文本
					publish: false
				}, // 当前选择的角色

			};
		},
		methods: {
			// 模拟加载角色列表
			loadCharacters() {

				this.axios.get(`/api/v1/characters`)
					.then((result) => {
						this.characters = result.data.data
					})
					.catch((err) => {});
					
				this.axios.get(`/api/v1/characters?publish=true`)
					.then((result) => {
				
						this.pbcharacters = result.data.data
				
					})
					.catch((err) => {});

			},
			// 选择角色进行编辑
			selectCharacter(character) {
				const temp = {
					...character
				};
				this.axios.get(`/api/v1/character/` + temp.id + `?avatar=True`)
					.then((result) => {
						temp.avatar = "data:image/png;base64," + result.data.data

					})
					.catch((err) => {});
				this.axios.get(`/api/v1/character/` + temp.id + `?audio=True`)
					.then((result) => {
						temp.audio_data = "data:audio/wav;base64," + result.data.data
						this.selectedCharacter = {
							...temp
						}
					})
					.catch((err) => {});
			},

			// 新建角色
			createNewCharacter() {
				this.selectedCharacter = {
					id: null,
					character_name: "",
					summery: "",
					prompts_texts: [],
					avatar: "",
					audio_data: "",
					text: "",
					publish: false,
				};
			},

			// 添加新会话
			addPrompt() {
				const a = []
				if (this.selectedCharacter.prompts_texts.length == 0) {
					this.selectedCharacter.prompts_texts.push({
						"role": "system",
						"content": ""
					});
					return
				}
				if (this.selectedCharacter.prompts_texts[this.selectedCharacter.prompts_texts.length - 1]['role'] ==
					"user") {
					this.selectedCharacter.prompts_texts.push({
						"role": "assistant",
						"content": ""
					});
					return
				} else {
					this.selectedCharacter.prompts_texts.push({
						"role": "user",
						"content": ""
					});
					return
				}
			},
			delPrompt() {
				if (this.selectedCharacter.prompts_texts.length > 0) {
					this.selectedCharacter.prompts_texts.pop()

					console.log(this.selectedCharacter.prompts_texts)
				} else {
					alert("不能再删啦")
				}

			},

			// 处理头像更换
			onAvatarChange(event) {
				const file = event.target.files[0];
				const reader = new FileReader();
				reader.onload = (e) => {
					this.selectedCharacter.avatar = e.target.result;
				};
				reader.readAsDataURL(file);
			},

			// 处理音频更换
			onAudioChange(event) {
				const file = event.target.files[0];
				const reader = new FileReader();
				reader.onload = (e) => {
					this.selectedCharacter.audio_data = e.target.result;
				};
				reader.readAsDataURL(file);
			},

			// 提交表单
			submitCharacter() {
				// 验证表单是否为空
				if (!this.selectedCharacter.character_name || !this.selectedCharacter.summery) {
					alert("名称和简介不能为空！");
					return;
				}

				// 模拟保存到服务端
				console.log("保存角色：", this.selectedCharacter);
				
				this.submitForm()

				// 提交后可以清空或重新加载角色列表
				this.loadCharacters();
			},
			
			submitForm() {
			      // 转换base64为二进制数据
			      const formData = new FormData();
			      formData.append('character_name', this.selectedCharacter.character_name);
			      formData.append('summery', this.selectedCharacter.summery);
			      formData.append('prompts_texts', JSON.stringify(this.selectedCharacter.prompts_texts));
			      formData.append('text', this.selectedCharacter.text);
			      formData.append('publish', this.selectedCharacter.publish);
			
			      // 处理avatar
			      if (this.selectedCharacter.avatar) {
			        const avatarBlob = this.dataURLToBlob(this.selectedCharacter.avatar);
			        formData.append('avatar', avatarBlob, 'avatar.png');
			      }
			
			      // 处理audio_data
			      if (this.selectedCharacter.audio_data) {
			        const audioBlob = this.dataURLToBlob(this.selectedCharacter.audio_data);
			        formData.append('audio_data', audioBlob, 'audio.mp3');
			      }
			
			      // 提交数据
			      this.axios.post('/api/v1/character', formData, {
			        headers: {
			          'Content-Type': 'multipart/form-data',
			        },
			      })
			      .then(response => {
			        console.log('Success:', response.data);
			      })
			      .catch(error => {
			        console.error('Error:', error);
			      });
			    },
			    dataURLToBlob(dataURL) {
			      const byteString = atob(dataURL.split(',')[1]);
			      const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
			      const ab = new ArrayBuffer(byteString.length);
			      const ia = new Uint8Array(ab);
			
			      for (let i = 0; i < byteString.length; i++) {
			        ia[i] = byteString.charCodeAt(i);
			      }
			
			      return new Blob([ab], { type: mimeString });
			    },
		},
		mounted() {
			this.loadCharacters();
		}
	};
</script>

<style scoped>
	/* 二次元风格总体设置 */
	#app {
		font-family: 'Comic Sans MS', 'Avenir', 'Helvetica', 'Arial', sans-serif;
		color: #333;
		background: linear-gradient(to bottom right, #9ae2ff, #fbc2eb);
		text-align: center;
		padding: 30px;
		border-radius: 15px;
		box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
		margin: 20px;
		position: relative;
		overflow: hidden;
		overflow-y: auto;
		/* 允许垂直滚动 */
	}

	.list-item {
		transition: all 0.5s ease;
	}

	.fade-leave-active {
		transition: all 0.5s ease;
		transform: translateY(-20px);
		opacity: 0;
	}

	/* 光晕背景效果 */
	#app::before {
		content: '';
		position: absolute;
		top: -200px;
		left: -200px;
		width: 500px;
		height: 500px;
		background: radial-gradient(circle, rgba(255, 255, 255, 0.3), transparent);
		z-index: -1;
		animation: rotate 10s linear infinite;
	}

	#app::after {
		content: '';
		position: absolute;
		bottom: -200px;
		right: -200px;
		width: 500px;
		height: 500px;
		background: radial-gradient(circle, rgba(255, 255, 255, 0.2), transparent);
		z-index: -1;
		animation: rotate 8s linear infinite reverse;
	}

	@keyframes rotate {
		from {
			transform: rotate(0deg);
		}

		to {
			transform: rotate(360deg);
		}
	}

	/* 角色列表样式 */
	.character-list {
		margin: 10px;
		padding: 10px;
		background-color: rgba(255, 255, 255, 0.8);
		border-radius: 15px;
		box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
		float: left;
		width: 20%;
	}

	.character-list2 {
		float: right;
	}

	.character-list h2 {
		color: #ff69b4;
		/* font-size: 1.8em; */
		text-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
	}

	.character-list ul {
		list-style: none;
		padding: 0;
	}

	.character-list li {
		margin: 10px 0;
		padding: 10px 20px;
		background: #fbc2eb;
		background: linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%);
		border-radius: 10px;
		cursor: pointer;
		transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
	}

	.character-list li:hover {
		transform: translateY(-10px);
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
	}

	/* 表单容器样式 */
	.character-form {
		background: rgba(255, 255, 255, 0.9);
		padding: 30px;
		border-radius: 20px;
		max-width: 50%;
		margin: 0 auto;
		text-align: left;
		box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
	}

	/* 表单标题 */
	.character-form h2 {
		/* font-size: 2em; */
		/* margin-bottom: 20px; */
		color: #ff69b4;
		text-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
		text-align: center;
	}

	/* 表单字段 */
	.character-form label {
		display: block;
		/* font-size: 1.2em; */
		color: #ff69b4;
		margin-top: 15px;
		text-shadow: 0 0 2px rgba(255, 255, 255, 0.6);
	}

	.character-form input,
	.character-form textarea {
		width: 100%;
		padding: 10px;
		margin-top: 10px;
		/* font-size: 1.1em; */
		border: 2px solid #ff69b4;
		border-radius: 10px;
		background-color: rgba(255, 255, 255, 0.6);
		box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.05);
		transition: border-color 0.3s;
	}

	.character-form input:focus,
	.character-form textarea:focus {
		outline: none;
		border-color: #a6c1ee;
	}

	/* 按钮样式 */
	button {
		background: linear-gradient(135deg, #fbc2eb, #a6c1ee);
		color: white;
		padding: 10px 20px;
		border: none;
		border-radius: 15px;
		/* font-size: 1.2em; */
		cursor: pointer;
		margin-top: 20px;
		box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
		transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
	}

	button:hover {
		transform: translateY(-5px);
		box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
	}

	/* 新建角色按钮 */
	button.new-character {
		background: linear-gradient(135deg, #ff9a9e, #fad0c4);
		margin-top: 40px;
	}

	/* 添加历史会话按钮 */
	button.add-prompt {
		background: linear-gradient(135deg, #fbc2eb, #a6c1ee);
		margin-top: 10px;
		margin-bottom: 20px;
	}

	/* 头像展示 */
	.character-form img {
		margin-top: 10px;
		border-radius: 10%;
		width: 150px;
		height: 150px;
		object-fit: cover;
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
	}

	/* 声音播放器样式 */
	audio {
		margin-top: 10px;
		width: 100%;
		outline: none;
		border-radius: 10px;
		background-color: rgba(255, 255, 255, 0.8);
		box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
	}
</style>