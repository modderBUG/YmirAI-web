
<template>
  <div class="character-select">
    <h2>请选择你的英雄！</h2>
    <div class="characters">
      <div
        v-for="character in characters"
        :key="character.id"
        class="character"
        :class="{ 
          selected: selectedCharacter === character.id, 
          locked: character.locked 
        }"
        @click="selectCharacter(character)"
      >
        <img :src="character.avatar" :alt="character.name" :class="{ 'grayscale': character.locked }" />
        <div class="name">{{ character.name }} <div v-if="character.locked">🔒
        	
        </div>
		 </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedCharacter: 2,
      characters: [
        { id: 1, name: '逸仙', avatar: 'https://patchwiki.biligame.com/images/blhx/f/fb/5964992vk46o94ifnb28i6d8hjx2ay7.jpg' },
        { id: 2, name: '凯茜娅', avatar: 'http://si5c7yq6z.hn-bkt.clouddn.com/character/kesya.jpg' },
        { id: 3, name: '里芙', avatar: 'http://si5c7yq6z.hn-bkt.clouddn.com/character/lyfu.jpg', locked: true }, // 添加 locked 字段
		{ id: 4, name: '镇海', avatar: 'https://patchwiki.biligame.com/images/blhx/9/9d/6whbb99odze03lrh2bq59ae439ajsxi.jpg', locked: true }, // 添加 locked 字段
      ],
    };
  },
  methods: {
    selectCharacter(character) {
      if (character.locked) return; // 如果角色被锁定，直接返回
      this.selectedCharacter = character.id;
      this.$emit('character-selected', character.id);
    },
  },
};
</script>

<style scoped>
.character-select {
  text-align: center;
}

.characters {
	margin-top: 10%;
  display: flex;
  justify-content: center;
  gap: 20px;
}

.character {
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  border: 2px solid transparent;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.character img {
  width: 80px;
  height: 80px;
  border-radius: 10px;
}

.character.selected {
  transform: scale(1.1);
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
  border: 2px solid #ffd700;
}

.character.locked {
  opacity: 0.8; /* 使锁定角色变得透明 */
  pointer-events: none; /* 禁止点击 */
}

.character img.grayscale {
  filter: grayscale(20%); /* 将头像变为灰色 */
}

.name {
  margin-top: 10px;
  font-weight: bold;
}
</style>
