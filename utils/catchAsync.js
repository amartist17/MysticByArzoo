module.exports = (fn) => (req, res, next) => {
    fn(req, res, next).catch((error) => {
        console.log(error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'An error occurred',
        });
    });
};