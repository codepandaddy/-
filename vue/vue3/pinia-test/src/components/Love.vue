<script setup lang='ts' name="Love">
import { ref, reactive } from 'vue'
import axios from "axios";
import { nanoid } from "nanoid";
const talkList = reactive([
  {id:'01',title:'今天你有点怪，怪好看的'},
  {id:'02',title:'草莓蓝莓蔓越莓，你今天想我了没'},
])
function getLoveTalk() {
  // let result = await axios.get('')
  const obj = {id:nanoid(),title:'春风十里不如你'}
  talkList.unshift(obj);
}
</script>

<template>
  <div>
    <button @click="getLoveTalk">获取一句土味情话</button>
    <ul>
      <li v-for="talk in talkList" :key="talk.id">{{ talk.title }}</li>
    </ul>
  </div>
</template>

<style lang='scss' scoped>

</style>