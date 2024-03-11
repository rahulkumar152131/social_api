import { ApplicationError } from "../../error-handler/applicationError.js";

export default class UserModel {
    constructor(name, email, password, bio, profileImage) {
        this.userName = name;
        this.bio = bio;
        this.email = email;
        this.password = password;
        this.profileImage = profileImage;
    }
}
