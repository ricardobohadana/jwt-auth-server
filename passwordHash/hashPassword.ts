import { hashSync, genSaltSync, hash } from "bcrypt";
const saltRounds = 10;

const salt = genSaltSync(saltRounds);
const hashPassword = (password: string) => {
    const hash = hashSync(password, salt);
    return hash;
};

export default hashPassword;
