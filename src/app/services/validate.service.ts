import { Injectable } from '@angular/core';
import { isUndefined } from "util";

@Injectable()
export class ValidateService {

  private emailRegex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  constructor() {
  }

  validateProfilePicture(file) {
    if (file.size > 1 * 1000000) {
      return {
        isValid: false,
        msg: "Profile picture too big."
      }
    }
    return {
      isValid: true,
      msg: ""
    }
  }

  validateRegisterInput(data) {
    if (isUndefined(data.firstName)) {
      return {
        isValid: false,
        msg: "First Name is required."
      }
    }
    if (isUndefined(data.lastName)) {
      return {
        isValid: false,
        msg: "Last Name is required."
      }
    }
    if (isUndefined(data.username)) {
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
    if (isUndefined(data.email)) {
      return {
        isValid: false,
        msg: "Email is required."
      }
    }
    if (this.emailRegex.test(data.email) == false) {
      return {
        isValid: false,
        msg: "Email is invalid."
      }
    }
    if (isUndefined(data.password)) {
      return {
        isValid: false,
        msg: "Password is required."
      }
    }
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
    return {
      isValid: true,
      msg: ""
    }
  }

}
