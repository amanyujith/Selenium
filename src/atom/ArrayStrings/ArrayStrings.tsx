import {  useState } from "react";

const ArrayStrings = (props: any) => {
    const { name, label } = props;
    const [value, setValue] = useState('');
    const [node, setNode]: any = useState([])
    const handleChange = (evt: any) => {
        setValue(evt.target.value);
    };
    
   
    const handleKeyDown = (evt: any) => {
        if (['Enter', 'Tab', ','].includes(evt.key)) {
            evt.preventDefault();
            let n = value.trim();
            if (n) {
                updateData(n);
                setValue('');
            }
        }
    };
    const updateData = (str: any) => {
        node.push(str);
    }
    

    const handleDelete = (data: any, index: number) => {
        let n = [...node]
        n.splice(index, 1)
        setNode(n)

    }

    return (

        <div
            className="border-[0.5px] border-solid rounded-[3px] box-border border-[#404041] px-3 py-2"

        >
            <input
                // placeholder="Type here !"
                value={value}
                name={name}
                placeholder={label}
                onChange={(e: any) => handleChange(e)}
                onKeyDown={(e) => handleKeyDown(e)}
                className='outline-none'
            />
            <div className="flex w-[380px] flex-wrap" >
                {node.map((data: any, index: number) =>
                    <div key={data} className="p-2">
                        {data}

                        <button onClick={() => handleDelete(data, index)}>
                            <svg width="12" height="12" viewBox='0 0 12 12' fill='none'>
                                <path d="M11.8332 1.34297L10.6582 0.167969L5.99984 4.8263L1.3415 0.167969L0.166504 1.34297L4.82484 6.0013L0.166504 10.6596L1.3415 11.8346L5.99984 7.1763L10.6582 11.8346L11.8332 10.6596L7.17484 6.0013L11.8332 1.34297Z" fill="#A7A9AB"></path>
                            </svg>
                        </button>

                    </div>)}
            </div>

        </div>


    )
}
export default ArrayStrings;