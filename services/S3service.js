const AWS=require('aws-sdk');


const updatedToS3=async (data,filename)=>{
    try{
      //console.log(process.env.AWS_BUCKET_NAME,process.env.AWS_IAM_USER_KEY,process.env.AWS_IAM_USER_SECRET)
      const BUCKET_NAME=process.env.AWS_BUCKET_NAME;
      const IAM_USER_KEY=process.env.AWS_IAM_USER_KEY;
      const IAM_USER_SECRET=process.env.AWS_IAM_USER_SECRET;
      let s3bucket=new AWS.S3({
        accessKeyId:IAM_USER_KEY,
        secretAccessKey:IAM_USER_SECRET,
        //Bucket:BUCKET_NAME
      })
  
        var params={
          Bucket:BUCKET_NAME,
          Key:filename,
          Body:data,
          ACL:'public-read'
        }
        return new Promise((resolve,reject)=>{
          s3bucket.upload(params , (err,s3response)=>{
            if(err){
              //console.log("something went wrong" , err);
              reject(err);
            }
            else{
              console.log('success' , s3response);
              resolve(s3response.Location)
            }
          })
        })
         
    }
    catch(err){
      console.log(err);
    }
   
  }

  module.exports={
    updatedToS3
  }