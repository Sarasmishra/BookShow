

const roleAuthorization =(...allowedRoles)=>{
    return (req,res,next)=>{
        try {
            const user = req.user
            if(!user){
                return res.status(401).json({message:"User not Logged in"})
            }
            if(!allowedRoles.includes(user.role)){
                return res.status(403).json({message:"Unauthorized access"})
            }

            next()
        } catch (error) {
            console.log('Role auth error:', error);
            res.status(500).json({message:"Role server error"})
        }
    }
}

module.exports = roleAuthorization