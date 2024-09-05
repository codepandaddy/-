<script setup lang='ts' name="Count">
import { ref, reactive } from 'vue'
import { useCountStore } from "@/store/count";
import { storeToRefs } from 'pinia';

const countStore = useCountStore();
let {sum} = storeToRefs(countStore);

// 数据
let n = ref(1);
function add() {
  // sum += n.value;
  countStore.$patch({
    sum: 123123123
  })
}
function del() {
  sum.value -= n.value;
}

countStore.$subscribe((mutate,state) => {
  localStorage.setItem('talk',JSON.stringify(sum.value))
})
</script>

<template>
  <div>
    <h2>当前求和为：{{ sum }}</h2>
    <select v-model.number="n">
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
    </select>
    <button @click="add">加</button>
    <button @click="del">减</button>
  </div>
</template>

<style scoped>
select,button {
  margin: 10px;
}
</style>