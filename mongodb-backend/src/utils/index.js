module.exports = {
    handleError: (err, res) => {
        console.error(err);
        res.status(err.status || 500).json({
            message: err.message || 'Internal Server Error',
        });
    },

    validateInput: (data, schema) => {
        const { error } = schema.validate(data);
        return error ? error.details[0].message : null;
    }
};