import { useEffect, useRef, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { actionCreators } from "../../../../../../store"

interface UploadFile {
  name: string
  type: string
  size: number
  data: any
  url: string
  progress: number
  cancelled: boolean
  failed: boolean
  fileID: string
}

const MAX_SIZE = 104857600 //Max Limit 100 MB

interface UploadFiles {
  files: UploadFile[]
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleFileRemove: (index: number) => void
  handleRetry: (index: number) => void
  clearFiles: () => void
  handlePasteFile: (files: File[]) => void
  isMaxSize: boolean
}

const useUploadFiles = (
  chatInstance: any,
  uuid: string | undefined,
  isGroup: boolean,
  draftFiles: any
): UploadFiles => {
  const [files, setFiles] = useState<UploadFile[]>([])

  const [isMaxSize, setMaxSize] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const uuidRef = useRef(uuid)
  uuidRef.current = uuid
  const fileRef = useRef(files)

  const dispatch = useDispatch()

  useEffect(() => {
    setFiles(draftFiles)
    fileRef.current = draftFiles

    return () => {
      dispatch(actionCreators.setAttachment(uuid, fileRef.current, isGroup))
    }
  }, [uuid])

  useEffect(() => {
    if (isMaxSize) {
      timeoutRef.current = setTimeout(() => {
        setMaxSize(false)
      }, 5000)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current!)
      }
    }
  }, [isMaxSize])

  const handleSetMaxSize = (status: boolean) => {
    // clearTimeout(timeoutRef.current!);
    // setMaxSize(true);

    if (status) {
      setMaxSize(true)
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        setMaxSize(false)
      }, 5000)
    } else {
      setMaxSize(false)
    }
  }

  const updateProgressState = (
    progress: number,
    index: number,
    myUUID: string | undefined,
    fileID: string
  ) => {
    if (
      uuidRef.current === myUUID &&
      fileRef.current[index]?.fileID === fileID
    ) {
      fileRef.current[index].progress = progress
      setFiles(fileRef.current)
    } else {
    }
  }

  const updatePath = (
    url: string,
    index: number,
    UUID: string | undefined,
    fileID: string
  ) => {
    if (uuidRef.current === UUID && fileRef.current[index]?.fileID === fileID) {
      setFiles((prevItems) => {
        const updatedItems = [...prevItems]
        updatedItems[index].url = url
        fileRef.current = updatedItems
        return updatedItems
      })
      const isFullyLoaded = fileRef.current.every(
        (item) => item.progress === 100 || item.cancelled
      )
      dispatch(actionCreators.setUploadingStatus(UUID, isGroup, !isFullyLoaded))
    } else {
      dispatch(actionCreators.setAttachmentURL(UUID, isGroup, url, index))
    }
  }

  const handleUploadFailed = (
    index: number,
    UUID: string | undefined,
    fileID: string
  ) => {
    if (uuidRef.current === UUID && fileRef.current[index]?.fileID === fileID) {
      setFiles((prevItems) => {
        const updatedItems = [...prevItems]
        updatedItems[index].failed = true
        fileRef.current = updatedItems
        return updatedItems
      })
    } else {
      dispatch(actionCreators.setUploadingFailed(UUID, isGroup, index))
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files

    const UUID = uuid
    const prevFileLength = fileRef.current.length || 0

    if (!fileList) return
    const isMaxSize = Array.from(fileList).some((file) => file.size > MAX_SIZE)
    handleSetMaxSize(isMaxSize)
    if (isMaxSize) {
      return
    }

    dispatch(actionCreators.setUploadingStatus(uuid, isGroup, true))
    const fileArray = Array.from(fileList).map((file, index) => {
      const fileID = `${Date.now()}${index}`
      const templen = prevFileLength

      chatInstance
        ?.uploadFile(file, (data: any) =>
          updateProgressState(
            Math.floor((data.loaded / data.total) * 100),
            index + prevFileLength,
            UUID,
            fileID
          )
        )
        .then((res: any) => {
          chatInstance?.grafanaLogger([
            "Client : File upload API response",
            {
              res: res,
              "index + prevFileLength": index + prevFileLength,
              UUID: UUID,
              fileID: fileID,
            },
          ])
          updatePath(res, index + prevFileLength, UUID, fileID)
        })
        .catch((error: any) => {
          chatInstance?.grafanaLogger([
            "Client : File upload API Failed",
            {
              res: error,
              "index + prevFileLength": index + prevFileLength,
              UUID: UUID,
              fileID: fileID,
            },
          ])

          handleUploadFailed(index + prevFileLength, UUID, fileID)
        })

      return {
        name: file.name,
        type: file.type,
        size: file.size,
        data: file,
        url: "",
        progress: 0,
        cancelled: false,
        failed: false,
        fileID: fileID,
      }
    })
    // if(files ) {
    //   dispatch(actionCreators.setAttachment(uuid, [...files,...fileArray ], isGroup));

    // } else {
    //   dispatch(actionCreators.setAttachment(uuid, fileArray, isGroup));

    // }
    fileRef.current = [...files, ...fileArray]
    setFiles((prevFiles) => [...prevFiles, ...fileArray])
  }

  const handlePasteFile = (pastedFiles: File[]) => {
    const UUID = uuidRef.current

    const prevFileLength = fileRef.current.length || 0

    if (!pastedFiles) return

    const isMaxSize = Array.from(pastedFiles).some(
      (file) => file.size > MAX_SIZE
    )
    handleSetMaxSize(isMaxSize)
    if (isMaxSize) {
      return
    }

    dispatch(actionCreators.setUploadingStatus(uuid, isGroup, true))
    const fileArray = Array.from(pastedFiles).map((file, index) => {
      const fileID = `${Date.now()}${index}`

      chatInstance
        ?.uploadFile(file, (data: any) =>
          updateProgressState(
            Math.floor((data.loaded / data.total) * 100),
            index + prevFileLength,
            UUID,
            fileID
          )
        )
        .then((res: any) => {
          updatePath(res, index + prevFileLength, UUID, fileID)
        })
        .catch((error: any) => {
          handleUploadFailed(index + prevFileLength, UUID, fileID)
        })
      return {
        name: file.name,
        type: file.type,
        size: file.size,
        data: file,
        url: "",
        progress: 0,
        cancelled: false,
        failed: false,
        fileID: fileID,
      }
    })
    fileRef.current = [...files, ...fileArray]
    setFiles((prevFiles) => [...prevFiles, ...fileArray])
  }

  const handleFileRemove = (index: number) => {
    setFiles((prevFiles) => {
      const newFiles = [...prevFiles]
      newFiles[index].cancelled = true
      fileRef.current = newFiles
      return newFiles
    })

    const isFullyLoaded = files.every(
      (item, i) => item.progress === 100 || item.cancelled || i === index
    )

    dispatch(actionCreators.setUploadingStatus(uuid, isGroup, !isFullyLoaded))

    // let newFiles = [...files];
    // newFiles.splice(index, 1);
    // dispatch(actionCreators.setAttachment(uuid, newFiles, isGroup));

    // setProgressArray((prev) => {
    //   const newProgress = [...prev];
    //   newProgress.splice(index, 1);
    //   return newProgress;
    // });
  }

  const handleRetry = (index: number) => {
    dispatch(actionCreators.setUploadingStatus(uuid, isGroup, true))

    setFiles((prevFiles) => {
      const newFiles = [...prevFiles]
      newFiles[index].failed = false
      fileRef.current = newFiles
      return newFiles
    })
    chatInstance
      ?.uploadFile(files[index].data, (data: any) =>
        updateProgressState(
          Math.floor((data.loaded / data.total) * 100),
          index,
          uuid,
          files[index].fileID
        )
      )
      .then((res: any) => {
        updatePath(res, index, uuid, files[index].fileID)
      })
      .catch((error: any) => {
        handleUploadFailed(index, uuid, files[index].fileID)
      })
  }

  const clearFiles = () => {
    fileRef.current = []
    setFiles([])

    dispatch(actionCreators.setUploadingStatus(uuid, isGroup, false))

    //dispatch(actionCreators.setAttachment(uuid, [], isGroup));
    //setProgressArray([])
  }

  return {
    files,
    handleFileChange,
    handleFileRemove,
    clearFiles,
    handlePasteFile,
    isMaxSize,
    handleRetry,
  }
}

export default useUploadFiles
