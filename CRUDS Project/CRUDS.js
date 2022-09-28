let title = document.getElementById("title")
let price = document.getElementById("pricee")
let taxes = document.getElementById("taxes")
let ads = document.getElementById("ads")
let discount = document.getElementById("discount")
let total = document.getElementById("total")
let Count = document.getElementById("COUNT")
let Category = document.getElementById("Category")
let Create = document.getElementById("Create")
let Delete = document.getElementById("Delete")


let mood = "create";
let temp;

//Get total
function gettotal(){
    if(price.value != "") //If the user doesn't enter the price the total will show nothing
    {
        //Calculate the total
        let result = (+price.value + +taxes.value + +ads.value) - +discount.value
        total.innerHTML = result ;
        //we change the color to the green if we count the total
        total.style.background = " rgba(12, 219, 40, 0.808)"
    }
    else{
        //If the user doesn't enter the price the total will show nothing and keep the red color
        total.innerHTML ="";
        total.style.background = "#e6473b73"
    }
    
}           

//Create product


//This is used to keep the data after reloading the page


let datapro; //we gonna store the data in a matrix
if(localStorage.product != null)
{
    //if we have data before we gonna to add data atside this and don't remove the data
    datapro = JSON.parse(localStorage.product)
}else{
    datapro = [] //if we have no data before we gonna creta a new matrix to store the data
}


//we gonna creat a new product and store it as an object
Create.onclick = function(){
    let newpro = {
        //Caracteristics of the product
        title : title.value.toLowerCase(),
        price :price.value,
        taxes :taxes .value,  
        ads  :ads.value,
        discount :discount.value,
        total :total.innerHTML,
        Count : Count.value,
        Category : Category.value.toLowerCase(),
    }
    //we put the products as an object in the matrix
    //Count
    //Clean data
    //We add this condition because we must creart or update a product only if the user enter the title and the price and the cateory with a number of products less than 100
    if(title.value != "" && price.value != "" && Category.value != "" && newpro.Count < 100){
        if(mood === "create"){ // We we wanna create a new product we use this condition
            if(newpro.Count > 1) // if we wanna  add more than 1 nimber of the same product
            {
               for(let i = 0;i < newpro.Count;i++) //According to the number of Count we add number of product
                {
                     datapro.push(newpro);
                }
            }
            else
            {
                datapro.push(newpro);
              
            }     
        }
        else
        {// We we wanna update a product we use this condition
        datapro[temp] = newpro;
        mood = "create";
        Create.innerHTML = "Create";
        Count.style.display = "block";        
        } 
    
    
        


        //Save localStorage
        //we store the data in the localstorage to keep it after reloading the data
        localStorage.setItem("product",JSON.stringify(datapro))
        //Clear inputs : When we press the buttom Create we should update the boxes of unputs
        title.value = "";
        price.value = "";
        taxes.value = "";
        ads.value = "";
        discount.value = "";
        Count.value = "";
        Category.value = "";
        total.innerHTML =""; //it's not an input, it's a buttom so we use "innerHTML" to reach the value
        total.style.background = "#e6473b73";
    }
    showData()
}


//Read
//To show the data
function showData(){
        let table = "";
        for(let i =0;i <  datapro.length;i++)
        {
            //create a table 
            table += `
            <tr>
            <td>${i+1}</td>
            <td>${datapro[i].title}</td>
            <td>${datapro[i].price}</td>
            <td>${datapro[i].taxes}</td>
            <td>${datapro[i].ads}</td>
            <td>${datapro[i].discount}</td>
            <td>${datapro[i].total}</td>                
            <td>${datapro[i].Category}</td>
            <td><button onclick="updatedata(${i})" id="update"> update </button></td>
            <td><button onclick="deletedata(${i})" id="deletee">delete </button></td>   
        </tr>
            `;    
                        
        }
        //showing the elements of the table 
        document.getElementById("tbody").innerHTML=table;


        //Adding the button of "delete All" only if we have a data
        let btndelete = document.getElementById("deleteAll")  
        if(datapro.length > 0)
        {
            btndelete.innerHTML = `
            <td><button onclick="deleteall()" >Delete All(${datapro.length})</button></td> 
            `;
        }else{  //delete the button of "delete All" if we have no data
            btndelete.innerHTML = "";
        }
        
}
//Showing the data
showData()


//Delete : This is used to delete the elements mentioned by th buttom delete
function deletedata(i)
{
    //delete the elements from the matrix      
    datapro.splice(i,1)
    //delete the elements from the local storage
    localStorage.product = JSON.stringify(datapro)
    //showing the data after deleting the elements
    showData()
    
}
////DeleteAll : This is used to delete all of the data
function deleteall()
{
    //Deleting the elements from the local storage
    localStorage.clear()
    //Deleting  elements from the matrix
    datapro.splice(0) //this is gonna to delete evry element of the array "datapro"
    //Wemust use this function to show the table empty without the button of "delete All" before reloading the page
    showData()
}

//Update
function updatedata(i)
{
    //get the caracteristique of that product in our boxes of inputs to update it
    title.value = datapro[i].title;
    taxes.value = datapro[i].taxes;
    ads.value = datapro[i].ads;
    Category.value = datapro[i].Category;
    discount.value = datapro[i].discount;
    price.value = datapro[i].price;
    Count.style.display = "none";
    gettotal();
    //We change the button of "Create" to "update"  
    Create.innerHTML = "Update";
    //we should change this mood to make the second condition of the function Create.onclick works
    mood = "update";
    //We must have the index of the elements that we wanna update
    temp = i;
    //We should do scroll to move to the top and the inputs
    scroll({
        //We move to the top
        top : 0,
        //this gives a good move to the scroll
        behavior : "smooth"
    })
}

//Search

let searchmood = "title";
//Getting the mood of searching(by_title or by_category)
function getsearchmood(id){
    let search = document.getElementById("Search");
    if(id == "Search_By_Title")
    {
        //Making the mood = By title
        searchmood = "title"
    }else{
        //Making the mood = By Category
        searchmood = "Category"
    }
    //Show the user which mood he should search by
    search.placeholder = `Search by ${searchmood}`
    //Focucing on the box of search
    search.focus()
    search.value = "";
    showData()
}

//Searching the data
function searchdata(value)
{
    let table = "";
    //if the user want to search by title
    if(searchmood == "title")
    {
        //We should move over the loop and search if the value includes the array
        for(let i = 0;i < datapro.length;i++){
                if(datapro[i].title.toLowerCase().includes(value.toLowerCase())){
                    table += `
                    <tr>
                    <td>${i+1}</td>
                    <td>${datapro[i].title}</td>
                    <td>${datapro[i].price}</td>
                    <td>${datapro[i].taxes}</td>
                    <td>${datapro[i].ads}</td>
                    <td>${datapro[i].discount}</td>
                    <td>${datapro[i].total}</td>                
                    <td>${datapro[i].Category}</td>
                    <td><button onclick="updatedata(${i})" id="update"> update </button></td>
                    <td><button onclick="deletedata(${i})" id="deletee">delete </button></td>   
                </tr>
                    `;
    
                }
        }

    }else{ //if the user want to search by Category
        //We should move over the loop and search if the value includes the array
        for(let i = 0;i < datapro.length;i++){
            if(datapro[i].Category.toLowerCase().includes(value.toLowerCase())){
                table += `
                <tr>
                <td>${i+1}</td>
                <td>${datapro[i].title}</td>
                <td>${datapro[i].price}</td>
                <td>${datapro[i].taxes}</td>
                <td>${datapro[i].ads}</td>
                <td>${datapro[i].discount}</td>
                <td>${datapro[i].total}</td>                
                <td>${datapro[i].Category}</td>
                <td><button onclick="updatedata(${i})" id="update"> update </button></td>
                <td><button onclick="deletedata(${i})" id="deletee">delete </button></td>   
            </tr>
                `;

            }
        }

    }
    //Showing the elements founded that belongs to the search
    document.getElementById("tbody").innerHTML=table;
}
