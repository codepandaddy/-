import {ref} from 'vue'

export default function () {
  let sum = ref(0);
  function getSum() {
    sum.value++;
  }

  return {sum,getSum}
}