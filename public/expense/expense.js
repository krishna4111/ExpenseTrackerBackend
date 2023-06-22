async function addFunction(e) {
  try {
    e.preventDefault();
    const amount = e.target.amount.value;
    const description = e.target.description.value;
    const category = e.target.category.value;
    obj = {
      amount,
      description,
      category,
    };
    const token = localStorage.getItem("token");
  const response=  await axios.post("http://16.170.239.252:4000/expense/add-expense", obj, {headers: { 'Authorization': token } })
        
  showExpences(response.data.expense);
  } catch (err) {
    console.log(err);
  }
}

//below function is for after a user buys premium the buypremium button hides
function showPremiumUserMessage(){
  document.getElementById("rzp-button1").style.visibility="hidden";
  document.getElementById("message").innerHTML=`<span style='color: gold;'>You are a Premium user now</span>`;
}

//this method is for decoding our token in frontend
function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

//below method is for each and every time reload the page
addEventListener("DOMContentLoaded", async () => {
  try {
    const token = localStorage.getItem("token");
    const pageSize=localStorage.getItem("pagesize");
    const decodeToken=parseJwt(token);
    const ispremiumuser=decodeToken.ispremiumuser;
    if(ispremiumuser){
      showPremiumUserMessage();
      showLeaderBoard();
      downloadExpense();
      showDownloadLinks();
    }
    page=1;
    const getdata=await axios.get(`http://16.170.239.252:4000/expense/pagination?page=${page}&pageSize=${pageSize}` , {headers : {'Authorization':token }});
    getdata.data.allExpenses.forEach(ele=>{
      showExpences(ele);
    });
    showPagination(getdata.data);
  } catch (error) {
    console.log(error);
  }
});


function showPagination({currentPage,hasNextPage,nextPage,hasPreviousPage,previousPage}){
  try{
    const dynamicpagination=document.getElementById('dynamicpagination');
    if(dynamicpagination){
      dynamicpagination.addEventListener('change',()=>{
        const pageSize=document.getElementById('dynamicpagination').value;
        localStorage.setItem('pagesize' ,pageSize);
        getProducts(currentPage);
      })
    }
  
    const pagination=document.getElementById('pagination');
  
    if(hasPreviousPage){
      const prevBtn=document.createElement('button');
      prevBtn.innerHTML=previousPage;
      prevBtn.addEventListener('click' , ()=>{
  
        getProducts(previousPage);
      });
      pagination.appendChild(prevBtn);
     }
  
    const crtBtn=document.createElement('button');
    crtBtn.innerHTML=currentPage;
    crtBtn.addEventListener('click',()=>{
      getProducts(currentPage);
    });
    pagination.appendChild(crtBtn);
  
  
  
     if(hasNextPage){
      const nextBtn=document.createElement('button');
      nextBtn.innerHTML=nextPage;
      nextBtn.addEventListener('click',()=>{
        getProducts(nextPage);
      });
      pagination.appendChild(nextBtn);
     }
  
  }
  catch(err){
    console.log(err);
  }
}

async function getProducts(page){
  try{
    const pageSize=localStorage.getItem('pagesize');
    const token=localStorage.getItem('token');
    const getdata=await axios.get(`http://16.170.239.252:4000/expense/pagination?page=${page}&pageSize=${pageSize}` , {headers : {'Authorization':token }});
    const ul=document.getElementById('showing');
    ul.innerHTML="";
    const pagination=document.getElementById('pagination');
    pagination.innerHTML='';
    getdata.data.allExpenses.forEach(ele=>{
      showExpences(ele);
    });
    showPagination(getdata.data);
  }
  catch(err){
    console.log(err);
  }
}



//this method is for buy premium
document.getElementById("rzp-button1").onclick = async function (e) {
  try{
    e.preventDefault();
    const token = localStorage.getItem("token");
    const response = await axios.get(
      "http://16.170.239.252:4000/premium/purchase-premium",
      { headers: { 'Authorization': token } }
    );
    //console.log(response);
    var options = {
      //this key_id is very impotant bcz of this only our razorpay knows which company trys to place an order
      'key': response.data.key_id,
      'order_id': response.data.order.id,
  
      //the below function will handle the success payment.
      'handler': async function (response) {
        await axios.post(
          "http://16.170.239.252:4000/premium/update-transaction",
          {
            order_id: options.order_id,
            payment_id: response.razorpay_payment_id
          },
          { headers: { 'Authorization': token } }
        )
        .then(response=>{
          alert("you are a premium user now");
          showPremiumUserMessage();
          console.log('res.data.token',response);
          localStorage.setItem('token',response.data.token);
          showLeaderBoard();
          downloadExpense();
          showDownloadLinks();
          
        });
      }
    };
    
    const rzp1 = new Razorpay(options);
    rzp1.open(); //it opens the payment screen
  
    rzp1.on("payment.failed",  (response) =>{
      alert("something went wrong");
    });
  }
  catch(err){
    console.log(err);
    throw new Error(err);
  }

};


//below method is for showing the download expenses as links
function showDownloadLinks(){
  try{
    const inputElement= document.createElement('input');
    inputElement.type="button";
    inputElement.value="Show Download File Link";
    inputElement.id='downloadfile-btn';
    inputElement.style.backgroundColor = 'gold';
    inputElement.style.color = 'black';
    inputElement.style.borderRadius = '15px';
    inputElement.style.padding = '8px';
    inputElement.style.marginLeft = '100px';
    const header=document.getElementById('main-header');
    header.appendChild(inputElement);
  
  
  
    inputElement.onclick=async()=>{
      const heading=document.getElementById('heading');
      heading.innerText="Show Download Url";
      const downloadUrl=document.getElementById('downloadlinks');
      const token=localStorage.getItem('token');
    
      const downloadLinks=await axios.get( "http://16.170.239.252:4000/user/show-downloadLink",{ headers:{'Authorization':token}});
  if(downloadLinks.data.url==[] || downloadLinks.data.url==''){
    const li = document.createElement('li');
    li.innerText = "No Downloaded Url";
    downloadUrl.append(li);
  }
  else{
    downloadLinks.data.url.forEach((Element) => {
      console.log('Element.filelink',Element);
      const li = document.createElement('li');
      const a=document.createElement('a');
      a.href=`${Element.filelink}`;
      a.innerHTML=` Url:  ${Element.filelink} `; 
      li.appendChild(a);
      downloadUrl.appendChild(li);
  });
  }
    }
  
  }
  catch(err){
    console.log(err);
  }
}

//this method is for showing the leaderboard for premium user
function showLeaderBoard(){
 //s console.log('i am inside')
 try{
  const inputElement= document.createElement('input');
  inputElement.type="button";
  inputElement.value="showLeaderBoard";
  inputElement.id='leaderboard-btn';
  inputElement.style.backgroundColor = 'gold';
  inputElement.style.color = 'black';
  inputElement.style.borderRadius = '15px';
  inputElement.style.padding = '8px';
  inputElement.style.marginLeft = '100px';
  const header=document.getElementById('main-header');
  header.appendChild(inputElement);


  inputElement.onclick=async()=>{
    const token=localStorage.getItem('token');
  
    const userLeaderBoardArray=await axios.get( "http://16.170.239.252:4000/premium/show-leaderboard",{ headers:{'Authorization':token}});
    var leaderboardElem=document.getElementById('leaderboard');
    leaderboardElem.innerHTML+='<h1> Leader Board</h1>';
    userLeaderBoardArray.data.forEach((userDetail)=>{
      leaderboardElem.innerHTML+=`<li>Name-${userDetail.name} -- total expense-->${userDetail.totalexpense}`;
    });
  };

 }catch(err){
  console.log(err);
 }
}


//this method is for directly download the expenses when you click on download expenses button
function downloadExpense(){
  try{
    console.log('i am in download');
    const inputElement= document.createElement('input');
    inputElement.type="button";
    inputElement.value="download-expenses";
    inputElement.id='download-btn';
    inputElement.style.backgroundColor = 'gold';
    inputElement.style.color = 'black';
    inputElement.style.borderRadius = '9px';
    inputElement.style.padding = '8px';
    inputElement.style.marginLeft = '100px';
    const header=document.getElementById('main-header');
    header.appendChild(inputElement);
  
  
    inputElement.onclick = async(eve) => {
      const token = localStorage.getItem('token');
  
      const getUserDownloadedData = await axios.get('http://16.170.239.252:4000/user/download', { headers: { 'Authorization': token } });
      if(getUserDownloadedData.status===200){
        var a=document.createElement("a");
        a.href=getUserDownloadedData.data.fileURl;
        a.click();
      }
      else{
        throw new Error(document.data.message);
      }
  };
  
  }
  catch(err){
    console.log(err);
  }
  
}

//this is for normally showing the expenses 
function showExpences(obj) {
  const parentNode = document.getElementById("showing");
  const createNewUser = `<li id=${obj.id}> ${obj.amount} - ${obj.description} - ${obj.category} 
    <button style="padding:3px;margin:5px" onclick=deleteExpense('${obj.id}') class="btn btn-danger">Delete</button>
    
        </li>`;

  parentNode.innerHTML += createNewUser;
}


//this is for deleting the expenses
async function deleteExpense(userId) {
  try{
    const token = localStorage.getItem("token");
    await axios.delete(`http://16.170.239.252:4000/expense/delete-expense/${userId}`, { headers: { 'Authorization': token } })
      
        removeItemFromScreen(userId);
        location.reload();
    
  }
  catch(err){
    console.log(err);
  }
  
}
function removeItemFromScreen(UserId) {
  try{
    const parentNode = document.getElementById("showing");
    const elem = document.getElementById(UserId);
    parentNode.removeChild(elem);
  }
 
  catch(err){
    console.log(err);
  }
}

