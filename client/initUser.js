const modal = document.querySelector('.modal')
const nickInput = document.getElementById('nick-name')
const colorInput = document.getElementById('my-color')
const saveBtn = document.getElementById('btn-save-nick')


const userName = localStorage.getItem('nick-name')
if(!userName){
    modal.style.display = 'flex'
    saveBtn.addEventListener('click', async () => {
        if(nickInput.value == "") {
            alert('Digite um nick')
        }else{
            localStorage.setItem('nick-name', nickInput.value)
            localStorage.setItem('my-color', colorInput.value)
            window.location.reload()
        }
    })
}