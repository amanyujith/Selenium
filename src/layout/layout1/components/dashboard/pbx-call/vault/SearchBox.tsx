
// const SearchBox = () => {





//   return (
//     <div
//       onClick={(e: any) => e.stopPropagation()}
//       className="absolute left-auto right-2.5 top-[50px] z-[60] w-[calc(100%-80px)] min-w-[300px] h-fit shadow-[0_4px_9px_0px_rgba(0,0,0,0.20)] bg-[#ffffff] rounded-[5px]"
//     >
//       {!notification && (
//         <div className="h-[30px]">
//           <button
//             className="right-2 top-[13.5px] absolute cursor-pointer z-30 w-[20px]"
//             onClick={handleCloseClick}
//           >
//             <svg width="13" height="13" viewBox="0 0 10 10" fill="none">
//               <path
//                 d="M0.803125 9.98672L0.015625 9.19922L4.21562 4.99922L0.015625 0.799219L0.803125 0.0117188L5.00313 4.21172L9.20312 0.0117188L9.99062 0.799219L5.79063 4.99922L9.99062 9.19922L9.20312 9.98672L5.00313 5.78672L0.803125 9.98672Z"
//                 fill="#A7A9AB"
//               />
//             </svg>
//           </button>
//         </div>
//       )}
//       <div className="h-fit w-full px-5">
//         <div>
//           <div
//             id="searchItemContainer"
//             className="overflow-y-auto overflow-x-hidden max-h-[132px] h-fit text-left"
//           >
//             {!notification && (
//               <div
//                 id="searchResultItem"
//                 onClick={handlesearch}
//                 className="flex flex-row h-fit ml-1 py-2 px-3 cursor-pointer hover:bg-[#0000001f]"
//               >
//                 <svg
//                   className="searchIcon"
//                   width="24"
//                   height="24"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     clip-rule="evenodd"
//                     d="M16 10.0664V16.0664H10C6.68629 16.0664 4 13.3801 4 10.0664C4 6.7527 6.68629 4.06641 10 4.06641C13.3137 4.06641 16 6.7527 16 10.0664ZM2 10.0664C2 5.64813 5.58172 2.06641 10 2.06641C14.4183 2.06641 18 5.64813 18 10.0664V16.0664V16.9668L19.6772 18.644C19.9677 18.9345 19.9677 19.4054 19.6772 19.6958C19.3868 19.9862 18.9159 19.9862 18.6255 19.6958L16.9961 18.0664H16H10C5.58172 18.0664 2 14.4847 2 10.0664Z"
//                     fill="#A7A9AB"
//                   />
//                 </svg>
//                 <div className="ml-3 text-primary-200 text-base">
//                   {searchText}
//                 </div>
//               </div>
//             )}
//             {userList.length > 0 && (
//               <div>
//                 {userList.map((item: any) => (
//                   <div
//                     key={item.uuid}
//                     id="searchResultItem"
//                     {...{ email: item.email }}
//                     className="flex flex-row h-fit ml-1 py-2 px-3 cursor-pointer hover:bg-[#0000001f]"
//                     onClick={() => handleClick(item)}
//                   >
//                     <div
//                       className={`w-[22px] h-[22px] shrink-0 rounded-bl-none rounded-[50%] text-[15px] border-[2px] border-[#E9EBF8] text-[white] bg-[#91785B] overflow-hidden`}
//                     >
//                       {item.profile_picture ? (
//                         <img
//                           className="w-full h-full  object-cover "
//                           src={item.profile_picture}
//                           alt=""
//                         />
//                       ) : item.type === "group" ? (
//                         <svg
//                           className="mt-[5px] ml-[2px]"
//                           width="18"
//                           height="12"
//                           viewBox="0 0 16 7"
//                           fill="none"
//                           xmlns="http://www.w3.org/2000/svg"
//                         >
//                           <path
//                             d="M7.01927 3.33333C6.77483 3.33333 6.57216 3.23889 6.41127 3.05C6.24994 2.86111 6.19149 2.63889 6.23594 2.38333L6.4026 1.35C6.46927 0.961111 6.65549 0.638889 6.96127 0.383333C7.2666 0.127778 7.61371 0 8.0026 0C8.4026 0 8.75549 0.127778 9.06127 0.383333C9.3666 0.638889 9.5526 0.961111 9.61927 1.35L9.78594 2.38333C9.83038 2.63889 9.77216 2.86111 9.61127 3.05C9.44994 3.23889 9.24705 3.33333 9.0026 3.33333H7.01927ZM7.2526 2.33333H8.76927L8.63594 1.51667C8.61371 1.36111 8.54149 1.236 8.41927 1.14133C8.29705 1.04711 8.15816 1 8.0026 1C7.84705 1 7.71083 1.04711 7.59394 1.14133C7.47749 1.236 7.40816 1.36111 7.38594 1.51667L7.2526 2.33333ZM2.28594 3.88333C2.07483 3.89444 1.88883 3.85267 1.72794 3.758C1.5666 3.66378 1.46372 3.51667 1.41927 3.31667C1.39705 3.22778 1.39149 3.14156 1.4026 3.058C1.41372 2.97489 1.43594 2.89444 1.46927 2.81667C1.46927 2.82778 1.46372 2.80556 1.4526 2.75C1.44149 2.72778 1.39705 2.61667 1.31927 2.41667C1.29705 2.29444 1.31105 2.18333 1.36127 2.08333C1.41105 1.98333 1.46927 1.89444 1.53594 1.81667C1.54705 1.81667 1.55816 1.80556 1.56927 1.78333C1.59149 1.60556 1.6666 1.45556 1.7946 1.33333C1.92216 1.21111 2.08038 1.15 2.26927 1.15C2.29149 1.15 2.38038 1.16667 2.53594 1.2H2.58594C2.63038 1.14444 2.69149 1.10556 2.76927 1.08333C2.84705 1.06111 2.92483 1.05 3.0026 1.05C3.11372 1.05 3.21105 1.06667 3.2946 1.1C3.37772 1.13333 3.44149 1.18333 3.48594 1.25C3.49705 1.25 3.50549 1.25267 3.51127 1.258L3.51927 1.26667C3.6526 1.27778 3.76927 1.31933 3.86927 1.39133C3.96927 1.46378 4.04705 1.56111 4.1026 1.68333C4.11372 1.75 4.11927 1.81111 4.11927 1.86667C4.11927 1.92222 4.10816 1.98333 4.08594 2.05L4.1026 2.1C4.16927 2.17778 4.21927 2.25267 4.2526 2.32467C4.28594 2.39711 4.3026 2.47778 4.3026 2.56667C4.3026 2.6 4.27483 2.7 4.21927 2.86667V2.93333C4.23038 2.94444 4.24149 3.02222 4.2526 3.16667C4.2526 3.36667 4.16927 3.536 4.0026 3.67467C3.83594 3.81378 3.63594 3.88333 3.4026 3.88333H2.28594ZM13.1859 3.91667C12.8637 3.91667 12.5915 3.80556 12.3693 3.58333C12.147 3.36111 12.0359 3.09444 12.0359 2.78333C12.0359 2.66111 12.0526 2.55289 12.0859 2.45867C12.1193 2.364 12.1637 2.26667 12.2193 2.16667L11.8193 1.81667C11.7193 1.73889 11.7026 1.64444 11.7693 1.53333C11.8359 1.42222 11.9248 1.36667 12.0359 1.36667H13.1693C13.4915 1.36667 13.7637 1.47778 13.9859 1.7C14.2082 1.92222 14.3193 2.18889 14.3193 2.5V2.78333C14.3193 3.09444 14.2082 3.36111 13.9859 3.58333C13.7637 3.80556 13.497 3.91667 13.1859 3.91667ZM0.335938 6.86667V6.05C0.335938 5.59445 0.569271 5.22778 1.03594 4.95C1.5026 4.67222 2.1026 4.53333 2.83594 4.53333C2.98038 4.53333 3.11371 4.536 3.23594 4.54133C3.35816 4.54711 3.47483 4.56111 3.58594 4.58333C3.46372 4.78333 3.36927 4.99444 3.3026 5.21667C3.23594 5.43889 3.2026 5.67222 3.2026 5.91667V6.86667H0.335938ZM4.33594 6.86667V5.95C4.33594 5.30556 4.67483 4.79178 5.3526 4.40867C6.03038 4.02511 6.91371 3.83333 8.0026 3.83333C9.1026 3.83333 9.98883 4.02511 10.6613 4.40867C11.3333 4.79178 11.6693 5.30556 11.6693 5.95V6.86667H4.33594ZM13.1693 4.53333C13.9137 4.53333 14.5164 4.67222 14.9773 4.95C15.4386 5.22778 15.6693 5.59445 15.6693 6.05V6.86667H12.8026V5.91667C12.8026 5.67222 12.7719 5.43889 12.7106 5.21667C12.6497 4.99444 12.5582 4.78333 12.4359 4.58333C12.5582 4.56111 12.6804 4.54711 12.8026 4.54133C12.9248 4.536 13.047 4.53333 13.1693 4.53333ZM8.0026 4.83333C7.31371 4.83333 6.71927 4.92489 6.21927 5.108C5.71927 5.29156 5.44149 5.51667 5.38594 5.78333V5.86667H10.6359V5.78333C10.5693 5.51667 10.2888 5.29156 9.7946 5.108C9.29994 4.92489 8.7026 4.83333 8.0026 4.83333Z"
//                             fill="#404041"
//                           />
//                         </svg>
//                       ) : (
//                         <div className="ml-[5px]">
//                           {item.display_name?.slice(0, 1).toUpperCase()}
//                         </div>
//                       )}
//                     </div>
//                     <div className="ml-3 text-primary-200 text-base">
//                       {item.type === "group" ? item.name : item.display_name}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default SearchBox
import React from 'react'

const SearchBox = () => {
  return (
    <div>
      
    </div>
  )
}

export default SearchBox
