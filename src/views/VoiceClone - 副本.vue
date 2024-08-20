<template>
	
<div class="container">
  <div class="voice-clone-page">
    <h1 class="title">声音克隆</h1>

    <div class="form-group">
      <label for="file-upload" class="label ">选择音频</label>
      <input  type="file" id="file-upload" @change="onFileChange" accept="audio/*" class="file-input submit-button"  />
    </div>

    <div class="form-group">
      <label for="audio-text" class="label">音频文本</label>
      <textarea id="audio-text" v-model="audioText" placeholder="输入音频文本..." class="text-input"></textarea>
    </div>

    <div class="form-group">
      <label for="clone-text" class="label">自定义克隆文本</label>
      <textarea id="clone-text" v-model="cloneText" placeholder="输入自定义文本..." class="text-input"></textarea>
    </div>

    <button @click="submit" class="submit-button">提交</button>

    <audio v-if="audioUrl" :src="audioUrl" controls autoplay class="audio-player"></audio>
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
      audioUrl: null
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
          this.audioUrl = URL.createObjectURL(blob);
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
  width: 400px;
  margin: 0 auto;
  padding: 20px;

  border-radius: 10px;
  box-shadow: 0 15px 20px rgba(0, 0, 0, 0.3);
  font-family: 'Arial', sans-serif;
}

.title {
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
}

.submit-button:hover {
  background-color: #ff4d94;
}

.audio-player {
  margin-top: 20px;
  width: 100%;
}

</style>
