const { json } = require('body-parser');
const JsonToken = require('jsonwebtoken');
const key = '7bcacd8c0be365023dab195bcac015d6009'

function CreateToken(UserId){
    UserId = JSON.stringify(UserId)


    
    
    return JsonToken.sign({data:UserId},key,{expiresIn:'1h'});
}

function VerifyToken(Token){
    let {data} = JsonToken.verify(Token,key)

    
    let response = data ? data : ''
   		

    return  JSON.parse(response);

}

module.exports = {CreateToken,VerifyToken}