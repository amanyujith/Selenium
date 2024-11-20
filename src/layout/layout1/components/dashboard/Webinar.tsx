import checkBox from '../../../../atom/CheckBox/checkBox';
import DateField from '../../../../atom/DateField/dateField';
import DropDown from '../../../../atom/DropDown/dropDown';
import InputFields from '../../../../atom/InputField/inputField';
import TimeField from '../../../../atom/TimeField/timeField';
import CheckBox from '../../../../atom/CheckBox/checkBox';
import RadioButton from '../../../../atom/RadioButtons/radioButtons';
import HomeButton from '../../../../atom/HomeButton/homeButton';
import { useEffect, useState } from 'react';
import Time from './TimeZone/Time';

const Webinar = () => {


    const AmPm = ['AM', 'PM']

    const [mins, setmins] = useState([])
    const [hrs, setHrs] = useState([])
    useEffect(() => {
        let a: any = [...mins];
        let b: any = [...hrs];
        if (a.length === 0) {
            for (let i = 0; i <= 60; i++) {
                if (i < 13) {
                    b.push(i)
                }

                a.push(i);

            }
        }

        setmins(a)
        setHrs(b)
    }, [])
    


    return (
        <div className='w-[calc(100vw-312px)] mt-5 ml-5 text-left'>
            <div className=' text-xl font-bold mb-8 text-primary-200'>Webinar</div>
            <div className='pl-[7px]'>
                <div className='flex'>
                    <p className=' w-48 mr-1 text-[16px] left-5 text-primary-200'>
                        Topic
                    </p>
                    <InputFields label={'My meeting'} name={'myMeeting'} autoFocus={true} />
                </div>
                <div className='flex mt-3'>
                    <p className='w-48 mr-1 text-[16px] left-5 text-primary-200'>
                        Description
                    </p>
                    <InputFields label={''} name={'Description'} />
                </div>
                <div className='flex items-center mt-3'>
                    <p className='w-48 mr-1 text-[16px] left-5 text-primary-200'>
                        When
                    </p>
                    <DateField color={''} label={'meetingDate'} id={"meetingDate"} restClass={'mr-5'} />
                    <TimeField color={''} label={'meetingTime'} id={'meetingTime'} restClass={'mr-5'} />
                    {/* <DropDown restClass={' w-20 '} >
                    </DropDown> */}
                    <select className='border-[0.5px] border-solid rounded-[3px] box-border border-[#404041] px-3 py-2 bg-[white]'>
                        {
                            AmPm.map((datas: any) => {
                                return (
                                    <option>{datas}</option>
                                )
                            })
                        }

                        {/* <option value="AM"> AM</option>
                        <option value="PM"> PM</option> */}

                    </select>
                </div>
                {/* <div className='flex mt-3'>
                    <p className='w-48 mr-1 text-[16px] left-5 text-primary-200'>
                        Duration
                    </p>
                    <InputFields label={''} name={'Description'} />
                </div>
                <div className='flex mt-3'>
                    <p className='w-48 mr-1 text-[16px] left-5 text-primary-200'>
                        Time zone
                    </p>
                    <InputFields label={''} name={'Description'} />
                </div> */}



                <div className='flex mt-3'>
                    <p className='w-48 mr-1 text-[16px] left-5 text-primary-200'>
                        Duration
                    </p>
                    <p className='text-primary-200 items-center'>hr</p>&nbsp;&nbsp;
                    <select className='border-[0.5px] border-solid rounded-[3px] box-border border-[#404041] px-3 py-2 bg-[white]'>
                        {
                            hrs.map((digits: any) => {
                                return (
                                    <option>{digits}</option>
                                )
                            })
                        }

                    </select> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                    <p className='text-primary-200 items-center'>min</p>&nbsp;&nbsp;
                    <select className='border-[0.5px] border-solid rounded-[3px] box-border border-[#404041] px-3 py-2 bg-[white]'>
                        {
                            mins.map((digit: any) => {
                                return (
                                    <option>{digit}</option>
                                )
                            })
                        }
                    </select>
                </div>
                <div className='flex mt-3'>
                    <p className='w-48 mr-1 text-[16px] left-5 text-primary-200'>
                        Time zone
                    </p>
                    <Time />
                </div>



                <div className='flex mt-5'>
                    <p className='w-48 mr-1 text-[16px] left-5 text-primary-200'>
                        On Start
                    </p>
                    <RadioButton
                        radioData={[
                            { id: 'option1', label: 'Keep all video off', value: 'videoOff' }
                            , { id: 'option2', label: 'Mute all mics', value: 'mute' }
                        ]}
                        name={'audioVideoStatus'}
                        restClass={'mr-10'}
                    />
                </div>

                <div className='flex mt-5'>
                    <p className='w-48 mr-1 text-[16px] left-5 text-primary-200'>
                        Presenter
                    </p>
                    <InputFields label={'Enter email ID'} name={'emailID'} />
                </div>

                <div className='flex mt-5'>
                    <p className='w-48 mr-1 text-[16px] left-5 text-primary-200'>
                        Participants
                    </p>
                    <InputFields label={'Invite with email IDs'} name={'emailID'} />
                </div>
            </div>
            <div className='absolute right-7 bottom-14 '>
                <HomeButton color={'[#ffffff]'} restClass={'w-24 text-[#000000]'}>
                    Cancel
                </HomeButton>
                <HomeButton color={'primary-200'} restClass={'w-24'}>
                    Save
                </HomeButton>
            </div>
        </div>
    )
}

export default Webinar