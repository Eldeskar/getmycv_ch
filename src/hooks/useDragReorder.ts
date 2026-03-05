import { useRef, useCallback } from 'react'

/**
 * Lightweight hook for HTML5 drag-and-drop reordering of list items.
 * Each draggable item needs: ...dragHandlers(index)
 * Dragging only activates when the user grabs the `.drag-handle` element.
 */
export function useDragReorder<T>(items: T[], onReorder: (items: T[]) => void) {
  const dragIdx = useRef<number | null>(null)
  const overIdx = useRef<number | null>(null)

  const onDragStart = useCallback((idx: number) => (e: React.DragEvent) => {
    dragIdx.current = idx
    e.dataTransfer.effectAllowed = 'move'
    const el = e.currentTarget as HTMLElement
    requestAnimationFrame(() => el.classList.add('dragging'))
  }, [])

  const onDragEnd = useCallback((e: React.DragEvent) => {
    const el = e.currentTarget as HTMLElement
    el.classList.remove('dragging')
    el.draggable = false
    el.parentElement?.querySelectorAll('.drag-over').forEach((n) => n.classList.remove('drag-over'))

    if (dragIdx.current !== null && overIdx.current !== null && dragIdx.current !== overIdx.current) {
      const next = [...items]
      const [moved] = next.splice(dragIdx.current, 1)
      next.splice(overIdx.current, 0, moved)
      onReorder(next)
    }
    dragIdx.current = null
    overIdx.current = null
  }, [items, onReorder])

  const onDragOver = useCallback((idx: number) => (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    overIdx.current = idx

    const el = e.currentTarget as HTMLElement
    if (!el.classList.contains('drag-over')) {
      el.parentElement?.querySelectorAll('.drag-over').forEach((n) => n.classList.remove('drag-over'))
      el.classList.add('drag-over')
    }
  }, [])

  const onDragLeave = useCallback((e: React.DragEvent) => {
    const el = e.currentTarget as HTMLElement
    el.classList.remove('drag-over')
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  /** Props to spread on the drag handle element (the ⠿ span). */
  const handleProps = useCallback(() => ({
    onMouseDown: (e: React.MouseEvent) => {
      // Find the draggable card (closest parent with dragHandlers)
      const card = (e.currentTarget as HTMLElement).closest('[data-drag-card]') as HTMLElement | null
      if (card) card.draggable = true
    },
    onMouseUp: (e: React.MouseEvent) => {
      const card = (e.currentTarget as HTMLElement).closest('[data-drag-card]') as HTMLElement | null
      if (card) card.draggable = false
    },
  }), [])

  const dragHandlers = useCallback((idx: number) => ({
    'data-drag-card': true,
    draggable: false,
    onDragStart: onDragStart(idx),
    onDragEnd,
    onDragOver: onDragOver(idx),
    onDragLeave,
    onDrop,
  }), [onDragStart, onDragEnd, onDragOver, onDragLeave, onDrop])

  return { dragHandlers, handleProps }
}
