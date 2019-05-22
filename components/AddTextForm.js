import React from 'react'

export default class AddTextForm extends React.Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this)
    }
    render() {
        return <form onSubmit={this.onSubmit}>
            <div>
                <input name="key" type="text" ></input>
            </div>
            <div>
                <input name="value" type="text" ></input>
            </div>
            <div>
                <button>submit</button>
            </div>
        </form>
    }

    async onSubmit(e) {
        e.preventDefault();
        const {target:{key:keyEl, value:valueEl}} = e;
        const key = keyEl.value;
        const value = valueEl.value;

        console.log(`key: ${key}, value: ${value}`)

        const res = await fetch(`http://localhost:3000/api/${encodeURIComponent(key)}`, {
            method:'POST', 
            headers: {
                // Check what headers the API needs. A couple of usuals right below
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({text:value})
        })
        const data = await res.json()

        console.log(data);

        keyEl.value = ''
        valueEl.value = ''
    }
}


// const AddTextForm = (submitText) => (
//     <form action="javascript:" onSubmit={({target:{key, value}}) => {
//         console.log(`key: ${key.value}, value: ${value.value}`)
//         submitText(key.value, value.value)
//         key.value = ''
//         value.value = ''
//     }}>
//         <div>
//             <input name="key" type="text" ></input>
//         </div>
//         <div>
//             <input name="value" type="text" ></input>
//         </div>
//         <div>
//             <button>submit</button>
//         </div>
//     </form>
// )

// export default AddTextForm