async function submitEvent(e){
    try{
        e.preventDefault();
    
        email=e.target.email.value;
        password=e.target.password.value;
        const obj={
            email,password
        }
        const check=await axios.post('http://16.171.15.72:4000/user/login',obj)
        //const check=await axios.post('http://localhost:4000/user/login',obj)
        alert(check.data.message);
        localStorage.setItem('token',check.data.token);

        window.location.href="../expense/expense.html"
 
    }
    catch(err){
        console.log('error occur in login');
        console.log(err.message);
        document.body.innerHTML +=`<div style="color:red;">${err.message}</div>`
    }
    
}

function forgotpassword(){
    window.location.href="../forgotpassword/forgetpasswordform.html"
}
//Frontend\forgotpassword\forgetpasswordform.html
function redirectSignup(){
    window.location.href="../signup/signup.html"
}