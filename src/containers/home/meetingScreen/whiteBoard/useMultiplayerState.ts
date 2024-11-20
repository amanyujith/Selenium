import type { TDAsset, TDBinding, TDShape, TDUser, TldrawApp } from '@tldraw/tldraw'
import React, { useCallback, useRef, useState } from 'react'
import type { Storage } from './liveblocks.config'
import { useSelector } from 'react-redux'

declare const window: Window & { app: TldrawApp }


export function useMultiplayerState(roomId: string) {
  const whiteBoardState = useSelector((state: any) => state.Main.whiteBoardState)
  const participantID = useSelector((state: any) => state.Main.selfParticipantID)
  const meetingSession = useSelector((state: any) => state.Main.meetingSession)
  const whiteBoardData = useSelector((state: any) => state.Main.whiteBoardData)
  const [app, setApp] = useState<TldrawApp>()
  const [error, setError] = useState<Error>()
  const [loading, setLoading] = useState(true)
  const [document, setDocument] = useState<any>([])

  

  const rIsPaused = useRef(false)

  const rLiveShapes = useRef<Storage['shapes']>()
  const rLiveBindings = useRef<Storage['bindings']>()
  const rLiveAssets = useRef<Storage['assets']>()

  const onMount = useCallback(
    (app: TldrawApp) => {
      app.loadRoom(roomId)
      app.pause() // Turn off the app's own undo / redo stack
      window.app = app
      setApp(app)
    },
    [roomId]
  )

  // Update the live shapes when the app's shapes change.
  const onChangePage = useCallback(
    (
      app: TldrawApp,
      shapes: Record<string, TDShape | undefined>,
      bindings: Record<string, TDBinding | undefined>,
      assets: Record<string, TDAsset | undefined>
    ) => {
      // room.batch(() => {
      // const lShapes = rLiveShapes.current
      // const lBindings = rLiveBindings.current
      // const lAssets = rLiveAssets.current
      // const lShapes = shapes
      // const lBindings = bindings
      // const lAssets = assets


      // if (!(lShapes && lBindings && lAssets)) {
      //   
      //   return
      // }


      Object.entries(shapes).forEach(([id, shape]) => {
        if (!shape) {
          // lShapes.delete(id)
          // meetingSession.broadCastMessage({ title: "whiteboard", type: "data", data: { type: 'deleteShape', info: id } }, "one_to_all")
          meetingSession.whiteboardMessage('shapes', { id: id }, true, true)

        } else {
          // lShapes.set(shape.id, shape)
          meetingSession.whiteboardMessage('shapes', shape, false, true)


          // meetingSession.broadCastMessage({ title: "whiteboard", type: "data", data: { type: 'addShape', info: [id, shape] } }, "one_to_all")
        }
      })

      // 
/** Bindings send to backend code start*/
      // Object.entries(bindings).forEach(([id, binding]) => {
      //   if (!binding) {
      //     // lBindings.delete(id)
      //   } else {
      //     // lBindings.set(binding.id, binding)
      //   }
      // })
/** Bindings send to backend code end*/

/** Assets send to backend code start*/
      // Object.entries(assets).forEach(([id, asset]) => {
      //   if (!asset) {
      //     // lAssets.delete(id)
      //   } else {
      //     // lAssets.set(asset.id, asset)
      //   }
      // })
/** Assets send to backend code start*/

      // })
    },
    []
  )


  // Handle presence updates when the user's pointer / selection changes
  const onChangePresence = useCallback(
    (app: TldrawApp, user: TDUser) => {
      // updateMyPresence({ id: app.room?.userId, user })
      // meetingSession.whiteboardMessage('movement', user)
      // meetingSession.broadCastMessage({ title: "whiteboard", type: "data", data: { type: 'movement', info: user } }, "one_to_all")
    },
    []
  )

  // Document Changes --------

  React.useEffect(() => {
    // const unsubs: (() => void)[] = []
    // if (!(app && room)) return
    // // Handle errors
    // unsubs.push(room.subscribe('error', (error) => setError(error)))

    // // Handle changes to other users' presence
    // unsubs.push(
    //   room.subscribe('others', (others, event) => {
    //     if (event.type === 'leave') {
    //       const { presence } = event.user
    //       if (presence) {
    //         app?.removeUser(presence.id!)
    //       }
    //     } else {
    //       app.updateUsers(
    //         others
    //           .toArray()
    //           .filter((other) => other.presence)
    //           .map((other) => other.presence!.user)
    //           .filter(Boolean)
    //       )
    //     }
    //   })
    // )

    // app?.updateUsers(
    //   [...whiteBoardData]
    // )

    let stillAlive = true

    // Setup the document's storage and subscriptions
    async function setupDocument() {
      //replace storage with cached data #########################################################################
      // const storage = await room.getStorage()
      // 


      // Migrate previous versions
      // const version = storage.root.get('version')
      // 


      // Initialize (get or create) maps for shapes/bindings/assets

      // let lShapes = storage.root.get('shapes')
      // 
      // if (!lShapes || !('_serialize' in lShapes)) {
      //   storage.root.set('shapes', new LiveMap())
      //   lShapes = storage.root.get('shapes')
      //   
      // }
      // rLiveShapes.current = lShapes
      // 

      // let lBindings = storage.root.get('bindings')
      // if (!lBindings || !('_serialize' in lBindings)) {
      //   storage.root.set('bindings', new LiveMap())
      //   lBindings = storage.root.get('bindings')
      // }
      // rLiveBindings.current = lBindings

      // let lAssets = storage.root.get('assets')
      // if (!lAssets || !('_serialize' in lAssets)) {
      //   storage.root.set('assets', new LiveMap())
      //   lAssets = storage.root.get('assets')
      // }
      // rLiveAssets.current = lAssets

      // if (!version) {
      // The doc object will only be present if the document was created
      // prior to the current multiplayer implementation. At this time, the
      // document was a single LiveObject named 'doc'. If we find a doc,
      // then we need to move the shapes and bindings over to the new structures
      // and then mark the doc as migrated.
      // const doc = storage.root.get('doc')
      // 

      // No doc? No problem. This was likely a newer document
      // if (doc) {
      //   const {
      //     document: {
      //       pages: {
      //         page: { shapes, bindings },
      //       },
      //       assets,
      //     },
      //   } = doc.toObject()

      //   Object.values(shapes).forEach((shape) => lShapes.set(shape.id, shape))
      //   Object.values(bindings).forEach((binding) => lBindings.set(binding.id, binding))
      //   Object.values(assets).forEach((asset) => lAssets.set(asset.id, asset))
      // }
      // }

      // Save the version number for future migrations
      // storage.root.set('version', 2.1)

      // Subscribe to changes\
      //this code is used to update page content

      //add broadcasted data here to display changes in tldraw
      if (whiteBoardData[whiteBoardData.length - 1]?.type === "addShape") {
        const data: any = [...document]
        const id = whiteBoardData[whiteBoardData.length - 1].info[0]
        const whiteboardTempData: any = whiteBoardData[whiteBoardData.length - 1].info[1]
        data[0] = { ...data[0], id: whiteboardTempData }
        setDocument(data)

      }

      const handleChanges = () => {
        
        app?.replacePageContent(

          whiteBoardData[0],
          whiteBoardData[1],
          whiteBoardData[2]

          // Object.fromEntries(lShapes.entries()),
          // Object.fromEntries(lBindings.entries()),
          // Object.fromEntries(lAssets.entries())
        )
      }
      if (stillAlive) {
        // unsubs.push(room.subscribe(lShapes, handleChanges))

        // Update the document with initial content
        handleChanges()
        // Zoom to fit the content
        /** ZOOM NEW FEATURE TEMPORARLY COMMENTED */
        // if (app) {
        //   app.zoomToFit()
        //   if (app.zoom > 1) {
        //     app.resetZoom()
        //   }
        // }

        setLoading(false)
      }
    }
    setupDocument()

    

    return () => {
      stillAlive = false
      // unsubs.forEach((unsub) => unsub())
      if (whiteBoardState === participantID) {
        // deleteStorage()
        
      }
    }
  }, [app, whiteBoardData])


  return {
    onMount,
    onChangePage,
    onChangePresence,
    error,
    loading,
  }
}
