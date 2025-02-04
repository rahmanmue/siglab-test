let data= [];


// fetch Data from API
const fetchData = async () => {
    try {  
        const res = await fetch("https://bsby.siglab.co.id/api/test-programmer?email=rahman.muraman@gmail.com");
        const result = await res.json();
        
        if(!res.status){
            throw new Error("Error Fetch Data")
        }

        return result;
    } catch (error) {
        // display error data
        console.log(error)
        const body = document.getElementsByTagName('body')[0]
        body.innerHTML = `<h1>${error}</h1>`
    } 
}


// function change type to title based on table data in test document II  
const changeType = async (data) => {
    try {
        const res = await fetch("./data/category.json");
        const {data: dataCategory} = await res.json();
     
        const newData = data.map((d) => {
            const resDetail = dataCategory.find((x) => x.id=== d.type);
            if(resDetail){                
                return {
                    ...d, 
                   type : resDetail.title
                 }
            }
        })

        return newData;
        
    } catch (error) {
        console.log(error)
    }
}

// processData : get data API and change type to title
const processData = async () => {
    try {
        const {results} = await fetchData();
        const result = await changeType(results);
        data = result;
        displayData(data) 
    } catch (error) {
        console.log(error);
    }
   
}

const formatRupiah = (price) => {
    return 'Rp. ' + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}


// display data based on argument items
const displayData = (data) => {
    const listData = document.getElementById("content");
    listData.innerHTML = "";
    const total = document.getElementById("total");
    total.textContent = `Total Data : ${data.length}`;

    
    if(data.length == 0){
        listData.classList.remove("content");
        listData.innerHTML = `
        <div class="center">
            <h1>Data Kosong</h1>
        </div>
       `;
        return
    }

    if (!listData.classList.contains("content")) {
        listData.classList.add("content");
    }
    
    data.forEach(item => {
        const article = document.createElement('article');
        const discountButton = item.discount > 0 ? `<button class="popup-btn btn show" data-id="${item.id}">Show Discount</button>` : "";
        const attachmentSpan = item.attachment > 0  ? `<span class="label-green" >Attachment</span>` : "";
        const statusSpan = item.status > 0 ? `<span class="label-green" >Approved</span>` : `<span class="label-red" >Unpproved</span>`;
        
        article.innerHTML = `
           <div class="item-info">
                <small>Type : ${item.type}</small>
                <h5>${item.name}</h5>
                <h5>Price : ${formatRupiah(item.price)}</h5>

                <div>
                    ${attachmentSpan}
                    ${statusSpan}
                </div>

                ${discountButton}
           </div>
        `;

        listData.appendChild(article);
    });

   

    document.addEventListener("click", function(event) {
        if (event.target.classList.contains("popup-btn")) {
            const itemId = event.target.getAttribute("data-id");
            const selectedItem = data.find(item => item.id == itemId);
            handlePopup(selectedItem);
        }
    })

}


// handle Popup
const handlePopup = (item) => {
    
    if(!item) return
    
    let message;

    if (item.discount > 0) {
        message = `Discount: ${formatRupiah(item.discount)}`;
        
        if (item.discount > 1000000) {
            message += " & Approval Needed";
        }

        document.querySelector('.discount').textContent = message;
        document.querySelector('.modal-overlay').classList.add('open-modal');
      
    }

}

const closePopup = () => {
    document.querySelector('.modal-overlay').classList.remove('open-modal');
}


// display Option based on argument container and content
const displayOption = (container, content) => {
    content.forEach((element)=> {
        const optionElement = document.createElement('option');
        optionElement.value = element.value;
        optionElement.textContent = element.title;
        container.appendChild(optionElement);
    })
}


// display list data based on data API to sort data 
const displaySortData = () => {
    const idListData = document.getElementById('list-data');
    idListData.innerHTML =  `<option value = "" selected>Pilih Data</option>`;

    const dataTable = [
        {
            value : "id",
            title : "ID"
        },
        {
            value : "type",
            title : "Type"
        },
        {
            value : "name",
            title : "Name"
        },
        {
            value : "status",
            title : "Status"
        },
        {
            value : "price",
            title : "Price"
        },
        {
            value : "discount",
            title : "Discount"
        },
        {
            value : "attachment",
            title : "Attachment"
        }

    ]

    displayOption(idListData, dataTable);


    const idSortData = document.getElementById('sort-data');
 

    const radioButton = [
        {
            type: "radio",
            name: "sort",
            value : "asc",
            title: "ASC"
        },
        {
            type: "radio",
            name: "sort",
            value : "desc",
            title: "DESC"
        }
    ]

    radioButton.forEach((element)=> {
        idSortData.innerHTML += `
        <div class="wrapper-radio">
            <input type=${element.type} value=${element.value} name=${element.name} id=${element.index}/>
            <label class="option option-1" for=${element.index} >
                <div class="dot"></div>
                <span>${element.title}</span>
            </label>
        </div>
        `
    })
}

const displayFilterType = async () => {
    const idFilterType = document.getElementById("filter-type");
    idFilterType.innerHTML = `<option value = "" selected disabled>Semua Type</option>`;

    try {
        const categoryType = await fetch('./data/category.json');
        const {data} = await categoryType.json();

        data.forEach(element => {
            const optionElement = document.createElement('option');
            optionElement.value = element.title;
            optionElement.textContent = element.title;
            idFilterType.appendChild(optionElement);
            
        });

    } catch (error) {
        console.log(error)
    }

} 



const displayFilterStatus = async () => {
    const idFilterStatus = document.getElementById('filter-status');
    idFilterStatus.innerHTML = '`<option value = "" selected>Semua Status</option>`';

    const status = [
        {
            value : "1",
            title : "Approved"
        },
        {
            value : "0",
            title : "Unapproved"
        }
    ];

   displayOption(idFilterStatus, status)
   
}

const displayFilterAttachment = () => {
    const idFilterAttachment = document.getElementById('filter-attachment');
    idFilterAttachment.innerHTML = `<option value = "" selected>Semua Attachment</option>`;

    const attachment = [
        {
            value : "1",
            title : "Attachment"
        },
        {
            value : "0",
            title : "Not Attachment"
        },
    ]

    displayOption(idFilterAttachment, attachment)

}


const displayFilterDiscount = () => {
    const idFilterDiscount = document.getElementById('filter-discount');
    idFilterDiscount.innerHTML = '`<option value = "" selected>Semua Discount</option>`';

    const discount = [
        {
            value : "1",
            title : "Discount"
        },
        {
            value : "0",
            title : "Not Discount"
        },
    ]

    displayOption(idFilterDiscount, discount)

}



// function to sortData based on list data ASC DESC
const sortData = (key, order) => {
    if(!order || !key){
        return
    }

    data.sort((a, b) => {
        if(typeof a[key] === "string"){
            return order == "asc" ? a[key].localeCompare(b[key]) : b[key].localeCompare(a[key])
        }else{
            return order == "asc" ?a[key] - b[key] : b[key]-a[key];   
        }
    })

    displayData(data);
}



// handleFilters when button Filter OnClick
const handleFilters = () => {
    let dataFilter = [...data];

    const valueType = document.getElementById('filter-type').value;
    const valueStatus = document.getElementById('filter-status').value;
    const valueAttachment = document.getElementById('filter-attachment').value;
    const valueDiscount = document.getElementById('filter-discount').value;
   

    if(valueType){
        dataFilter = dataFilter.filter((d)=> d.type === valueType);
    }

    if(valueStatus){
        dataFilter = dataFilter.filter((d)=> d.status === Number(valueStatus));
    }

    if(valueAttachment){
        dataFilter = dataFilter.filter((d)=> d.attachment === Number(valueAttachment));
    }

    if(valueDiscount){
        dataFilter = dataFilter.filter((d)=> valueDiscount == "1" ? d.discount > 0  : d.discount == 0);
    }

    
    displayData(dataFilter);    

}


// handleSortData when button sortData onClick
const handleSortData = () => {
    const valueData = document.getElementById('list-data').value;
    const sort = document.getElementsByName('sort');
    let checkedValue;
    for(const radio of sort){
        if(radio.checked){
            checkedValue = radio.value;
            break
        }
    }
    
    sortData(valueData, checkedValue)
}


// get data from API and process data change type to title
processData();

// display data to sort
displaySortData();

// display type to filter based on type
displayFilterType();

// display status to filter status basen on status
displayFilterStatus();

// display attachment to filter attachment based on attachment
displayFilterAttachment();

// display discount to filter discount based on discount
displayFilterDiscount();