const fs   		 = require('fs');
const path   	 = require('path');

let modules 	 = {
	FWD : {},
	CWD : {},
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
		let pathNameStat = fs.lstatSync(pathName);

		if(!fs.existsSync(pathName)){
			console.log(pathNameStat)
		}

		if (fs.existsSync(pathName + '.js')
		||  fs.existsSync(pathName + '.json')){
			try {
				let classLoad = require(pathName);
				if (classLoad.name && classLoad.name === filename){
					return modules[context][namespace] = classLoad;
				}	return classLoad;
			} catch(e) {
				console.log(e,modules);
				let className = /ReferenceError: (.*) is/gi.exec(e.stack);
				if (className){
					className[1].class;
					return namespace.class;
				}
			}
		} else {
			console.log("ca passe pas");

			let pathToExploreStat 				= fs.lstatSync(dirname + '/' + pathToExplore);
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