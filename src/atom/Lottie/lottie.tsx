
import Lottie from "react-lottie";

const Lottiefy = (props: any) => {
  const { json, loop, height, width } = props;
  const defaultOptions = {
    loop: loop || false,
    autoplay: true,
    animationData: json,

    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <Lottie
      options={defaultOptions}
      height={height}
      isClickToPauseDisabled={true}
      width={width}
    />
  );
};
export default Lottiefy;
