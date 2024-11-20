import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionCreators } from "../../../../store";
// import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
import { useState, memo, useEffect } from "react";

const FileSharePreview = () => {
  const fileShareState = useSelector((state: any) => state.Main.fileShareState);
  const enableDownload = useSelector(
    (state: any) => state.Flag.setFileDownload
  );
  const enableNavigate = useSelector(
    (state: any) => state.Flag.setFileNavigate
  );
  const whiteBoardState = useSelector(
    (state: any) => state.Main.whiteBoardState
  );
  const isHost = useSelector((state: any) => state.Flag.isHost);

  

  // const [previewFile, setPreviewFile] = useState([{ uri: "" }]);
  
  const [previewFile, setPreviewFile] = useState([{ uri: "" }]);
  // const [previewFile, setPreviewFile] = useState<any>([{ uri: "https://calibre-ebook.com/downloads/demos/demo.docx" }]);
  // const [previewFile, setPreviewFile] = useState<any>([{ uri: "https://scholar.harvard.edu/files/torman_personal/files/samplepptx.pptx" }]);
  // const blob = b64toBlob(b64Data, contentType);
  // const blobUrl = URL.createObjectURL(blob);
  useEffect(() => {
    if (fileShareState.base64?.url) {
      const data = [
        {
          uri: fileShareState.base64.url,
        },
      ];
      setPreviewFile([...data]);
      
      // fetch(fileShareState.base64)
      //   .then((res) =>
      //     res.blob())
      //   .then((blob) => {
      //     blob = blob.slice(0, blob.size, "application/pdf")
      //     // const url = window.URL.createObjectURL(
      //     //   new Blob([blob]),
      //     // );
      //     const reader = new FileReader();
      //     reader.readAsDataURL(blob);
      //     reader.onload = () => {
      //       var url = reader.result as string;
      //       
      //       const data = [{
      //         uri: url
      //       }]
      //       setPreviewFile([...data])
      //     };
      //     reader.onerror = () => {
      //       throw new Error('Fail to load the file');
      //     };

      //   })
    }

    // loadFile();
  }, [fileShareState]);
  // const loadFile = async()=>{
  //   const base64Response = await fetch(fileShareState.base64);
  //   const blob = await base64Response.blob();
  //   const url = URL.createObjectURL(blob);
  //   
  //   setPreviewFile([{ uri: url }])
  // }
  return (
    <div className="bg-[white] fixed top-[51px] left-0 w-full h-[calc(100vh-50px)] z-0">
      <div>
        {/* <DocViewer
          pluginRenderers={DocViewerRenderers}
          documents={previewFile}
          config={{
            header: {
              disableHeader: false,
              disableFileName: false,
              retainURLParams: false,
            },
          }}
          style={{ height: "100%" }}
          className={`
          ${isHost ? "" : enableDownload ? "" : "DownloadDisable"} 
          ${isHost ? "" : enableNavigate ? "" : "NavigateDisable"}
          ${whiteBoardState === "" ? "" : "AdjustMenu"}`}
        /> */}
      </div>
    </div>
  );
};

export default memo(FileSharePreview);
