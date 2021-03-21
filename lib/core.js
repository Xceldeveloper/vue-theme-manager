import Vue from 'vue'

// const version = Number(Vue.version.split('.')[0]);
// if (version === 2) {
// } else if (version === 3) {
// }

var WRAPPER = {
  default: {},
  name:"",
  names:[]
}



const holder = Vue.observable(WRAPPER);


class ThemeManager {
  constructor(options) {
    this.theme = holder
    this.currentTheme = holder[holder.name]
    this.name = holder.name
    this.names = holder[holder.names]
    this.init(options)
  }

  init(theme) {
    if (Array.isArray(theme.names)) {
        if(theme.names.indexOf('default') == -1){
            theme.names.push('default');
        }
      for (var i = 0; i < theme.names.length; i++) {
         this.addName(theme.names[i]);
        if (!WRAPPER.hasOwnProperty(theme.names[i])) {
          Vue.set(WRAPPER, theme.names[i], {})
        }
      }
    }

    var _options =  theme.options;
    if (typeof _options !== 'object' && _options !== null) {// incase it is a json string 
        _options = JSON.parse(_options)
      } //convert to object




    if (typeof _options === 'object'  && _options !== null) {//second check
      var getkeys =  Object.keys(_options);
      for (var i = 0; i < getkeys.length; i++) {
        let currentKey = getkeys[i];
        let themex = _options[currentKey];
        this.addTheme(themex, currentKey,theme.activate !== 'undefined' ? theme.activate == currentKey : false);
      }
    }else{
        throw new Error("Options shlould be Object or JSON string");
    }

    
  }

  addName(name){
    if(WRAPPER.names.indexOf(name) == -1 ){
        WRAPPER.names.push(name);
       }
      
  }

  addTheme(val, themeName = 'default',activate = false) {
      if(activate){WRAPPER.name = themeName}
      this.addName(themeName);

    var data = val;
    if (typeof data !== 'object' && data !== null) {
      data = JSON.parse(data)
    } //convert to object

    if (!WRAPPER.hasOwnProperty(themeName)) {//theme doesn't exist yet so we create one
      Vue.set(WRAPPER, themeName, {
      })
    }




    let xx = Object.keys(data);
    for (var i = 0; i < xx.length; i++) {
      let property = xx[i];
      if (!WRAPPER[themeName].hasOwnProperty(property)) { //if theme property doesn't exist yet
        Vue.set(WRAPPER[themeName], property, data[property])
      } else {
        WRAPPER[themeName][property] = data[property];
      }
    }
    this.updateBaseTheme();
    return this
  }

  updateBaseTheme(){//update plugin.theme.... accessor
      let currentKeys = Object.keys(WRAPPER[WRAPPER.name]);
      let currentTheme = WRAPPER[WRAPPER.name];
    
      for(var i = 0; i < currentKeys.length; i++){
          let c = currentKeys[i]
         Vue.set(WRAPPER,c,currentTheme[c]);
      }
  }

//    flushTheme(){
//       let keys = Object.keys(WRAPPER);
//       for(var i = 0; i < keys.length; i++){
//           let prop = keys[i];
//           if(prop != ['currentTheme'] && prop != ['name'] && typeof WRAPPER[prop] !== 'object'){
//             console.log(prop)
//            Vue.delete(WRAPPER,prop)
//           }
//       }
     
//    }

   activateTheme(name){
       WRAPPER.name = name;
       this.updateBaseTheme();
       this.saveTheme();
       return this
   }


  getTheme(which, themeName = WRAPPER.name) {
    if(!Array.isArray(which)){
      throw new Error("color names shlould be in an Array");
    }
    var result = {};
    for (let i = 0; i < which.length; i++) {
      let c = which[i]
      try {
        Object.defineProperty(result, c, {
          value: WRAPPER[themeName][c],
          writable: true,
          enumerable: true
        })
      } catch (err) {
        throw new Error(err)
      }

    }
    return result;
  }

  saveTheme() {
      var options = {};
    let keys = Object.keys(WRAPPER);
    for(var i = 0; i < keys.length; i++){
        let prop = keys[i];
        if(typeof WRAPPER[prop] === 'object'  &&  !Array.isArray(WRAPPER[prop])){//get all themes by object detection
          Vue.set(options,prop,WRAPPER[prop]);
        }
    }
    localStorage.setItem('APP_THEME', JSON.stringify({names:WRAPPER.names,activate:WRAPPER.name,options:options}));

    return this
  }
  getThemeFromStorage() {
    let th = localStorage.getItem('APP_THEME');
    if (th !== null) {
        this.init(JSON.parse(th)); 
       
    }
    //get from localStorge then initialize
    return this
  }
}
const VueThemeManager = {
  install(Vue, options) {
    Vue.prototype.$AppTheme = new ThemeManager(options);

    Vue.mixin({
        mounted() {
        this.$AppTheme.getThemeFromStorage();
        }
      });
  }
}

export default VueThemeManager;
