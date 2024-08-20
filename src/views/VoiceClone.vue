<template>
	<div class="container">
  <div class="voice-clone-page">
    <div class="form-container">
      <h1 class="title">二次元声音克隆</h1>

      <div class="form-group">
        <label for="file-upload" class="label">选择音频</label>
        <input type="file" id="file-upload" @change="onFileChange" accept="audio/*" class="file-input"/>
      </div>

      <div class="form-group">
        <label for="audio-text" class="label">音频文件的文本</label>
        <textarea id="audio-text" v-model="audioText" placeholder="输入音频文本..." class="text-input"></textarea>
      </div>

      <div class="form-group">
        <label for="clone-text" class="label">自定义文本</label>
        <textarea id="clone-text" v-model="cloneText" placeholder="输入自定义文本..." class="text-input"></textarea>
      </div>

      <button @click="submit" class="submit-button">提交</button>
	 <button @click="" class="submit-button">保存</button>

      <audio v-if="audioUrl" :src="audioUrl" controls autoplay class="audio-player"></audio>
    </div>

    <div class="history-container">
      <h2 class="history-title">记录</h2>
      <div v-for="(item, index) in save_list" :key="index" class="history-card">
        <p class="history-text">{{ item.name }}</p>
        <audio :src="item.audioUrl" controls class="history-audio"></audio>
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
      save_list: [
		  {"wav":"aaa","name":"aaa","prompts_text":"aaa","text":"aaa"}
	  ]
    };
  },
  methods: {
    onFileChange(event) {
      this.audioFile = event.target.files[0];
    },
    async submit() {
      if (!this.audioFile || !this.audioText || !this.cloneText) {
        alert('请填写所有字段并选择一个音频文件');
        return;
      }

      const formData = new FormData();
      formData.append('file', this.audioFile);
      formData.append('text', this.audioText);
      formData.append('prompts_text', this.cloneText);

      try {
        const response = await fetch('/api/v1/make_voice', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          this.audioUrl = url;

          // 保存到历史记录
          this.historyList.push({
            text: this.cloneText,
            audioUrl: url
          });

          // 清空输入框
          this.audioText = '';
          this.cloneText = '';
          this.audioFile = null;
        } else {
          alert('生成音频时出错');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('提交失败，请重试');
      }
    }
  }
};
</script>

<style scoped>
	
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
  padding: 10px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.title, .history-title {
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
</style>
