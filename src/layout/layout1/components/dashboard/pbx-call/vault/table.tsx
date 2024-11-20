import emptyfile from "../../../../../../constants/images/emptyFile.jpg"
import Skeleton, { SkeletonTheme } from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import Lottiefy from "../../../../../../atom/Lottie/lottie"
import noData from "../../../../../../atom/Lottie/nodata.json"
// import { TableTitles } from "../../../../services/interfaces";

function Table(props: {
  tableTitles: any[]
  tableData: any
  tableClass?: string
  headClass?: string
  mainClass: string
  dataExist?: number
  handleAction?: (args: string) => void
}) {
  const {
    tableTitles,
    tableData,
    tableClass,
    headClass,
    mainClass,
    handleAction,
    dataExist,
  } = props

  return (
    <div
      data-testid="table"
      className={` table-fix-head block mx-auto w-[95%] overflow-auto ${mainClass}`}
    >
      <table className={`${tableClass} table-fixed`}>
        <thead className="text-xs sticky top-0 z-10">
          <tr className="">
            {tableTitles?.map((node: any, index: number) => {
              return (
                <th
                  key={index}
                  scope="col"
                  className={`py-3 pl-6 text-left text-[15px] ${headClass}`}
                >
                  {node.type === "checkbox" && node?.selectAll ? null : (
                    // <Checkbox className="" checked={node?.selectAll} onChange={() => null} />
                    <div
                      className={`flex 
                   items-center font-semibold text-[#543D37] text-sm`}
                    >
                      {node?.title}
                      <a href="#">{node?.icon} </a>
                    </div>
                  )}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody className="relative ">
          {dataExist || tableData === undefined ? (
            tableData?.length ? (
              tableData?.map((node: any, index: number) => {
                const rowColorClass = index % 2 === 0 ? "" : "bg-[#EBEDEF]"
                return (
                  <tr
                    key={index}
                    className={`${rowColorClass} first-letter:cursor-pointer cursor-default hover:bg-[#FEF4E9] group
                  }`}
                  >
                    {tableTitles?.map((column: any, colIndex: number) => {
                      return (
                        <td
                          key={colIndex}
                          className={`px-1 text-[#543D37] pl-6`}
                        >
                          {column.type === "checkbox" ? null : column.type === // /> //   onChange={() => null} //   checked={node[column.key]} // <Checkbox
                            "badge" ? (
                            <div className=" rounded-full bg-[lightgreen] px-4 py-2 inline-block">
                              {node[column.key]}
                            </div>
                          ) : column.type === "chips" ? (
                            node[column.key].map((item: any) => {
                              return (
                                <div className="rounded-full bg-[#dddddd] mx-1.5 px-4 py-2 inline-block">
                                  {item[column.props.display]}
                                </div>
                              )
                            })
                          ) : column.type === "icons" ? (
                            column.childrens.map((item: any) => {
                              return (
                                <div
                                  onClick={() => item.action(node)}
                                  className="inline-block px-2 cursor-pointer hover:text-primary"
                                >
                                  {item.icon}
                                </div>
                              )
                            })
                          ) : column.type === "hover" ? (
                            <div className="flex px-4 py-2 rounded-full hover:text-[#fff] justify-between">
                              <div>{node[column?.key]}</div>
                              <div>
                                {column.childrens.map((item: any) => {
                                  return (
                                    <div
                                      onClick={() => {
                                        if (
                                          item.action === "call" &&
                                          handleAction
                                        )
                                          handleAction(node.number)
                                      }}
                                      className="inline-block px-1 invisible group-hover:visible text-white-svg cursor-pointer group-hover:text-primary"
                                    >
                                      {item.icon}
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          ) : column.type === "typeCall" ? (
                            <div>
                              <div className="flex  gap-1">
                                <div className="w-[15px] h-[15px]  bg-[#ffffff] mt-1 rounded-[50%] flex justify-center items-center">
                                  {node[column.key]?.icon}
                                </div>
                                <span className="text-[16px]">
                                  {node[column.key]?.text}
                                </span>
                              </div>
                              <span className="text-[12px] ml-4  px-[4px] bg-[#ffffff] rounded-xl">
                                {node[column.key]?.number}
                              </span>
                            </div>
                          ) : column.type === "Details" ? (
                            <div>
                              <span className="text-[16px]">
                                {node[column?.key]?.name === "Unknown" ||
                                !node[column?.key]?.name
                                  ? node[column?.key]?.number
                                  : node[column?.key]?.name}
                              </span>
                              <div className="flex ">
                                <div className="w-[15px] h-[15px]  bg-[#ffffff] rounded-[50%] flex justify-center items-center">
                                  {node[column.key]?.icon}
                                </div>
                                <span className="text-[12px] ml-1  px-[4px] rounded-xl">
                                  {/* {node[column.key]?.number} */}
                                  {node[column.key]?.text}
                                </span>
                              </div>
                            </div>
                          ) : column.type === "voiceMail" ? (
                            node[column.type] && (
                              <div className="flex gap-2">
                                <div className="border-[3px] px-0.5 h-[18px] mt-1 flex  items-center pt-0.5 font-semibold">
                                  <span className="text-[13px]">T</span>
                                  <span className="text-[10px] pt-[4px]">
                                    T
                                  </span>
                                </div>
                                <div>
                                  <div
                                    // onClick={() => handlePlayPause()}
                                    className={` ml-2 inline-block bg-[#FCD3A3]  p-[2px] cursor-pointer h-[24px] w-[24px] rounded-[5px] border border-[#EEE]`}
                                  >
                                    <svg
                                      width="18"
                                      height="18"
                                      viewBox="0 0 18 18"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M4.75937 3.07255C4.60625 2.9788 4.4125 2.97567 4.25312 3.06317C4.09375 3.15067 3.99687 3.31942 3.99687 3.50067V14.5007C3.99687 14.6819 4.09375 14.8475 4.25312 14.9382C4.4125 15.0288 4.60312 15.0225 4.75937 14.9288L13.7594 9.4288C13.9094 9.33817 14 9.17567 14 9.00067C14 8.82567 13.9094 8.6663 13.7594 8.57255L4.75937 3.07255ZM3.76562 2.1913C4.24063 1.92567 4.81875 1.93817 5.28125 2.21942L14.2812 7.71942C14.7281 7.9913 15 8.47567 15 9.00067C15 9.52567 14.7281 10.0069 14.2812 10.2819L5.28125 15.7819C4.81875 16.0663 4.2375 16.0757 3.76562 15.81C3.29375 15.5444 3 15.0444 3 14.5007V3.50067C3 2.95692 3.29375 2.45692 3.76562 2.1913Z"
                                        fill="#5C6779"
                                      />
                                    </svg>
                                  </div>
                                </div>
                                <div className="text-[#5C6779] ">
                                  02m 32 sec
                                </div>
                              </div>
                            )
                          ) : (
                            node[column.key]
                          )}
                        </td>
                      )
                    })}
                  </tr>
                )
              })
            ) : (
              <div className="absolute top-20 flex flex-col w-full -ml-8 justify-center items-center ">
                <Lottiefy loop={true} json={noData} height={150} width={150} />
                {/* <img src={emptyfile} className="w-fit" alt="" /> */}
                <div className="text-[#C4C4C4] text-lg py-2">
                  No data found!
                </div>
              </div>
            )
          ) : (
            <tr>
              <SkeletonTheme
                baseColor="#FAFAF7"
                highlightColor="#e5e5e1"
                borderRadius="0.4rem"
                duration={4}
              >
                {tableTitles?.map((column: any, colIndex: number) => {
                  return (
                    <td
                      key={"row" + colIndex}
                      id={"row" + colIndex}
                      className={`w-fit mt-4 pr-4 text-[#543D37] text-base relative `}
                    >
                      <Skeleton
                        style={{ marginBottom: 10 }}
                        height={"45px"}
                        count={5}
                      />
                    </td>
                  )
                })}
              </SkeletonTheme>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Table
