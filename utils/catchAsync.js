const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch((error) => {
            console.log(error);
            return res.status(500);
        });
    };
};

module.exports = catchAsync;
