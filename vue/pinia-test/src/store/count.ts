import { defineStore } from "pinia";

export const useCountStore = defineStore('count',{
  actions: {
    increment() {
      
    }
  },
  state() {
    return {
      sum: 6
    }
  },
  getters: {
    
  }
})