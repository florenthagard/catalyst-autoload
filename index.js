const fs   		 = require('fs');
const path   	 = require('path');

let modules 	 = {
	FWD : {},
	PWD : {},
	MDL : {}
};

process.env.FWD  = path.normalize(__dirname+"/../../");

Object.defineProperty(String.prototype, "class", {
	enumerable   : false,
	configurable : false,
	get          : function(){

		let context   = this.valueOf().split('::');
		let namespace = context.pop();
			context   = context.shift() || "FWD";
		let filename  = namespace.split('/').pop();

		if (modules[context][filename]){
			return modules[context][filename];
		}

		let pathName  	 = path.normalize(process.env[context] + '/' + namespace);

		try {
			let classLoad = require(pathName);
			if (classLoad.name && classLoad.name === filename){
				return modules[context][namespace] = classLoad;
			}	return classLoad;
		} catch(e) {
			console.log(namespace,e);
			let ReferenceError = /ReferenceError: (.*) is/gi.exec(e.stack);
			if (ReferenceError){
				console.log(e);
				process.exit();
			}

			let Error = /Error:.*'(.*)'/gi.exec(e.stack);

			if (Error && e.code === "MODULE_NOT_FOUND"){
				let indexPathName = pathName +'/index';
				let basePathName  = pathName +'/'+ path.basename(pathName);

				if (fs.existsSync(indexPathName)){
					return indexPathName.class
				}

				if (fs.existsSync(basePathName)){
					return basePathName.class
				}

				let inThisNameSpace = RegExp('\\((.*):.*:.*',"gi").exec(e.stack.split('\n')[6]);
				if (inThisNameSpace && inThisNameSpace[1] !== __filename){
					inThisNameSpace = path.dirname(inThisNameSpace[1]) + '/' +namespace;
				
					return inThisNameSpace.class;
				}
			}
		}

		console.log(context + '::' + namespace);
		return context + '::' + namespace;
	}
});

Object.defineProperty(String.prototype, "module", {
	enumerable   : false,
	configurable : false,
	get          : function(){
		let moduleName = this.valueOf();
		if ( modules.MDL[moduleName] ){
			return modules.MDL[moduleName]
		}

		return modules.MDL[moduleName] = require(moduleName);
	}
});

Object.defineProperty(String.prototype, "global", {
	enumerable   : false,
	configurable : false,
	get          : function(){
		let context = this.valueOf();
		let base    = path.basename(context);
		return global[base] = context.class;
	}
});

module.exports = String;