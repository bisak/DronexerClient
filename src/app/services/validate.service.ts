import { Injectable } from '@angular/core';
import { isUndefined } from "util";

@Injectable()
export class ValidateService {
  constructor() {
  }

  emailRegex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  validateProfilePicture(file) {
    if (file.size > 6 * 1000000) {
      return {
        isValid: false,
        msg: "Profile picture too big."
      }
    }
    return {
      isValid: true,
      msg: ""
    }
  };

  validateRegisterInput(data, isEditData?) {
    if (!data.firstName) {
      return {
        isValid: false,
        msg: "First Name is required."
      }
    }
    if (!data.lastName) {
      return {
        isValid: false,
        msg: "Last Name is required."
      }
    }
    if (!data.username) {
      return {
        isValid: false,
        msg: "Username is required."
      }
    }
    if (data.username.length < 4) {
      return {
        isValid: false,
        msg: "Username too short."
      }
    }
    if (!data.email) {
      return {
        isValid: false,
        msg: "Email is required."
      }
    }
    if (!this.emailRegex.test(data.email)) {
      return {
        isValid: false,
        msg: "Email is invalid."
      }
    }
    if (!isEditData) {
      if (!data.password) {
        return {
          isValid: false,
          msg: "Password is required."
        }
      }
      if (!data.agree) {
        return {
          isValid: false,
          msg: "Please agree to the terms of use."
        }
      }
    }
    if (data.password) {
      if (data.password != data.passwordConfirm) {
        return {
          isValid: false,
          msg: "Passwords didn't match."
        }
      }
      if (data.password.length < 6) {
        return {
          isValid: false,
          msg: "Password too short."
        }
      }
      if (data.password.length > 50) {
        return {
          isValid: false,
          msg: "Password too long."
        }
      }
    }
    return {
      isValid: true,
      msg: ""
    }
  }

  getTags(tags: string): Array<string> {
    let tagsArray = tags
      .split(' ')
      .filter((tag) => tag !== '' && tag.startsWith('#') && tag.length > 3 && tag.length <= 20)
      .map((tag) => tag.toLowerCase());
    if (tagsArray.length > 0 && tagsArray.length <= 15) return tagsArray;
    else return null;
  }
}
