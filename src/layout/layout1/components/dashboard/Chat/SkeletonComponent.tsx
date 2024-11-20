import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';

const SkeletonComponent = () => {
    return (
      <section>
        <div className="flex flex-row text-right ml-16  mt-3">
          <Skeleton
            height={30}
            width={30}
            baseColor={"#DDDDDD"}
            style={{
              borderRadius: "44.4444px 44.4444px 44.4444px 0px",
            }}
          />
          <div className="ml-3 flex flex-col gap-3 text-left">
            <Skeleton height={49} width={967} borderRadius={"10px"} />
            <Skeleton height={49} width={367} borderRadius={"10px"} />
          </div>
        </div>
        <div className="flex flex-row text-right ml-16 mt-3">
          <Skeleton
            height={30}
            width={30}
            baseColor={"#DDDDDD"}
            style={{
              borderRadius: "44.4444px 44.4444px 44.4444px 0px",
            }}
          />
          <div className="ml-3 flex flex-col gap-3 text-left">
            <Skeleton height={49} width={667} borderRadius={"10px"} />
            <Skeleton height={49} width={367} borderRadius={"10px"} />
          </div>
        </div>
        {/* <div className="ml-3 flex flex-col gap-3 text-right mt-4 mr-16">
      <Skeleton height={49} width={467} borderRadius={"10px"}/>
      <Skeleton height={49} width={367} borderRadius={"10px"}/>
      </div> */}

        <div className="flex flex-row text-right ml-16 mt-3 ">
          <Skeleton
            height={30}
            width={30}
            baseColor={"#DDDDDD"}
            style={{
              borderRadius: "44.4444px 44.4444px 44.4444px 0px",
            }}
          />
          <div className="ml-3 flex flex-col gap-3 text-left">
            <Skeleton height={49} width={267} borderRadius={"10px"} />
            <Skeleton height={49} width={967} borderRadius={"10px"} />
          </div>
        </div>
        {/* <div className="ml-3 flex flex-col gap-3 mt-4 text-right mr-16">
      <Skeleton height={49} width={567} borderRadius={"10px"}/>
      <Skeleton height={49} width={100} borderRadius={"10px"}/>
      </div>  */}

        <div className="flex flex-row text-right ml-16 mt-3 ">
          <Skeleton
            height={30}
            width={30}
            baseColor={"#DDDDDD"}
            style={{
              borderRadius: "44.4444px 44.4444px 44.4444px 0px",
            }}
          />
          <div className="ml-3 flex flex-col gap-3 text-left">
            <Skeleton height={49} width={230} borderRadius={"10px"} />
            <Skeleton height={49} width={320} borderRadius={"10px"} />
          </div>
        </div>
        <div className="flex flex-row text-right ml-16 mt-3 ">
          <Skeleton
            height={30}
            width={30}
            baseColor={"#DDDDDD"}
            style={{
              borderRadius: "44.4444px 44.4444px 44.4444px 0px",
            }}
          />
          <div className="ml-3 flex flex-col gap-3 text-left">
            <Skeleton height={49} width={967} borderRadius={"10px"} />
            <Skeleton height={49} width={420} borderRadius={"10px"} />
          </div>
        </div>
        <div className="flex flex-row text-right ml-16 mt-3 ">
          <Skeleton
            height={30}
            width={30}
            baseColor={"#DDDDDD"}
            style={{
              borderRadius: "44.4444px 44.4444px 44.4444px 0px",
            }}
          />
          <div className="ml-3 flex flex-col gap-3 text-left">
            <Skeleton height={49} width={867} borderRadius={"10px"} />
            <Skeleton height={49} width={420} borderRadius={"10px"} />
          </div>
        </div>
      </section>
    );};
 export default SkeletonComponent;