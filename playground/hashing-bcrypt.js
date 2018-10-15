const bcrypt = require('bcryptjs');

var password = '123abc!';

bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(hash);
    });
});

var hashedPassword = '$2a$10$uUdSqKL/4KJ639Ta66DQFOzUspuTpUSw4S9juvwsmj3yYBs6Rql/m';
bcrypt.compare(password, hashedPassword, (err, result) => {
    console.log(result);
});
