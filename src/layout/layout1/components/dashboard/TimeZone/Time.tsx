// import React, { useState } from 'react'
// import ReactDOM from 'react-dom'
// import TimezoneSelect, { allTimezones } from 'react-timezone-select'

// const Time = (props: any) => {

//     // const {selectedTimezone, setSelectedTimezone}= props;

//     const [timezone, setTimezone] = useState(
//         Intl.DateTimeFormat().resolvedOptions().timeZone
//     )

//     const setSelectedTimezone = (event: any) => {
//         setTimezone(event.target.value)

//         // 

//     }

//     // const [selectedTimezone, setSelectedTimezone] = useState({})

//     return (
//         <div className="App">
//             <h2>react-timezone-select</h2>
//             <blockquote>Please make a selection</blockquote>
//             <div className="select-wrapper">
//                 <TimezoneSelect
//                     value={timezone}
//                     onChange={(event) => setSelectedTimezone(event)}
//                     timezones={{
//                         ...allTimezones,
//                         'America/Lima': 'Pittsburgh',
//                         'Europe/Berlin': 'Frankfurt',
//                     }}
//                 />
//             </div>
//             <h3>Output:</h3>
//             <div
//                 style={{
//                     backgroundColor: '#ccc',
//                     padding: '20px',
//                     margin: '20px auto',
//                     borderRadius: '5px',
//                     maxWidth: '600px',
//                 }}
//             >
//                 <pre
//                     style={{
//                         margin: '0 20px',
//                         fontWeight: 500,
//                         fontFamily: 'monospace',
//                     }}
//                 >
//                     {JSON.stringify(selectedTimezone, null, 2)}
//                 </pre>
//             </div>
//         </div>
//     )
// }
// export default Time



import React from 'react'
import timezones from "timezones-list";
import DropDown from '../../../../../atom/DropDown/dropDown';
// import moment from 'moment-timezone';

const Time = (props: any) => {
    const { value, onChange } = props;
    // const moment = require('moment-timezone');

    return (
        <div>
            <select
                className='border-[0.5px] border-solid rounded-[3px] box-border border-[#404041] px-3 py-2 bg-[white]'
                value={value}
                onChange={onChange}
            >
                {
                    timezones.map((timeZone: any) => {
                        return (
                            <option key={timeZone.label} value={timeZone.label} >
                                {timeZone.label}
                            </option>
                        )
                    })
                }
            </select>
        </div>
    )
}

export default Time

