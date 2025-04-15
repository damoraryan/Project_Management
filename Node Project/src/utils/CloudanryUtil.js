
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: "dmgtmrioq",
    api_key: "159126633783768",
    api_secret: "9RJCcNky7o8QnrbrE77poUd1QkU"
});

const uploadFileToCloudinary = async (filePath) => {
    return await cloudinary.uploader.upload(filePath, { resource_type: "auto" });
};

module.exports = { uploadFileToCloudinary };
