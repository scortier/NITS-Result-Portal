let count = 0 // count of all the rows / forms in the body
const tbodyElem = document.getElementById('tbody') 

const addRow = () => {
    console.log('clicked')
    count += 1;
    let row_template = `<tr>
    <td><form 
        action="/admin/uploadtest" 
        method="POST" 
        class="row-form" 
        id="row${count}" 
        onkeydown="return event.key != 'Enter';"
        ></form>
    </td>
    <td class="mdl-data-table__cell--non-numeric">
        <div class="input-field">
            <input
                form="row${count}"
                id="file${count}"
                type="file"
                class="validate"
                name="file"
            />
        </div>
    </td>
    <td>
        <div class="mdl-textfield mdl-js-textfield">
            <input
                class="mdl-textfield__input"
                type="text"
                id="year${count}"
                form="row${count}"
                name="year"
            />
            <label
                class="mdl-textfield__label"
                for="year${count}"
                >Year</label
            >
        </div>
    </td>
    <td>
        <div
            class="sem-select mdl-textfield mdl-js-textfield"
        >
            <select
                form="row${count}"
                class="mdl-textfield__input"
                name="sem"
                id="sem${count}"
            >
                <option value="1">1st</option>
                <option value="2">2nd</option>
                <option value="3">3rd</option>
                <option value="4">4th</option>
                <option value="5">5th</option>
                <option value="6">6th</option>
                <option value="7">7th</option>
                <option value="8">8th</option>
            </select>
        </div>
    </td>
    <td>
        <div class="mdl-textfield mdl-js-textfield">
            <select
                class="mdl-textfield__input"
                name="branch"
                id="branch${count}"
                form="row${count}"
            >
                <option value="CE">
                    Civil Engineering
                </option>
                <option value="CSE">
                    Computer Science and Engineering
                </option>
                <option value="ECE">
                    Electronics and Communication
                    Engineering
                </option>
                <option value="EIE">
                    Electronics and Instrumentation
                    Engineering
                </option>
                <option value="EE">
                    Electrical Engineering
                </option>
                <option value="ME">
                    Mechanical Engineering
                </option>
            </select>
        </div>
    </td>
    </tr>`

    tbodyElem.insertAdjacentHTML('beforeend', row_template)
    console.log(document.getElementsByClassName('row-form'))
}

const uploadAll = () => {
    if(confirm(`This will upload all ${count} file(s)?`))
    {
        allForms = document.getElementsByClassName('row-form')
        // allForms.forEach((formElement) => {
        //     formElement.submit()
        // })
        for(let i = 0; i < allForms.length; i++) {
            allForms[i].submit();
        }
    }
}
window.onload = () => {
    addRow()
}

document.getElementById('add-row').addEventListener('click', addRow)
document.getElementById('submit-all').addEventListener('click', uploadAll)

