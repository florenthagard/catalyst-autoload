const fs   		 = require('fs');
const path   	 = require('path');
process.env.FWD  = path.normalize( __dirname + "/../../" ).replace(/\/$/,'');
global.modules 	 = {
	FWD : {},
	PWD : {},
	MDL : {}
};

Object.defineProperty(String.prototype, "class", {
	enumerable   : false,
	configurable : false,
	get          : function(){

		let context   = this.valueOf().split('::');
		let namespace = context.pop();
			context   = context.shift() || 'FWD';
		let filename  = namespace.split('/').pop();

		if (modules[context][filename]){
			return modules[context][filename];
		}

		let pathName  = path.normalize(process.env[context] + '/' + namespace);
		try {
			let classLoad = require(pathName);
			if (classLoad.name && classLoad.name === filename){
				return modules[context][namespace] = classLoad;
			}	return classLoad;
		} catch(e) {
			let ReferenceError = /ReferenceError: (.*) is/gi.exec(e.stack);
			if (ReferenceError){
				console.log(e);
				process.exit();
			}
			let Error = /Error:.*'(.*)'/gi.exec(e.stack);
			if (Error && e.code === "MODULE_NOT_FOUND"){
				let indexPathName = namespace +'/index';
				let basePathName  = namespace +'/'+ path.basename(pathName);

				if (fs.existsSync(process.env[context] +'/'+ indexPathName + '.js')){
					return indexPathName.class
				}

				if (fs.existsSync(process.env[context] +'/'+ basePathName + '.js')){
					return basePathName.class
				}

				let inThisNameSpace = RegExp('\\((?:' + process.env.PWD + '|' + process.env.FWD + ')(.*):.*:.*',"gi").exec(e.stack.split('\n')[9]);
				if (inThisNameSpace && !__filename.match(inThisNameSpace[1]+'$')){
					inThisNameSpace = path.dirname(inThisNameSpace[1]) + '/' +namespace;
					
					return inThisNameSpace.class;
				}

				if (!namespace.match(/::/gi)){
					return ('PWD::' + path.normalize(namespace)).class
				}
			}
		}

		return namespace.replace(/(P|F)WD::/gi,'');
	}
});

Object.defineProperty(String.prototype, "module", {
	enumerable   : false,
	configurable : false,
	get          : function(){
		let moduleName = this.valueOf();
		if ( modules.MDL[moduleName] ){
			return modules.MDL[moduleName]
		} 	return modules.MDL[moduleName] = require(moduleName);
	}
});

Object.defineProperty(String.prototype, "global", {
	enumerable   : false,
	configurable : false,
	get          : function(){
		let context = this.valueOf();
		let base    = path.basename(context);

		if ( global[base] ){
			return global[base];
		} 	return global[base] = context.class;
	}
});

Object.defineProperty(Object.prototype, "global", {
	enumerable   : false,
	configurable : false,
	get          : function(){
		if (!this.name || global[this.name]){
			throw new Error('Cant register '+ this.name +' for a global access');
		}	return global[this.name] = this;
	}
});
