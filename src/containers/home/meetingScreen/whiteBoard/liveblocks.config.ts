import type { EnsureJson, LiveMap, LiveObject } from '@liveblocks/client'
import type { TDAsset, TDBinding, TDDocument, TDShape, TDUser } from '@tldraw/tldraw'


export type Storage = {
  version: number
  doc: LiveObject<{
    uuid: string
    document: EnsureJson<TDDocument>
    migrated?: boolean
  }>
  shapes: LiveMap<string, EnsureJson<TDShape>>
  bindings: LiveMap<string, EnsureJson<TDBinding>>
  assets: LiveMap<string, EnsureJson<TDAsset>>
}