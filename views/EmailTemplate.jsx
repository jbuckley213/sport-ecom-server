const {View} = require("grandjs");


const Styles = {
    body: {
        padding: "20px 10px",
        color:"#444",
    },
    address: {
        border:"1px solid #444",
        padding:'10px',
        width:"250px",
        borderRadius:"10px",
        boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
        margin: "0 auto",
        textAlign:"center",
    },
    title:{
        color:"white",
        textAlign:"center",
    },
    headerImg:{
        borderRadius:" 0 0 40% 40%",
        width:"100%",
        height:"150px",
        objectFit:"contain",
        background: url("https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2102&q=80"),

        backgroundSize: "cover",
        color:"white",
        padding:"10px",
    }
}

const EmailTemplate = ({data}) => {

<body>
        {/* <div class='header-img'>
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
        </div> */}
        <h1>Hello</h1>
    </body>


}

module.exports = EmailTemplate