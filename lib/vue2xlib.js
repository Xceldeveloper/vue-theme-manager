import Vue from 'vue'



class ThemeManager {
    constructor(options) {
        this.onThemeChangedListener = null;
        this.ThemeChangerWatcher = null;
        this.onReadyListener = null;
        this.theme = Vue.observable({
            default: {},
            name: "default",
            names: ['default'],
            currentTheme: {}
        });
        this.init(options)
    }

    init(options) {

        try {
            JSON.parse(options)
        } catch (err) {}

        if (options !== undefined && typeof options === 'object') {
            this.theme.name = options.activate == undefined ? this.theme.name : options.activate
            let keys = Object.keys(options.styles);
            for (let c = 0; c < keys.length; c++) {
                //this.addName(keys[c]);
                Object.defineProperty(this.theme, keys[c], {
                    value: options.styles[keys[c]],
                    writable: true,
                    enumerable: true
                });
            }

            this.updateNames();
            this.updateCurrentTheme();

        }

    }

    setReadyListener() {
        try {
            this.onReadyListener(this.hasThemeInDB());
        } catch (err) {}

    }

    setThemeChangeListener(callback) {
        this.ThemeChangerWatcher = callback || function () {}
    }



    updateCurrentTheme() {
        if (this.theme[this.theme.name] !== undefined) {
            let oldval = this.theme.currentTheme
            let newval = this.theme[this.theme.name]
            this.theme.currentTheme = this.theme[this.theme.name]
            this.updateThemeTree(newval, oldval);
        }

    }




    onReady(callback) {
        this.onReadyListener = callback || function () {}
    }
    onThemeChanged(callback) {
        this.onThemeChangedListener = callback || function () {}
    }

    updateThemeTree(newval = [], oldval = []) {
        //deleting old keys
        let currentKeys = Object.keys(oldval);
        for (var x = 0; x < currentKeys.length; x++) {
            let key = currentKeys[x];
            this.theme[key] = undefined
        }


        //adding new keys
        let newkeys = Object.keys(newval);
        for (var x = 0; x < newkeys.length; x++) {
            let key = newkeys[x];
            //console.log(key)
            Object.defineProperty(this.theme, key, {
                value: this.theme.currentTheme[key],
                enumerable: true,
                writable: true
            });
        }
        //delete old values
        //add new values
    }

    updateNames() {
        var result = [];
        let keys = Object.keys(this.theme);
        for (var x = 0; x < keys.length; x++) {
            let key = keys[x]
            if (typeof this.theme[key] === 'object' && key != 'currentTheme' && !Array.isArray(this.theme[key])) {
                result.push(key)
            }
        }
        this.theme.names = result //get names 
    }

    addTheme(style, themeName = 'default', activate = false) {

        if (typeof style !== 'object' && style !== null) {
            try {
                style = JSON.parse(style)
            } catch (err) {}
        } //convert to object if it is json string


        if (!this.theme.hasOwnProperty(themeName)) { //theme doesn't exist yet so we create one

            Object.defineProperty(this.theme, themeName, {
                value: style,
                enumerable: true,
                writable: true
            })
            let currtheme = this.theme.name;
            this.theme.name = '' // to make
            this.theme.name = currtheme; // the changed reactibe
        } else {
            this.theme[themeName] = Object.assign({}, this.theme[themeName], style);
        }


        if (activate) {
            this.activateTheme(themeName);
        }
        this.updateNames();
        return this

    }

    activateTheme(name) {
        if (name != '' || name != null) {
            if (this.theme[name] !== undefined) {
                this.theme.name = name
                this.updateCurrentTheme();
                this.saveTheme();
                try {
                    this.ThemeChangerWatcher(name, this.theme.currentTheme);
                } catch (err) {};
            } else {
                console.log('theme doesnt exist')
            }
        }

        return this
    }

    getTheme(themeName = this.theme.name, which) {
        if (this.theme[themeName] == undefined) {
            return
        }
        if (which == undefined || !Array.isArray(which)) { //return's full theme options
            return this.theme[themeName]
        }

        var result = {};
        for (let i = 0; i < which.length; i++) {
            let c = which[i]
            try {
                Object.defineProperty(result, c, {
                    value: this.theme[themeName][c],
                    writable: true,
                    enumerable: true
                })
            } catch (err) {
                console.log(err)
            }

        }
        return result;
    }

    saveTheme() {
        let db_theme = {
            activate: this.theme.name,
            styles: {}
        }
        for (let u = 0; u < this.theme.names.length; u++) {
            let ct = this.theme.names[u];
            let theme = this.theme[ct];
            if (theme !== undefined && typeof theme === 'object' && !Array.isArray(theme)) {
                Object.defineProperty(db_theme.styles, ct, {
                    value: theme,
                    enumerable: true,
                    writable: true
                })
            }
        }
        //now we save to localStorage
        localStorage.setItem('VUE_THEME_MANAGER', JSON.stringify(db_theme));
        return this
    }

    setThemeFromStorage() {
        let th = localStorage.getItem('VUE_THEME_MANAGER');
        if (th !== null) {
            this.init(JSON.parse(th));
        }
        //get from localStorge then initialize
        return this
    }



    hasThemeInDB() {
        let th = localStorage.getItem('VUE_THEME_MANAGER');
        if (th !== null) {
            return true
        }
        return false
    }

    activateThemechangeListenser(name, options) {
        this.onThemeChangedListener(name, options);
    }


}
const VueThemeManager = {
    install(Vue, options) {
        Vue.prototype.$AppTheme = new ThemeManager(options);
        Vue.mixin({
            mounted() {
                this.$AppTheme.setReadyListener();
                this.$AppTheme.setThemeChangeListener((res) => {
                    this.$AppTheme.activateThemechangeListenser(res);
                });
            },
            computed: {
                VueThemeManager() {
                    let currentTheme = {};
                    var theme = this.$AppTheme.theme.currentTheme;
                    let keys = Object.keys(theme);

                    for (var i = 0; i < keys.length; i++) {
                        let ck = keys[i];
                        let cp = theme[ck];
                        let tokebalcase = ck.replace(/\B(?:([A-Z])(?=[a-z]))|(?:(?<=[a-z0-9])([A-Z]))/g, '-$1$2').toLowerCase(); //convert to --xxx-xx for css variables
                        Object.defineProperty(currentTheme, '--' + tokebalcase, {
                            value: cp,
                            enumerable: true,
                            writable: true
                        });
                    }
                    return currentTheme
                }
            }
        });
    }
}

export default VueThemeManager;
