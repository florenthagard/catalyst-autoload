const fs   		 = require('fs');
const path   	 = require('path');
let modules 	 = {};

process.env.FWD  = path.normalize(__dirname+"/../../");

Object.defineProperty(String.prototype, "class", {
	enumerable   : false,
	configurable : false,
	get          : function(){

		let context = this.valueOf();
		if (modules[context]){
			return modules[context];
		}	
			context   = this.valueOf().split('::');
		let namespace = context.pop();
			context   = context.shift() || "FWD";
		let filename  = namespace.split('/').pop();


		if (fs.existsSync(process.env[context] + '/' + namespace + '.js')
		||  fs.existsSync(process.env[context] + '/' + namespace + '.json')){
			let classLoad = require(process.env[context] + '/' + namespace);
			console.log(classLoad)
			if (classLoad.name && classLoad.name === filename){
				return modules[context] = classLoad;
			}	return classLoad;
		}

		return context + '::' + namespace;
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