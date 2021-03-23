class DataModel {
    constructor() {
        this.data = [];
    }

    getAll() {
        return this.data;
    }

    getById(id) {
      
      const derivedObj = this.data.filter((obj)=>obj.id == id);
      if(derivedObj.length > 0){
        
        return derivedObj[0];
        
      }else{
        
        return null;
        
      }
      
    }

    save(obj) {
        if (this.validate(obj)) {
            this.data.push(obj);
            return true;
        }
        return false;
    }

    update(obj, id) {
      
      const derivedObjArr = this.data.filter(objToCheck => objToCheck.id == id);
      if(derivedObjArr.length > 0){
        
        let keysToUpdate = Object.keys(obj);
        keysToUpdate.forEach(key => {
          
          derivedObjArr[0][key] = obj[key]
          
        });
        
        return true;
        
      }else{
        
        return false;
        
      }
      
    }

    delete(id) {
      
      let objToDeleteIndex;
      
      let objToDeleteArr = this.data.filter((obj, index) => { if(obj.id == id){
        
          objToDeleteIndex = index;
          return obj;
        
        }
        
      });
      
      if(objToDeleteArr.length > 0){
        
        let removedObj = this.data.splice(objToDeleteIndex, 1);
        
        if(removedObj[0].id == objToDeleteArr[0].id){
          
          return true;
          
        }
        
        
      }
      
      return false;
      
    }

    // this method will be overriden in the sub classes
    validate(obj) {
        return false;
    }
}

// Do not worry about the below for now; It is included so that we can test your code
// We will cover module exports in later parts of this course
module.exports = DataModel;