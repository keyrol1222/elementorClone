# Architecture

PageCraft is a JSON-driven visual page builder. The editor mutates a tree of nodes; the renderer draws that tree for editor, preview, and published modes.

## High-level flow

```
Dashboard → Editor (Zustand tree)
                ↓ save / autosave / publish
            PostgreSQL (Page.content JSON)
                ↓ publish
            PublishVersion snapshot
                ↓
            Public page /p/{project}/{page}
```

## Core concepts

### Page content tree

```ts
type EditorNode = {
  id: string
  type: string
  props: Record<string, unknown>
  style: { desktop?; tablet?; mobile? }
  children: EditorNode[]
}
```

Nesting rules mirror Elementor:

- Root → `section`
- Section → `container` | `columns`
- Container/columns → any widget

### Widget registry

Widgets live under `widgets/*/index.tsx` and self-register via `WidgetRegistry.register()`. The editor palette and renderer both read from the same registry.

### Editor state

`store/editor-store.ts` owns:

- Page content + selection + device
- In-memory undo/redo history
- Clipboard for copy/paste/duplicate
- Dirty flag for autosave

### Rendering

`renderer/render-node.tsx` recursively renders nodes. In editor mode it wraps nodes with dnd-kit sortable chrome; in preview/published modes it renders clean markup.

### Persistence

| Action | Behavior |
|---|---|
| Autosave | Writes `Page.content` after ~3s idle |
| Save | Writes content + creates `Revision` |
| Publish | Writes content, sets `PUBLISHED`, creates `PublishVersion` + revision |
| Restore | Loads revision content back into the page |

### Templates

`Template` rows store reusable page/section JSON. Editor Settings can save the current page or apply a template (replace/append).

## Performance notes (Phase 10)

- `RenderNode` is memoized
- Editor panels/canvas use `next/dynamic` code splitting
- Navigator virtualizes when ≥ 40 nodes
- `optimizePackageImports` for lucide / framer-motion / dnd-kit
- Framer Motion used for panel/canvas/palette transitions only (not every node)
