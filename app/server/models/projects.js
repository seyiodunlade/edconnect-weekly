const DataModel = require('./data_model');

class Project {
    constructor(id, name, abstract, authors, tags, createdBy) {

      this.id = id;
      this.name = name;
      this.abstract = abstract;
      this.authors = authors;
      this.tags = tags;
      this.createdBy = createdBy;

    }
}

class Projects extends DataModel {
  
    constructor(){
      
      super();
      
    }
  
  
    validate(obj) {
      
      if(Object.getPrototypeOf(obj.authors) == Object.getPrototypeOf([]) && Object.getPrototypeOf(obj.tags) == Object.getPrototypeOf([])){
        
          if(obj.id != false && obj.name != false && obj.abstract != false && obj.authors != false && obj.tags != false && obj.createdBy != false){
            
              return true;
            
          }
        
      }
      
      return false;
      
    }
}


// Do not worry about the below for now; It is included so that we can test your code
// We will cover module exports in later parts of this course
module.exports = {
    Project,
    Projects
};