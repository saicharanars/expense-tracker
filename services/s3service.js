const AWS = require('aws-sdk');
require('dotenv').config();


const uploadToS3=(data, filename)=>{
    const BUCKET_NAME ='expensetracker977';

    //console.log(process.env.IAM_USER_KEY);
    let s3bucket = new AWS.S3({
        accessKeyId : process.env.IAM_USER_KEY,
        secretAccessKey: process.env.IAM_USER_SECRET,
        region:'ap-south-1'
    })
    var params = {
        Bucket: BUCKET_NAME,
        Key:filename,
        Body:data,
        ACL:'public-read'
    }
    console.log(s3bucket ,params,"uytgty");
    return new Promise((resolve,reject)=>{
        s3bucket.upload(params,(err,s3response)=>{
            if(err){
                console.log('Something went wrong',err)
                reject(err)
            }else{
                console.log('success', s3response);
                resolve(s3response.Location);
            }
        })
    })

}

module.exports={
    uploadToS3
}