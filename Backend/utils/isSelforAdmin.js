const isSelforAdmin = (reqUser,paramId)=>{
    return reqUser.role==='admin' || reqUser._id.toString()===paramId
}

module.exports = isSelforAdmin

// “Allow access if the user is an admin or if the user is trying to view/update/delete their own account.”