## vue-theme-manager

> A vuejs plugin for Managing theme(s) colors in the whole of your Vue
> web app. It has support for Vue 2 and Vue 3
[npm](https://www.npmjs.com/package/vue-theme-manager)

## Installation

    

> npm i vue-theme-manager

## Guide

> #### For Vue 2x and Vue 3x

   ```javascript
   //main.js
   ...
   import VueThemeManager from 'vue-theme-manager'
   ...
   let themeOptions = {
   activate:'light',
   styles:{
        light:{
              backgroundColor:'#ededed',
              textColor:'#101010'
               },
        dark:{
              backgroundColor:'#1111',
              textColor:'#ededed'
               }
         }
}

Vue.use(VueThemeManager,themeOptions);

...
```

> #### For Nuxt 2x 

```javascript    
//plugin/vue_theme_manager.js
import Vue from 'vue'
import VueThemeManager from 'vue-theme-manager'
     
   let themeOptions =  { 
       activate:'light', 
       styles:{ 
            light:{ 
                 backgroundColor:'#ededed', 
                 textColor:'#101010'  
                  }, 
             dark:{ 
                  backgroundColor:'#1111', 
                  textColor:'#ededed' 
                   }  
               }  
        } 

Vue.use(VueThemeManager,themeOptions);
```

```javascript
//nuxt.config.js
plugins:{
  ...

  {src:'@plugin/vue_theme_manager',mode:'client'}
  
  ...
}
```

> 

## Plugin Options
Plugin accepts `object` during initialization with props [This is Optional]:

   ```javascript
    Vue.use(VueThemeManager,{activate:,styles})
```

 1. `activate:'string'`  ---this will be the activated theme when plugin is initialized. Note default theme is `default`[This is optional]
 2. `styles:object` ---this is an `object` containig theme options that will be available during plugin initialization. Note "default" theme option is always added to this object [This is Optional]

## Template Usage


> For Vue2x and Vue3

 ```HTML
 App.vue <! root app !-->
 
 <!-- register theme-manager-plugin-globally for all component template  !-->
    <div id="app" :style="VueThemeManager">
    ...
    <router>
    </router>
    ...
    </div>
    <style>
    ...
    </style>
```

> For Nuxt

 ```HTML
 /layout/default.vue <! root app !-->
 
 <!-- register theme-manager-plugin-globally for all component template  !-->
  <nuxt :style="VueThemeManager" />
```

```HTML
anycomponent.vue 
<template>
<div class="wrapper">
Hello World

 <span :style="textColor:'var(--accent-color)'">
 I am using accent color
 </span>

 <!--this access the currently  selected theme option !-->
 <span :style="textColor:$AppTheme.theme.accentColor">
 I am using accent color
 </span>

<span :style="textColor:$AppTheme.theme['themeName'].accentColor">
 I am using accent color
 </span>
 
</div>
</template>
  <style>
    #app{
          background-color:var(--background-color);
          text-color:var(--text-color);
          ...
       }
    </style>
<!-- as you can see here theme options are generally dynamic !-->
```

## Methods

 
   ```javascript
   //this returns object
   this.console.log(JSON.stringify(this.$AppTheme.theme,null,2));
   
   
   
//this returns object
  let themeName = 'light' 
  this.console.log(JSON.stringify(this.$AppTheme.theme[themeName],null,2))
   /*result 
    {
     textColor:'#ededed,
     backgroundColor:'#101010'
    }
    */
// we can still go further
let themeName = 'light' 
  this.console.log(JSON.stringify(this.$AppTheme.theme[themeName].textColor,null,2))
  //returns '#ededed' 

this.console.log(JSON.stringify(this.$AppTheme.textColor,null,2))
  //returns currently selected theme textColor '#ededed' 



   /*This will be called once Theme Plugin has been initialized
 This can be used in your App.vue or default.vue file or any other component
 you wish to use it in
*/
    this.$AppTheme.onReady((themeExistInDeviceDB)=>{
    if(themeExistInDeviceDB){
       this.$AppTheme.setThemeFromStorage();
      }
    });
    


//This will be called when New Theme has been Selected
this,$AppTheme.onThemeChanged((themeName,themeOptions)=>{
...
//do what ever you want with the results
})


this.$AppTheme.addTheme({textColor:'red',backgroundColor:'gold','splash',true});
//this.$AppTheme.addTheme({options,themeName,activate}})
/*
*options = "object" or "json-string" @required
*themeName = "String" intended name for theme @optional default  is "default"
*activate = boolean --activate theme or not
*/

this.$AppTheme.saveTheme(); //save theme to db 

//this can also be changed like this
this.$AppTheme.addTheme(...).saveTheme();



this.$AppTheme.activateTheme(themeName);
//where themeName is a `String` which is already contained in the themeOptions



this.$AppTheme.getTheme(themeName,array);
//returns object of themeOptions
array = themeoptions to be gotten like ['textColor','backgroundColor']
themeName = name of theme to get options from
///generally data can be accessed like this
this.$AppTheme.getTheme(['textColor'],'splash').texColor 
//result 'red'
```

## Points to Note

 1. camel case `textColor` are changed to kebal case `text-color` only for css variables
 2. css variables are dynamic and should be accessed like this `var(--text-color)`
 3. Try as much as possible to name your theme options with camel case `textColor, accentColor, backgroundColor`
 4. css variables acess only the currently selected theme 