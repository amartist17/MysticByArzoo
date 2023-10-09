module.exports = (fn) => (req, res, next) => {
    fn(req, res, next).catch((error) => {
        console.log(error);
        res.render('error',{
            status: 'error',
            message: error.message || 'An error occurred',
        });
    });
};