import { Directive } from 'vue'

export const droppable: Directive = {
  created: (el: HTMLElement, binding) => {
    el.addEventListener('dragenter', (event: DragEvent) => {
      event.preventDefault()
      el.classList.add('droppable')
      event.dataTransfer!.dropEffect = 'move'

      return false
    })

    el.addEventListener('dragover', (event: DragEvent) => event.preventDefault())
    el.addEventListener('dragleave', () => el.classList.remove('droppable'))

    el.addEventListener('drop', (event: DragEvent) => {
      event.preventDefault()
      event.stopPropagation()
      el.classList.remove('droppable')
      binding.value(event)
    })
  }
}
