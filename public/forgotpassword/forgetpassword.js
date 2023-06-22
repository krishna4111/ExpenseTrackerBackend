async function submitEvent(e){
    try{
        e.preventDefault();
        const email=e.target.email.value;
        console.log(email)
        const obj={
          email
        }
        
      const send=  await axios.post('http://16.170.239.252:4000/password/forgotpassword',obj);
      if(send.status===201){
        document.body.innerHTML += '<div style="color:red;">Mail Successfuly sent <div>'
      }
      else{
        throw new Error ('Something went wrong!!!')
      }
    }
  catch(err){
    document.body.innerHTML += `<div style="color:red;">${err} <div>`;
  }
}