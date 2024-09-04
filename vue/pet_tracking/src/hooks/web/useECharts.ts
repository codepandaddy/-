import { useDesignSettingStore } from '@/store/modules/designSetting';
import { Fn } from '@vueuse/core';
import { EChartsOption } from 'echarts';
import echarts from '@/utils/lib/echarts';
import { useEventListener } from '@/hooks/event/useEventListener'
import { useBreakpoint } from '@/hooks/event/useBreakpoint'

export function useECharts(
  elRef: Ref<HTMLDivElement>,
  theme: 'light' | 'dark' | 'default' = 'default'
) {
  const designStore = useDesignSettingStore();

  const getDarkMode = computed(() => {
    return theme === 'default' ? designStore.getDarkMode : theme;
  });

  let chartInstance: echarts.ECharts | null = null;
  let resizeFn: Fn = resize;
  const cacheOptions = ref({});
  let removeResizeFn: Fn = () => {};
  resizeFn = useDebounceFn(resize, 200);

  const getOptions = computed((): EChartsOption => {
    if (getDarkMode.value !== 'light') {
      return cacheOptions.value;
    }
    return {
      backgroundColor: 'transparent',
      ...cacheOptions.value
    };
  });

  function initCharts(t = theme) {
    const el = unref(elRef);
    if (!el || !unref(el)) return;

    chartInstance = echarts.init(el, t);
    const { removeEvent } = useEventListener({
      el: window,
      name: 'resize',
      listener: resizeFn
    });
    const { widthRef, screenEnum } = useBreakpoint()
    if (unref(widthRef) <= screenEnum.MD || el.offsetHeight === 0) {
      useTimeoutFn(() => {
        resizeFn()
      }, 30)
    }
  }

  function setOptions(options: EChartsOption, clear = true) {
    cacheOptions.value = options
    if (unref(elRef)?.offsetHeight === 0) {
      useTimeoutFn(() => {
        setOptions(unref(getOptions))
      }, 30)
      return;
    }
    nextTick(() => {
      useTimeoutFn(() => {
        if (!chartInstance) {
          initCharts(getDarkMode.value as 'default')

          if (!chartInstance) {
            return
          }
        }
        clear && chartInstance?.clear()

        chartInstance?.setOption(unref(getOptions))
      }, 30)
    })
  }

  function resize() {
    chartInstance?.resize();
  }

  watch(() => getDarkMode.value, (theme) => {
    if (chartInstance) {
      chartInstance.dispose()
      initCharts(theme as 'default')
      setOptions(cacheOptions.value)
    }
  })

  tryOnUnmounted(() => {
    if (!chartInstance) {
      return;
    }
    removeResizeFn()
    chartInstance.dispose()
    chartInstance = null
  })

  function getInstance(): echarts.ECharts | null {
    if (!chartInstance) {
      initCharts(getDarkMode.value as 'default')
    }
    return chartInstance
  }

  return {
    setOptions,
    resize,
    echarts,
    getInstance,
  }
}
