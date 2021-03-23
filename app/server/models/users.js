const DataModel = require('./data_model');

class User {
    constructor(id, firstname, lastname, email, password, matricNumber, program, graduationYear) {
      
      this.id = id;
      this.firstname = firstname;
      this.lastname = lastname;
      this.email = email;
      this.password = password;
      this.matricNumber = matricNumber;
      this.program = program;
      this.graduationYear = graduationYear;
      
    }

    getFullName() {

      return `${this.firstname} ${this.lastname}`

    }
}

class Users extends DataModel {
  
    constructor(){
      
      super()
      
    }
  
    authenticate(email, password) {
  
      let UserToAuth = this.data.filter((obj) => obj.email == email);    
      
      if(UserToAuth.length > 0){
        
        if(UserToAuth[0].password == password){
          
          return true;
          
        }
        
      }
      
      return false;
  
    }

    getByEmail(email) {
      
      let filteredUser = this.data.filter(obj => obj.email == email);
      
      if(filteredUser.length > 0){
        
        return filteredUser[0]
        
      }
      
      return null;
      
    }

    getByMatricNumber(matricNumber) {
      
      let filteredUser = this.data.filter(obj => obj.matricNumber == matricNumber);
      
      if(filteredUser.length > 0){
        
        return filteredUser[0]
        
      }
      
      return null;
      
      
    }

    validate(obj) {
      
      if(obj.id != false && obj.firstname != false && obj.lastname != false && obj.email != false && obj.password != false && obj.matricNumber != false && obj.graduationYear != false && obj.program != false){
        
        if(this.data.every(userObj => userObj.email != obj.email)){
          
          if(this.data.every(userObj => userObj.matricNumber != obj.matricNumber)){
            
            if(obj.password.length >= 7){
              
              return true
              
            }
            
            
          }
          
        }
        
      }
      
      return false
      
    }
}

// Do not worry about the below for now; It is included so that we can test your code
// We will cover module exports in later parts of this course
module.exports = {
    User,
    Users
};