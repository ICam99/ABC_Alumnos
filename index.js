document.addEventListener('DOMContentLoaded', function() {

  const studentContainer = document.querySelector('#student-container')
  const studentURL = `http://localhost:3000/students`
  const studentForm = document.querySelector('#student-form')
  let allstudents = []

  fetch(`${studentURL}`)
    .then( response => response.json() )
    .then( studentData => studentData.forEach(function(student) {
      allstudents = studentData
      studentContainer.innerHTML += `
      <div id=student-${student.id}>
        <h4>${student.id}: ${student.nombre} ${student.paterno} ${student.materno}</h4>
        <h4>Fecha de nacimiento: ${student.fecha}</h4>
        <h4>Carrera: ${student.carrera}</h4>
        <button data-id=${student.id} id="edit-${student.id}" data-action="edit">Edit</button>
        <button data-id=${student.id} id="delete-${student.id}" data-action="delete">Delete</button>
      </div>
      <div id=edit-student-${student.id}>
      </div>`
    })) // end of student fetch


    studentForm.addEventListener('submit', (e) => {
    event.preventDefault();

    const idInput = studentForm.querySelector('#id').value
    const paternoInput = studentForm.querySelector('#paterno').value
    const maternoInput = studentForm.querySelector('#materno').value
    const nombreInput = studentForm.querySelector('#nombre').value
    const fechaInput = studentForm.querySelector('#fecha').value
    const carreraInput = studentForm.querySelector('#carrera').value

    fetch(`${studentURL}`, {
      method: 'POST',
      body: JSON.stringify({
        id: idInput,
        paterno: paternoInput,
        materno: maternoInput,
        nombre: nombreInput,
		fecha: fechaInput,
		carrera: carreraInput
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then( response => response.json())
      .then( student => {
        allstudents.push(student)
        studentContainer.innerHTML += `
      <div id=student-${student.id}>
        <h4>${student.id}: ${student.nombre} ${student.paterno} ${student.materno}</h4>
        <h4>Fecha de nacimiento: ${student.fecha}</h4>
        <h4>Carrera: ${student.carrera}</h4>
        <button data-id=${student.id} id="edit-${student.id}" data-action="edit">Edit</button>
        <button data-id=${student.id} id="delete-${student.id}" data-action="delete">Delete</button>
      </div>
      <div id=edit-student-${student.id}>
      </div>`
      })

  }) // end of eventListener for adding a student

  studentContainer.addEventListener('click', (e) => {
    if (e.target.dataset.action === 'edit') {

      const editButton = document.querySelector(`#edit-${e.target.dataset.id}`)
      editButton.disabled = true

      const studentData = allstudents.find((student) => {
        return student.id == e.target.dataset.id
      })

      const editForm = studentContainer.querySelector(`#edit-student-${e.target.dataset.id}`)
      editForm.innerHTML = `
        <form class='form' id='edit-student' action='index.html' method='post'>
          <form id="student-form">
            <input required id="edit-id" placeholder="${studentData.id}">
            <input required id="edit-paterno" placeholder="${studentData.paterno}">
            <input required id="edit-materno" placeholder="${studentData.materno}">
            <input required id="edit-nombre" placeholder="${studentData.nombre}">
            <input required id="edit-fecha" placeholder="${studentData.fecha}">
            <input required id="edit-carrera" placeholder="${studentData.carrera}">
            <input type="submit" value="Edit student">
        </form>`

        editForm.addEventListener("submit", (e) => {
          event.preventDefault()

          const idInput = document.querySelector("#edit-id").value
          const paternoInput = document.querySelector("#edit-paterno").value
          const maternoInput = document.querySelector("#edit-materno").value
          const nombreInput = document.querySelector("#edit-nombre").value
          const fechaInput = document.querySelector("#edit-fecha").value
          const carreraInput = document.querySelector("#edit-carrera").value
          const editedstudent = document.querySelector(`#student-${studentData.id}`)

          fetch(`${studentURL}/${studentData.id}`, {
            method: 'PATCH',
            body: JSON.stringify({
        id: idInput,
        paterno: paternoInput,
        materno: maternoInput,
        nombre: nombreInput,
		fecha: fechaInput,
		carrera: carreraInput
      }),
            headers: {
              'Content-Type': 'application/json'
            }
          }).then( response => response.json() )
          .then( student => {
            editedstudent.innerHTML = `
      <div id=student-${student.id}>
        <h4>${student.id}: ${student.nombre} ${student.paterno} ${student.materno}</h4>
        <h4>Fecha de nacimiento: ${student.fecha}</h4>
        <h4>Carrera: ${student.carrera}</h4>
        <button data-id=${student.id} id="edit-${student.id}" data-action="edit">Edit</button>
        <button data-id=${student.id} id="delete-${student.id}" data-action="delete">Delete</button>
      </div>
      <div id=edit-student-${student.id}>
      </div>`
            editForm.innerHTML = ""
          })
      }) // end of this event Listener for edit submit

    } else if (e.target.dataset.action === 'delete') {
      document.querySelector(`#student-${e.target.dataset.id}`).remove()
        fetch(`${studentURL}/${e.target.dataset.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        }).then( response => response.json())
      }

  }) // end of eventListener for editing and deleting a student

})
