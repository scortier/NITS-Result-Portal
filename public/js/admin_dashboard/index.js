let count = 0 // count of all the rows / forms in the body
const tbodyElem = document.getElementById('tbody')
var inputs = document.querySelectorAll('.inputfile')
const sendForm = (formData) => {
    return fetch('/admin/result/upload', {
        method: 'POST',
        body: formData,
    })
        .then((res) => res.json())
        .then((data) => console.log(data))
        .catch((err) => console.log(err))
}

const addRow = () => {
    console.log('clicked')
    count += 1
    let row_template = `<tr>
    <td><form 
        class="row-form" 
        id="row${count}"
        onkeydown="return event.key != 'Enter';"
        accept=".csv"
        ></form>
    </td>
    <td class="mdl-data-table__cell--non-numeric">
        <div class="input-field">
           <input
                class="inputfile"
                form="row${count}"
                id="file${count}"
                type="file"
                name="csvfile"
                data-multiple-caption="{count} files selected" 
               />
            <label for="file${count}">Choose a file</label>
        </div>
    </td>
    <td>
        <div class="mdl-textfield mdl-js-textfield">
            <input
                class="mdl-textfield__input year"
                type="text"
                id="year${count}"
                form="row${count}"
                name="year"
                placeholder = "Year"
            />
           
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

    // console.log(document.getElementsByClassName('row-form'))
}

const uploadAll = () => {
    if (confirm(`This will upload all ${count} file(s)?`)) {
        document.getElementById('submit-all').innerHTML = 'Processing...'
        allForms = document.getElementsByClassName('row-form')
        // allForms.forEach((formElement) => {
        //     formElement.submit()
        // })
        promises = []
        for (let i = 0; i < allForms.length; i++) {
            console.log('Submitting Form', i)
            // allForms[i].submit();
            formData = new FormData(allForms[i])
            promises.push(sendForm(formData))
        }
        Promise.all(promises).then(
            () =>
                (document.getElementById('submit-all').innerHTML =
                    'Upload All Files')
        )
    }
}
window.onload = () => {
    addRow()
}

document.getElementById('add-row').addEventListener('click', addRow)
document.getElementById('submit-all').addEventListener('click', uploadAll)

document.body.addEventListener('change', () => {
    inputs = document.querySelectorAll('.inputfile')
    inputs.forEach((input) => {
        var label = input.nextElementSibling

        input.addEventListener('focus', function () {
            input.classList.add('has-focus')
        })
        input.addEventListener('blur', function () {
            input.classList.remove('has-focus')
        })

        var fileName = ''
        if (input.files && input.files.length > 1) {
            fileName = (
                this.getAttribute('data-multiple-caption') || ''
            ).replace('{count}', input.files.length)
        }
        if (input.files[0] != undefined) fileName = input.files[0].name

        if (input.files[0] != undefined)
            label.innerHTML = fileName.substr(0, 20)
    })
})
