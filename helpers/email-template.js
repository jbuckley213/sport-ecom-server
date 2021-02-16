exports.email = (name, address) =>{ 
    
    return `
    <html>
    <head>
    <style type="text/css">
    .title{
        color:white;

    }
    body{
        padding: 20px 10px;
        color:#444;
    }
    .address{
        border:1px solid #444;
        padding:10px;
        width:250px;
        border-radius:10px;
        box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
        margin: 0 auto;
        text-align:center;
}

.address h5{
    border-bottom: 1px dotted black;
    padding-bottom:5px;
}

    .header-img{
        border-radius:20px;
        width:100%;
        height:150px;
        object-fit:contain;
        background: url("https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2102&q=80");
        background-size: cover;
        color:white;
        padding:10px;
    }
    .info{
        padding:10px 15px;
    }
    </style>
    </head>
    <body>
        <div class='header-img'>
        <h1 class="title">Thank You ${name}</h1>
        <p>Your order will be delivered soon. Thank you for shopping with us!!</p>

        </div>
        <div class="info">
        <div class="address">
        <h5>Your Address </h5>

        <p>Building: ${address.building}</p>
        <p>Street: ${address.street}</p>
        <p>Postcode: ${address.postcode}</p>
        <p>Country: ${address.country}</p> 
        </div>

        <p> To see your order, click <a href="https://sports-hub.herokuapp.com/profile">here</a></p>
        <p>Regards</p>
        <p>SportsHub Team</p>
        </div>
    </body>
        </html>
`}

