exports.email = (name, address) =>{ 
    
    return `
    <html>
    <head>
    <style type="text/css">
    .title{
        color:#444;

    }
    body{
        padding: 20px 10px;
        color:#444;
    }
    .address{
        background: #eeeeee;
        border:1px solid #444;
        padding:10px;
        width:300px;
        border-radius:10px;
    }
    </style>
    </head>
    <body>
        <h1 class="title">Thank You ${name}</h1>
        <p>Your order will be delivered soon. Thank you for shopping with us!!</p>
        <p>Your Address </p>
        <div class="address">
         <p>${address.building}</p>
        <p>${address.street}</p>
        <p>${address.postcode}</p>
        <p>${address.country}</p> 
        </div>

        <p> To see your order, click <a href="https://sports-hub.herokuapp.com/">here</a></p>
        <p>Regards</p>
        <p>SportsHub Team</p>
    </body>
        </html>
`}

