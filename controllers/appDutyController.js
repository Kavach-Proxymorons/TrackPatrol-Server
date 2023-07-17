

const getAssignedDuties = async (req, res, next) => {
    res.send(req.user);
}

export {
    getAssignedDuties
}