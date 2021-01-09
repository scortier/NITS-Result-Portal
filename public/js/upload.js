const btn =document.querySelector('.custom-file-input');
const input=document.querySelector("input[type='file']");
btn.addEventListener("click",()=>{
    input.click();
})
input.addEventListener("change",()=>{ 
    btn.innerText="Img selected";
    btn.style.backgroundColor="#1dd00c";
    
})