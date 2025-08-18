import { computed, type Ref } from "vue"

export function usePageOffset(page: Ref<number>, pageSize: Ref<number>) {
  const first = computed({
    get() {
      return (page.value - 1) * pageSize.value
    },
    set(v) {
      page.value = (v + pageSize.value) / pageSize.value
    },
  })

  const rows = computed({
    get() {
      return pageSize.value
    },
    set(v) {
      if (v !== pageSize.value) {
        page.value = 1
        pageSize.value = v
      }
    },
  })

  return {
    first,
    rows,
  }
}
